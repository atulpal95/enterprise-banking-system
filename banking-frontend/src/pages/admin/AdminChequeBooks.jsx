import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  getChequeBookRequests,
  approveChequeBook,
  rejectChequeBook,
  dispatchChequeBook,
  deliverChequeBook,
} from "../../api/adminApi";
import "../../assets/styles/admin-cheque-books.css";

const STATUSES = [
  "ALL",
  "REQUESTED",
  "APPROVED",
  "REJECTED",
  "DISPATCHED",
  "DELIVERED",
];

function AdminChequeBooks() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modal, setModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const status = (value) => String(value || "").toUpperCase();

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await getChequeBookRequests();
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Cheque book loading error:", error);
      toast.error(
        error.response?.data?.message ||
          "Unable to load cheque book requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const closeModal = () => {
    if (actionLoading) return;
    setModal(null);
    setSelectedRequest(null);
    setRejectionReason("");
  };

  const openModal = (type, request) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setModal(type);
  };

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shortDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const leaves = (value) =>
    value === null || value === undefined
      ? "—"
      : `${value} ${Number(value) === 1 ? "Leaf" : "Leaves"}`;

  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase();

    return requests.filter((item) => {
      const itemStatus = status(item.status);
      const matchesSearch =
        !q ||
        String(item.customerEmail || "").toLowerCase().includes(q) ||
        String(item.id || "").toLowerCase().includes(q);

      return (
        matchesSearch &&
        (statusFilter === "ALL" || itemStatus === statusFilter)
      );
    });
  }, [requests, search, statusFilter]);

  const summary = useMemo(() => {
    const count = (value) =>
      requests.filter((item) => status(item.status) === value).length;

    return {
      total: requests.length,
      requested: count("REQUESTED"),
      approved: count("APPROVED"),
      rejected: count("REJECTED"),
      dispatched: count("DISPATCHED"),
      delivered: count("DELIVERED"),
    };
  }, [requests]);

  const statusClass = (value) => status(value).toLowerCase();

  const statusIcon = (value) =>
    ({
      REQUESTED: "bi-hourglass-split",
      APPROVED: "bi-check-circle-fill",
      REJECTED: "bi-x-circle-fill",
      DISPATCHED: "bi-truck",
      DELIVERED: "bi-box-seam-fill",
    })[status(value)] || "bi-question-circle";

  const runAction = async (apiCall, successMessage) => {
    try {
      setActionLoading(true);
      await apiCall();
      toast.success(successMessage);
      setModal(null);
      setSelectedRequest(null);
      setRejectionReason("");
      await loadRequests();
    } catch (error) {
      console.error("Cheque book action error:", error);
      toast.error(
        error.response?.data?.message ||
          "Unable to complete the action."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = () =>
    runAction(
      () => approveChequeBook(selectedRequest.id),
      "Cheque book request approved successfully."
    );

  const handleReject = () => {
    const reason = rejectionReason.trim();

    if (!reason) {
      toast.error("Please enter a rejection reason.");
      return;
    }

    if (reason.length > 500) {
      toast.error("Rejection reason cannot exceed 500 characters.");
      return;
    }

    runAction(
      () => rejectChequeBook(selectedRequest.id, { reason }),
      "Cheque book request rejected successfully."
    );
  };

  const handleDispatch = () =>
    runAction(
      () => dispatchChequeBook(selectedRequest.id),
      "Cheque book marked as dispatched."
    );

  const handleDeliver = () =>
    runAction(
      () => deliverChequeBook(selectedRequest.id),
      "Cheque book marked as delivered."
    );

  const actionButton = (request) => {
    const s = status(request.status);

    return (
      <>
        <button
          type="button"
          className="acb-action view"
          onClick={() => openModal("view", request)}
        >
          <i className="bi bi-eye" /> View
        </button>

        {s === "REQUESTED" && (
          <>
            <button
              type="button"
              className="acb-action approve"
              disabled={actionLoading}
              onClick={() => openModal("approve", request)}
            >
              <i className="bi bi-check-lg" /> Approve
            </button>

            <button
              type="button"
              className="acb-action reject"
              disabled={actionLoading}
              onClick={() => openModal("reject", request)}
            >
              <i className="bi bi-x-lg" /> Reject
            </button>
          </>
        )}

        {s === "APPROVED" && (
          <button
            type="button"
            className="acb-action dispatch"
            disabled={actionLoading}
            onClick={() => openModal("dispatch", request)}
          >
            <i className="bi bi-truck" /> Dispatch
          </button>
        )}

        {s === "DISPATCHED" && (
          <button
            type="button"
            className="acb-action deliver"
            disabled={actionLoading}
            onClick={() => openModal("deliver", request)}
          >
            <i className="bi bi-box-seam" /> Deliver
          </button>
        )}
      </>
    );
  };

  return (
    <div className="admin-cheque-books-page">
      <section className="acb-hero">
        <div className="acb-hero-content">
          <span className="acb-hero-label">CHEQUEBOOK MANAGEMENT</span>
          <h1>CHEQUE BOOK MANAGEMENT</h1>
          <p>Review and Manage Customers ChequeBook Application</p>
        </div>

        <button
          type="button"
          className="acb-hero-refresh"
          disabled={loading}
          onClick={loadRequests}
        >
          <i className="bi bi-arrow-clockwise" />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </section>

      <section className="acb-summary">
        <Summary title="Total Requests" value={summary.total} icon="bi-journal-text" type="total" active={statusFilter === "ALL"} onClick={() => setStatusFilter("ALL")} />
        <Summary title="Requested" value={summary.requested} icon="bi-hourglass-split" type="requested" active={statusFilter === "REQUESTED"} onClick={() => setStatusFilter("REQUESTED")} />
        <Summary title="Approved" value={summary.approved} icon="bi-check-circle" type="approved" active={statusFilter === "APPROVED"} onClick={() => setStatusFilter("APPROVED")} />
        <Summary title="Rejected" value={summary.rejected} icon="bi-x-circle" type="rejected" active={statusFilter === "REJECTED"} onClick={() => setStatusFilter("REJECTED")} />
        <Summary title="Dispatched" value={summary.dispatched} icon="bi-truck" type="dispatched" active={statusFilter === "DISPATCHED"} onClick={() => setStatusFilter("DISPATCHED")} />
        <Summary title="Delivered" value={summary.delivered} icon="bi-box-seam" type="delivered" active={statusFilter === "DELIVERED"} onClick={() => setStatusFilter("DELIVERED")} />
      </section>

      <section className="acb-card">
        <div className="acb-toolbar">
          <div>
            <h3>Cheque Book Requests</h3>
            <span>{filteredRequests.length} of {requests.length} requests</span>
          </div>

          <div className="acb-filters">
            <div className="acb-search">
              <i className="bi bi-search" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email or request ID..."
              />
              {search && (
                <button type="button" onClick={() => setSearch("")}>×</button>
              )}
            </div>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item === "ALL" ? "All Statuses" : item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="acb-state">
            <div className="acb-spinner" />
            <p>Loading cheque book requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="acb-state empty">
            <i className="bi bi-journal-x" />
            <h3>No cheque book requests found</h3>
            <p>Try changing the search or status filter.</p>
          </div>
        ) : (
          <div className="acb-table-wrap">
            <table className="acb-table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Customer</th>
                  <th>Leaves</th>
                  <th>Status</th>
                  <th>Request Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td><strong className="acb-request-id">#{request.id}</strong></td>
                    <td>
                      <div className="acb-customer">
                        <span className="acb-avatar"><i className="bi bi-person" /></span>
                        <span>{request.customerEmail || "—"}</span>
                      </div>
                    </td>
                    <td>
                      <span className="acb-leaves">
                        <i className="bi bi-file-earmark-text" />
                        {leaves(request.numberOfLeaves)}
                      </span>
                    </td>
                    <td>
                      <span className={`acb-status ${statusClass(request.status)}`}>
                        <i className={`bi ${statusIcon(request.status)}`} />
                        {status(request.status) || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="acb-date">{shortDate(request.requestDate)}</td>
                    <td><div className="acb-actions">{actionButton(request)}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal && selectedRequest && (
        <ModalShell onClose={closeModal} locked={actionLoading}>
          {modal === "view" && (
            <ViewModal
              request={selectedRequest}
              statusClass={statusClass}
              statusIcon={statusIcon}
              leaves={leaves}
              formatDate={formatDate}
              closeModal={closeModal}
            />
          )}

          {modal === "approve" && (
            <ActionModal
              label="CHEQUE BOOK APPROVAL"
              title="Approve Request"
              icon="bi-check-circle-fill"
              type="approve"
              request={selectedRequest}
              leaves={leaves}
              shortDate={shortDate}
              question="Approve this cheque book request?"
              description="Please confirm that you want to approve this request."
              info="After approval, this request can be moved to the dispatch stage."
              infoIcon="bi-info-circle"
              cancel={closeModal}
              confirm={handleApprove}
              loading={actionLoading}
              confirmText="Confirm Approval"
              loadingText="Approving..."
              confirmIcon="bi-check-lg"
            />
          )}

          {modal === "reject" && (
            <RejectModal
              request={selectedRequest}
              reason={rejectionReason}
              setReason={setRejectionReason}
              cancel={closeModal}
              confirm={handleReject}
              loading={actionLoading}
            />
          )}

          {modal === "dispatch" && (
            <ActionModal
              label="CHEQUE BOOK FULFILLMENT"
              title="Dispatch Cheque Book"
              icon="bi-truck"
              type="dispatch"
              request={selectedRequest}
              leaves={leaves}
              shortDate={shortDate}
              question="Dispatch this cheque book?"
              description="Confirm that this approved cheque book is ready for dispatch."
              info="After confirmation, the request will move to DISPATCHED."
              infoIcon="bi-truck"
              cancel={closeModal}
              confirm={handleDispatch}
              loading={actionLoading}
              confirmText="Confirm Dispatch"
              loadingText="Dispatching..."
              confirmIcon="bi-truck"
            />
          )}

          {modal === "deliver" && (
            <ActionModal
              label="CHEQUE BOOK DELIVERY"
              title="Mark as Delivered"
              icon="bi-box-seam-fill"
              type="deliver"
              request={selectedRequest}
              leaves={leaves}
              shortDate={shortDate}
              question="Mark this cheque book as delivered?"
              description="Confirm that the cheque book has been delivered to the customer."
              info="After confirmation, the request will move to DELIVERED."
              infoIcon="bi-check-circle"
              cancel={closeModal}
              confirm={handleDeliver}
              loading={actionLoading}
              confirmText="Confirm Delivery"
              loadingText="Delivering..."
              confirmIcon="bi-box-seam"
            />
          )}
        </ModalShell>
      )}
    </div>
  );
}

function Summary({ title, value, icon, type, active, onClick }) {
  return (
    <button
      type="button"
      className={`acb-summary-card ${type} ${active ? "active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={`Show ${title}`}
    >
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
      <div className="acb-summary-icon">
        <i className={`bi ${icon}`} />
      </div>
    </button>
  );
}

function ModalShell({ children, onClose, locked }) {
  return (
    <div className="acb-overlay" onClick={() => { if (!locked) onClose(); }}>
      <div className="acb-modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ label, title, type, onClose, locked }) {
  return (
    <div className="acb-modal-header">
      <div>
        <span className={type}>{label}</span>
        <h2>{title}</h2>
      </div>
      <button type="button" disabled={locked} onClick={onClose}>×</button>
    </div>
  );
}

function ViewModal({ request, statusClass, statusIcon, leaves, formatDate, closeModal }) {
  const requestStatus = String(request.status || "").toUpperCase();
  const isRejected = requestStatus === "REJECTED";

  return (
    <>
      <ModalHeader
        label="CHEQUE BOOK REQUEST"
        title={`Request #${request.id}`}
        onClose={closeModal}
      />

      <div className="acb-view-content">
        <div className="acb-view-icon">
          <i className="bi bi-journal-text" />
        </div>

        <h3>Cheque Book Request Details</h3>
        <p>Information currently returned by the admin cheque-book API.</p>

        <div className="acb-detail-grid">
          <Detail label="Request ID" value={`#${request.id}`} />

          <Detail
            label="Status"
            value={
              <span className={`acb-status ${statusClass(request.status)}`}>
                <i className={`bi ${statusIcon(request.status)}`} />
                {requestStatus}
              </span>
            }
          />

          <Detail label="Customer Email" value={request.customerEmail || "—"} full />

          <Detail label="Number of Leaves" value={leaves(request.numberOfLeaves)} />

          <Detail label="Request Date" value={formatDate(request.requestDate)} />

          {/* FIX: rejected requests now show Rejected Date and Rejected By */}
          {isRejected ? (
            <>
              <Detail
                label="Rejected Date"
                value={formatDate(request.rejectedDate)}
              />
              <Detail
                label="Rejected By"
                value={request.rejectedBy || "—"}
              />
            </>
          ) : (
            <>
              <Detail
                label="Approved Date"
                value={formatDate(request.approvedDate)}
              />
              <Detail
                label="Approved By"
                value={request.approvedBy || "—"}
              />
            </>
          )}

          <Detail
            label="Dispatched Date"
            value={formatDate(request.dispatchedDate)}
          />

          <Detail
            label="Delivered Date"
            value={formatDate(request.deliveredDate)}
          />

          {request.rejectionReason && (
            <Detail
              label="Rejection Reason"
              value={request.rejectionReason}
              full
            />
          )}
        </div>
      </div>

      <div className="acb-footer">
        <button type="button" className="acb-cancel" onClick={closeModal}>
          Close
        </button>
      </div>
    </>
  );
}

function Detail({ label, value, full = false }) {
  return (
    <div className={`acb-detail ${full ? "full" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ActionModal({
  label,
  title,
  icon,
  type,
  request,
  leaves,
  shortDate,
  question,
  description,
  info,
  infoIcon,
  cancel,
  confirm,
  loading,
  confirmText,
  loadingText,
  confirmIcon,
}) {
  return (
    <>
      <ModalHeader label={label} title={title} type={type} onClose={cancel} locked={loading} />

      <div className="acb-action-content">
        <div className={`acb-action-icon ${type}`}>
          <i className={`bi ${icon}`} />
        </div>

        <h3>{question}</h3>
        <p>{description}</p>

        <div className="acb-customer-box">
          <i className="bi bi-person-circle" />
          <strong>{request.customerEmail || "—"}</strong>
        </div>

        <div className="acb-info-grid">
          <div>
            <span>Cheque Leaves</span>
            <strong>{leaves(request.numberOfLeaves)}</strong>
          </div>
          <div>
            <span>Request Date</span>
            <strong>{shortDate(request.requestDate)}</strong>
          </div>
        </div>

        <div className={`acb-warning ${type}`}>
          <i className={`bi ${infoIcon}`} />
          <span>{info}</span>
        </div>
      </div>

      <div className="acb-footer">
        <button type="button" className="acb-cancel" disabled={loading} onClick={cancel}>
          Cancel
        </button>

        <button type="button" className={`acb-confirm ${type}`} disabled={loading} onClick={confirm}>
          <i className={`bi ${confirmIcon}`} />
          {loading ? loadingText : confirmText}
        </button>
      </div>
    </>
  );
}

function RejectModal({ request, reason, setReason, cancel, confirm, loading }) {
  return (
    <>
      <ModalHeader
        label="CHEQUE BOOK REVIEW"
        title="Reject Request"
        type="reject"
        onClose={cancel}
        locked={loading}
      />

      <div className="acb-action-content">
        <div className="acb-action-icon reject">
          <i className="bi bi-x-circle-fill" />
        </div>

        <h3>Reject this cheque book request?</h3>
        <p>A rejection reason is required.</p>

        <div className="acb-customer-box">
          <i className="bi bi-person-circle" />
          <strong>{request.customerEmail || "—"}</strong>
        </div>

        <div className="acb-form">
          <div className="acb-form-row">
            <label htmlFor="chequeRejectReason">
              Rejection Reason <span>*</span>
            </label>
            <small>{reason.length}/500</small>
          </div>

          <textarea
            id="chequeRejectReason"
            value={reason}
            maxLength={500}
            rows={5}
            placeholder="Enter the reason for rejecting this request..."
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="acb-warning reject">
          <i className="bi bi-exclamation-triangle" />
          <span>
            The rejection reason will be submitted to the banking backend.
          </span>
        </div>
      </div>

      <div className="acb-footer">
        <button type="button" className="acb-cancel" disabled={loading} onClick={cancel}>
          Cancel
        </button>

        <button
          type="button"
          className="acb-confirm reject"
          disabled={loading || !reason.trim()}
          onClick={confirm}
        >
          <i className="bi bi-x-lg" />
          {loading ? "Rejecting..." : "Confirm Rejection"}
        </button>
      </div>
    </>
  );
}

export default AdminChequeBooks;