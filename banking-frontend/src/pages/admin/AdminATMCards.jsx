import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  getATMRequests,
  approveATMCard,
  rejectATMCard,
  blockATMCard,
  unblockATMCard,
} from "../../api/adminApi";

import "../../assets/styles/admin-atm-cards.css";

function AdminATMCards() {
  const [cards, setCards] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [actionLoading, setActionLoading] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const [approveOpen, setApproveOpen] = useState(false);

  const [rejectOpen, setRejectOpen] = useState(false);

  const [blockOpen, setBlockOpen] = useState(false);

  const [unblockOpen, setUnblockOpen] = useState(false);

  const [rejectionReason, setRejectionReason] = useState("");

  // =====================================================
  // LOAD ATM REQUESTS
  // =====================================================

  const loadATMRequests = async () => {
    try {
      setLoading(true);

      const response = await getATMRequests();

      setCards(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("ATM management error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load ATM card requests.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadATMRequests();
  }, []);

  // =====================================================
  // SUMMARY
  // =====================================================

  const summary = useMemo(() => {
    return {
      total: cards.length,

      pending: cards.filter((card) => card.status === "PENDING").length,

      active: cards.filter((card) => card.status === "ACTIVE").length,

      blocked: cards.filter((card) => card.status === "BLOCKED").length,

      rejected: cards.filter((card) => card.status === "REJECTED").length,
    };
  }, [cards]);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredCards = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return cards.filter((card) => {
      const matchesSearch =
        !searchValue || card.customerEmail?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" || card.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [cards, search, statusFilter]);

  // =====================================================
  // OPEN APPROVE MODAL
  // =====================================================

  const openApproveModal = (card) => {
    setSelectedCard(card);

    setApproveOpen(true);
  };

  // =====================================================
  // APPROVE ATM CARD
  // =====================================================

  const handleApprove = async () => {
    if (!selectedCard) {
      return;
    }

    try {
      setActionLoading(true);

      await approveATMCard(selectedCard.id);

      toast.success("ATM card approved successfully.");

      setApproveOpen(false);

      setSelectedCard(null);

      await loadATMRequests();
    } catch (error) {
      console.error("ATM approval error:", error);

      toast.error(
        error.response?.data?.message || "Unable to approve ATM card.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // OPEN REJECT
  // =====================================================

  const openRejectModal = (card) => {
    setSelectedCard(card);

    setRejectionReason("");

    setRejectOpen(true);
  };

  // =====================================================
  // REJECT
  // =====================================================

  const handleReject = async () => {
    if (!selectedCard) {
      return;
    }

    const reason = rejectionReason.trim();

    if (!reason) {
      toast.error("Please enter a rejection reason.");

      return;
    }

    try {
      setActionLoading(true);

      await rejectATMCard(selectedCard.id, {
        reason,
      });

      toast.success("ATM card request rejected.");

      setRejectOpen(false);

      setSelectedCard(null);

      setRejectionReason("");

      await loadATMRequests();
    } catch (error) {
      console.error("ATM rejection error:", error);

      toast.error(
        error.response?.data?.message || "Unable to reject ATM card.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // BLOCK
  // =====================================================

  const openBlockModal = (card) => {
    setSelectedCard(card);
    setBlockOpen(true);
  };

  const handleBlock = async () => {
    if (!selectedCard) return;

    try {
      setActionLoading(true);
      await blockATMCard(selectedCard.customerEmail);

      toast.success("ATM card blocked successfully.");

      setBlockOpen(false);
      setSelectedCard(null);
      await loadATMRequests();
    } catch (error) {
      console.error("ATM block error:", error);
      toast.error(
        error.response?.data?.message || "Unable to block ATM card.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // UNBLOCK
  // =====================================================

  const openUnblockModal = (card) => {
    setSelectedCard(card);
    setUnblockOpen(true);
  };

  const handleUnblock = async () => {
    if (!selectedCard) return;

    try {
      setActionLoading(true);
      await unblockATMCard(selectedCard.customerEmail);

      toast.success("ATM card unblocked successfully.");

      setUnblockOpen(false);
      setSelectedCard(null);
      await loadATMRequests();
    } catch (error) {
      console.error("ATM unblock error:", error);
      toast.error(
        error.response?.data?.message || "Unable to unblock ATM card.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCardNumber = (number) => {
    if (!number) {
      return "—";
    }

    const clean = String(number).replace(/\s/g, "");

    if (clean.length < 4) {
      return "****";
    }

    return `**** **** **** ${clean.slice(-4)}`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "active";

      case "BLOCKED":
        return "blocked";

      case "REJECTED":
        return "rejected";

      case "PENDING":
        return "pending";

      default:
        return "default";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-atm-page">
        <div className="admin-atm-loading">
          <div className="spinner-border text-primary" role="status" />

          <p>Loading ATM card management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-atm-page">
      {/* =================================================
                HERO
            ================================================= */}

      <section className="admin-atm-hero">
        <div className="admin-atm-hero-content">
          <span className="admin-atm-label">ATM CARD MANAGEMENT</span>

          <h1>ATM Card Management</h1>

          <p>
            Review customer ATM card requests and manage card status securely.
          </p>
        </div>

        <div className="admin-atm-hero-actions">
          <button
            type="button"
            className="admin-atm-refresh"
            onClick={loadATMRequests}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise"></i>
            Refresh
          </button>
        </div>
      </section>

      {/* =================================================
                SUMMARY
            ================================================= */}

      <section className="admin-atm-summary">
        <SummaryCard
          title="Total Cards"
          value={summary.total}
          icon="bi-credit-card-2-front-fill"
          type="blue"
        />

        <SummaryCard
          title="Pending Requests"
          value={summary.pending}
          icon="bi-hourglass-split"
          type="orange"
        />

        <SummaryCard
          title="Active Cards"
          value={summary.active}
          icon="bi-check-circle-fill"
          type="green"
        />

        <SummaryCard
          title="Blocked Cards"
          value={summary.blocked}
          icon="bi-lock-fill"
          type="red"
        />

        <SummaryCard
          title="Rejected"
          value={summary.rejected}
          icon="bi-x-circle-fill"
          type="gray"
        />
      </section>

      {/* =================================================
                MANAGEMENT CARD
            ================================================= */}

      <section className="admin-atm-management-card">
        {/* FILTER HEADER */}

        <div className="admin-atm-toolbar">
          <div>
            <h2>ATM Card Requests</h2>

            <p>Review and manage customer card applications.</p>
          </div>

          <div className="admin-atm-filters">
            <div className="admin-atm-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search customer email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-atm-status-filter"
            >
              <option value="ALL">All Status</option>

              <option value="PENDING">Pending</option>

              <option value="ACTIVE">Active</option>

              <option value="BLOCKED">Blocked</option>

              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* =================================================
                    TABLE
                ================================================= */}

        <div className="admin-atm-table-wrapper">
          <table className="admin-atm-table">
            <thead>
              <tr>
                <th>#</th>

                <th>CUSTOMER</th>

                <th>STATUS</th>

                <th>REQUEST DATE</th>

                <th>CARD NUMBER</th>

                <th>EXPIRY</th>

                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredCards.length > 0 ? (
                filteredCards.map((card, index) => (
                  <tr key={card.id}>
                    <td>
                      <div className="admin-atm-index">{index + 1}</div>
                    </td>

                    <td>
                      <div className="admin-atm-customer">
                        <div className="admin-atm-avatar">
                          <i className="bi bi-person-fill"></i>
                        </div>

                        <div>
                          <strong>{card.customerEmail}</strong>

                          <span>ATM Request #{card.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`admin-atm-status ${getStatusClass(
                          card.status,
                        )}`}
                      >
                        <span className="status-dot"></span>

                        {card.status}
                      </span>
                    </td>

                    <td>{formatDate(card.requestDate)}</td>

                    <td>
                      <span className="admin-atm-card-number">
                        {formatCardNumber(card.cardNumber)}
                      </span>
                    </td>

                    <td>{formatDate(card.expiryDate)}</td>

                    <td>
                      <div className="admin-atm-actions">
                        <button
                          type="button"
                          className="admin-atm-view-btn"
                          onClick={() => {
                            setSelectedCard(card);

                            setDetailsOpen(true);
                          }}
                        >
                          <i className="bi bi-eye"></i>
                          View
                        </button>

                        {card.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              className="admin-atm-approve-btn"
                              disabled={actionLoading}
                              onClick={() => openApproveModal(card)}
                            >
                              <i className="bi bi-check-lg"></i>
                              Approve
                            </button>

                            <button
                              type="button"
                              className="admin-atm-reject-btn"
                              disabled={actionLoading}
                              onClick={() => openRejectModal(card)}
                            >
                              <i className="bi bi-x-lg"></i>
                              Reject
                            </button>
                          </>
                        )}

                        {card.status === "ACTIVE" && (
                          <button
                            type="button"
                            className="admin-atm-block-btn"
                            disabled={actionLoading}
                            onClick={() => openBlockModal(card)}
                          >
                            <i className="bi bi-lock"></i>
                            Block
                          </button>
                        )}

                        {card.status === "BLOCKED" && (
                          <button
                            type="button"
                            className="admin-atm-unblock-btn"
                            disabled={actionLoading}
                            onClick={() => openUnblockModal(card)}
                          >
                            <i className="bi bi-unlock"></i>
                            Unblock
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="admin-atm-empty">
                    <i className="bi bi-credit-card-2-front"></i>

                    <h3>No ATM cards found</h3>

                    <p>No ATM card requests match your current filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}

        <div className="admin-atm-table-footer">
          Showing <strong>{filteredCards.length}</strong> of{" "}
          <strong>{cards.length}</strong> ATM card records
        </div>
      </section>

      {/* =================================================
                DETAILS MODAL
            ================================================= */}

      {detailsOpen && selectedCard && (
        <div
          className="admin-atm-modal-overlay"
          onClick={() => setDetailsOpen(false)}
        >
          <div className="admin-atm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-atm-modal-header">
              <div>
                <span>ATM CARD DETAILS</span>

                <h2>Card Request #{selectedCard.id}</h2>
              </div>

              <button type="button" onClick={() => setDetailsOpen(false)}>
                ×
              </button>
            </div>

            <div className="admin-atm-detail-grid">
              <DetailItem
                label="Customer Email"
                value={selectedCard.customerEmail}
              />

              <DetailItem label="Status" value={selectedCard.status} status />

              <DetailItem
                label="Request Date"
                value={formatDate(selectedCard.requestDate)}
              />

              <DetailItem
                label="Card Number"
                value={formatCardNumber(selectedCard.cardNumber)}
              />

              <DetailItem
                label="Expiry Date"
                value={formatDate(selectedCard.expiryDate)}
              />

              <DetailItem
                label="Approved Date"
                value={formatDate(selectedCard.approvedDate)}
              />

              <DetailItem
                label="Approved By"
                value={selectedCard.approvedBy || "—"}
              />

              <DetailItem
                label="Rejected Date"
                value={formatDate(selectedCard.rejectedDate)}
              />

              <DetailItem
                label="Rejected By"
                value={selectedCard.rejectedBy || "—"}
              />
            </div>

            {selectedCard.rejectionReason && (
              <div className="admin-atm-rejection-box">
                <span>Rejection Reason</span>

                <p>{selectedCard.rejectionReason}</p>
              </div>
            )}

            <div className="admin-atm-modal-footer">
              <button
                type="button"
                className="admin-atm-close-btn"
                onClick={() => setDetailsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
    APPROVE CONFIRMATION MODAL
================================================= */}

      {approveOpen && selectedCard && (
        <div
          className="admin-atm-modal-overlay"
          onClick={() => {
            if (!actionLoading) {
              setApproveOpen(false);
            }
          }}
        >
          <div
            className="admin-atm-modal admin-atm-approve-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}

            <div className="admin-atm-modal-header">
              <div>
                <span className="admin-atm-approve-label">
                  ATM CARD REQUEST
                </span>

                <h2>Approve ATM Card</h2>
              </div>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setApproveOpen(false)}
              >
                ×
              </button>
            </div>

            {/* CONTENT */}

            <div className="admin-atm-approve-content">
              <div className="admin-atm-approve-icon">
                <i className="bi bi-credit-card-2-front-fill"></i>
              </div>

              <h3>Approve this ATM card request?</h3>

              <p>You are about to approve the ATM card request for:</p>

              <div className="admin-atm-approve-customer">
                <i className="bi bi-person-circle"></i>

                <strong>{selectedCard.customerEmail}</strong>
              </div>

              <div className="admin-atm-approve-warning">
                <i className="bi bi-info-circle"></i>

                <span>
                  Once approved, the system will generate the card number, CVV,
                  PIN and expiry date automatically.
                </span>
              </div>
            </div>

            {/* FOOTER */}

            <div className="admin-atm-modal-footer">
              <button
                type="button"
                className="admin-atm-cancel-btn"
                disabled={actionLoading}
                onClick={() => setApproveOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-atm-confirm-approve-btn"
                disabled={actionLoading}
                onClick={handleApprove}
              >
                <i className="bi bi-check-lg"></i>

                {actionLoading ? "Approving..." : "Confirm Approval"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
                BLOCK CONFIRMATION MODAL
            ================================================= */}

      {blockOpen && selectedCard && (
        <div
          className="admin-atm-modal-overlay"
          onClick={() => {
            if (!actionLoading) {
              setBlockOpen(false);
              setSelectedCard(null);
            }
          }}
        >
          <div
            className="admin-atm-modal admin-atm-action-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-atm-modal-header">
              <div>
                <span className="admin-atm-block-label">ATM CARD SECURITY</span>
                <h2>Block ATM Card</h2>
              </div>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  setBlockOpen(false);
                  setSelectedCard(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="admin-atm-action-content">
              <div className="admin-atm-action-icon block">
                <i className="bi bi-lock-fill"></i>
              </div>

              <h3>Block this ATM card?</h3>
              <p>You are about to block the ATM card for:</p>

              <div className="admin-atm-action-customer">
                <i className="bi bi-person-circle"></i>
                <strong>{selectedCard.customerEmail}</strong>
              </div>

              <div className="admin-atm-action-warning block">
                <i className="bi bi-exclamation-triangle"></i>
                <span>
                  The customer will not be able to use this ATM card until an
                  administrator unblocks it.
                </span>
              </div>
            </div>

            <div className="admin-atm-modal-footer">
              <button
                type="button"
                className="admin-atm-cancel-btn"
                disabled={actionLoading}
                onClick={() => {
                  setBlockOpen(false);
                  setSelectedCard(null);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-atm-confirm-block-btn"
                disabled={actionLoading}
                onClick={handleBlock}
              >
                <i className="bi bi-lock-fill"></i>
                {actionLoading ? "Blocking..." : "Confirm Block"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
                UNBLOCK CONFIRMATION MODAL
            ================================================= */}

      {unblockOpen && selectedCard && (
        <div
          className="admin-atm-modal-overlay"
          onClick={() => {
            if (!actionLoading) {
              setUnblockOpen(false);
              setSelectedCard(null);
            }
          }}
        >
          <div
            className="admin-atm-modal admin-atm-action-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-atm-modal-header">
              <div>
                <span className="admin-atm-unblock-label">ATM CARD SECURITY</span>
                <h2>Unblock ATM Card</h2>
              </div>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  setUnblockOpen(false);
                  setSelectedCard(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="admin-atm-action-content">
              <div className="admin-atm-action-icon unblock">
                <i className="bi bi-unlock-fill"></i>
              </div>

              <h3>Unblock this ATM card?</h3>
              <p>You are about to restore ATM card access for:</p>

              <div className="admin-atm-action-customer">
                <i className="bi bi-person-circle"></i>
                <strong>{selectedCard.customerEmail}</strong>
              </div>

              <div className="admin-atm-action-warning unblock">
                <i className="bi bi-info-circle"></i>
                <span>
                  Once unblocked, the customer will be able to use this ATM
                  card again.
                </span>
              </div>
            </div>

            <div className="admin-atm-modal-footer">
              <button
                type="button"
                className="admin-atm-cancel-btn"
                disabled={actionLoading}
                onClick={() => {
                  setUnblockOpen(false);
                  setSelectedCard(null);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-atm-confirm-unblock-btn"
                disabled={actionLoading}
                onClick={handleUnblock}
              >
                <i className="bi bi-unlock-fill"></i>
                {actionLoading ? "Unblocking..." : "Confirm Unblock"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
                REJECT MODAL
            ================================================= */}

      {rejectOpen && selectedCard && (
        <div
          className="admin-atm-modal-overlay"
          onClick={() => {
            if (!actionLoading) {
              setRejectOpen(false);
            }
          }}
        >
          <div
            className="admin-atm-modal admin-atm-reject-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-atm-modal-header">
              <div>
                <span>ATM CARD REQUEST</span>

                <h2>Reject Request</h2>
              </div>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setRejectOpen(false)}
              >
                ×
              </button>
            </div>

            <p className="admin-atm-reject-description">
              Please provide a reason for rejecting the ATM card request for{" "}
              <strong>{selectedCard.customerEmail}</strong>.
            </p>

            <label className="admin-atm-reason-label">
              Rejection Reason
              <textarea
                rows="5"
                maxLength="500"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                disabled={actionLoading}
              />
            </label>

            <div className="admin-atm-character-count">
              {rejectionReason.length}/500
            </div>

            <div className="admin-atm-modal-footer">
              <button
                type="button"
                className="admin-atm-cancel-btn"
                disabled={actionLoading}
                onClick={() => setRejectOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-atm-confirm-reject-btn"
                disabled={actionLoading}
                onClick={handleReject}
              >
                {actionLoading ? "Rejecting..." : "Reject Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({ title, value, icon, type }) {
  return (
    <div className={`admin-atm-summary-card ${type}`}>
      <div>
        <span>{title}</span>

        <strong>{value}</strong>
      </div>

      <div className="admin-atm-summary-icon">
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
}

// =========================================================
// DETAIL ITEM
// =========================================================

function DetailItem({ label, value, status = false }) {
  return (
    <div className="admin-atm-detail-item">
      <span>{label}</span>

      {status ? (
        <strong className="admin-atm-detail-status">{value}</strong>
      ) : (
        <strong>{value}</strong>
      )}
    </div>
  );
}

export default AdminATMCards;