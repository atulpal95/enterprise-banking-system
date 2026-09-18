import { useEffect, useMemo, useState } from "react";
import {
    FaCheck,
    FaClock,
    FaEye,
    FaLock,
    FaMoneyBillWave,
    FaPiggyBank,
    FaRedo,
    FaSearch,
    FaTimes,
    FaUniversity,
    FaUsers
} from "react-icons/fa";

import {
    getAllFixedDeposits,
    approveFixedDeposit,
    rejectFixedDeposit,
    closeFixedDeposit
} from "../../api/adminApi";

import "../../assets/styles/admin-fixed-deposits.css";


// =====================================================
// HELPERS
// =====================================================

const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(Number(value));
};


const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};


const formatDateTime = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};


const normalizeStatus = (status) =>
    String(status || "UNKNOWN").trim().toUpperCase();


const statusClass = (status) => {
    switch (normalizeStatus(status)) {
        case "PENDING":
            return "pending";

        case "ACTIVE":
            return "active";

        case "REJECTED":
            return "rejected";

        case "CLOSED":
            return "closed";

        default:
            return "unknown";
    }
};


// =====================================================
// CONFIRMATION MODAL
// =====================================================

function ActionModal({
    type,
    fd,
    loading,
    onClose,
    onConfirm
}) {
    if (!type || !fd) {
        return null;
    }

    const isReject = type === "reject";
    const isApprove = type === "approve";
    const isClose = type === "close";

    const [reason, setReason] = useState("");

    useEffect(() => {
        setReason("");
    }, [type, fd?.id]);

    const handleConfirm = () => {
        if (isReject && !reason.trim()) {
            return;
        }

        onConfirm(
            isReject
                ? { reason: reason.trim() }
                : undefined
        );
    };

    let title = "Confirm Action";
    let message = "";
    let icon = <FaCheck />;
    let iconClass = "approve-icon";
    let confirmText = "Confirm";
    let confirmClass = "loan-modal-primary";

    if (isApprove) {
        title = "Approve Fixed Deposit";
        message =
            "Are you sure you want to approve this Fixed Deposit? The FD will become active.";
        icon = <FaCheck />;
        iconClass = "approve-icon";
        confirmText = "Approve FD";
    }

    if (isReject) {
        title = "Reject Fixed Deposit";
        message =
            "Are you sure you want to reject this Fixed Deposit? The principal amount will be refunded to the customer.";
        icon = <FaTimes />;
        iconClass = "reject-icon";
        confirmText = "Reject FD";
        confirmClass = "loan-modal-danger";
    }

    if (isClose) {
        title = "Close Fixed Deposit";
        message =
            "Are you sure you want to close this Fixed Deposit? The maturity amount will be credited to the customer.";
        icon = <FaLock />;
        iconClass = "close-icon";
        confirmText = "Close FD";
        confirmClass = "loan-modal-primary";
    }

    return (
        <div
            className="fd-modal-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading) {
                    onClose();
                }
            }}
        >
            <div
                className="fd-modal fd-action-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="fd-action-title"
            >
                <div className="fd-modal-header">
                    <div>
                        <span>ACTION CONFIRMATION</span>
                        <h2 id="fd-action-title">{title}</h2>
                    </div>

                    <button
                        type="button"
                        className="fd-modal-close"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="fd-modal-body">
                    <div className={`fd-confirm-icon ${iconClass}`}>
                        {icon}
                    </div>

                    <h3>{title}</h3>

                    <p>{message}</p>

                    <div className="fd-confirm-info">
                        <div>
                            <span>FD ID</span>
                            <strong>#{fd.id}</strong>
                        </div>

                        <div>
                            <span>Customer</span>
                            <strong>{fd.customerEmail || "—"}</strong>
                        </div>

                        <div>
                            <span>Principal</span>
                            <strong>
                                {formatCurrency(fd.principalAmount)}
                            </strong>
                        </div>

                        <div>
                            <span>Status</span>
                            <strong>
                                {normalizeStatus(fd.status)}
                            </strong>
                        </div>
                    </div>

                    {isReject && (
                        <div className="fd-reject-field">
                            <label htmlFor="fd-rejection-reason">
                                Rejection Reason <span>*</span>
                            </label>

                            <textarea
                                id="fd-rejection-reason"
                                value={reason}
                                onChange={(event) =>
                                    setReason(event.target.value)
                                }
                                placeholder="Enter the reason for rejecting this Fixed Deposit..."
                                disabled={loading}
                                maxLength={500}
                            />

                            <div className="fd-character-count">
                                {reason.length}/500
                            </div>
                        </div>
                    )}
                </div>

                <div className="fd-modal-footer">
                    <button
                        type="button"
                        className="fd-modal-secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className={confirmClass}
                        onClick={handleConfirm}
                        disabled={
                            loading ||
                            (isReject && !reason.trim())
                        }
                    >
                        {loading ? (
                            <>
                                <span className="fd-button-spinner" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {icon}
                                {confirmText}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}


// =====================================================
// VIEW DETAILS MODAL
// =====================================================

function ViewFDModal({ fd, onClose }) {
    if (!fd) {
        return null;
    }

    return (
        <div
            className="fd-modal-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="fd-modal fd-view-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="fd-view-title"
            >
                <div className="fd-modal-header">
                    <div>
                        <span>FIXED DEPOSIT DETAILS</span>
                        <h2 id="fd-view-title">
                            FD #{fd.id}
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="fd-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="fd-modal-body">
                    <div className="fd-detail-status">
                        <span>Current Status</span>

                        <span
                            className={`fd-status-badge ${statusClass(
                                fd.status
                            )}`}
                        >
                            {normalizeStatus(fd.status)}
                        </span>
                    </div>

                    <div className="fd-detail-section">
                        <h3>FD Information</h3>

                        <div className="fd-detail-grid">
                            <div>
                                <span>FD ID</span>
                                <strong>#{fd.id}</strong>
                            </div>

                            <div>
                                <span>Customer Email</span>
                                <strong>
                                    {fd.customerEmail || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Principal Amount</span>
                                <strong>
                                    {formatCurrency(
                                        fd.principalAmount
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Interest Rate</span>
                                <strong>
                                    {fd.interestRate ?? "—"}%
                                </strong>
                            </div>

                            <div>
                                <span>Tenure</span>
                                <strong>
                                    {fd.tenureMonths
                                        ? `${fd.tenureMonths} month${
                                              fd.tenureMonths === 1
                                                  ? ""
                                                  : "s"
                                          }`
                                        : "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Maturity Amount</span>
                                <strong>
                                    {formatCurrency(
                                        fd.maturityAmount
                                    )}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="fd-detail-section">
                        <h3>Lifecycle Information</h3>

                        <div className="fd-detail-grid">
                            <div>
                                <span>Created Date</span>
                                <strong>
                                    {formatDateTime(
                                        fd.createdDate
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Approved Date</span>
                                <strong>
                                    {formatDateTime(
                                        fd.approvedDate
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Approved By</span>
                                <strong>
                                    {fd.approvedBy || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Rejected Date</span>
                                <strong>
                                    {formatDateTime(
                                        fd.rejectedDate
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Rejected By</span>
                                <strong>
                                    {fd.rejectedBy || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Maturity Date</span>
                                <strong>
                                    {formatDateTime(
                                        fd.maturityDate
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Closed Date</span>
                                <strong>
                                    {formatDateTime(
                                        fd.closedDate
                                    )}
                                </strong>
                            </div>

                            <div className="fd-detail-full">
                                <span>Rejection Reason</span>
                                <strong>
                                    {fd.rejectionReason || "—"}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fd-modal-footer">
                    <button
                        type="button"
                        className="fd-modal-secondary"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}


// =====================================================
// MAIN PAGE
// =====================================================

function AdminFixedDeposits() {

    const [fixedDeposits, setFixedDeposits] = useState([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [selectedFD, setSelectedFD] = useState(null);

    const [viewModalOpen, setViewModalOpen] = useState(false);

    const [actionType, setActionType] = useState(null);

    // =================================================
    // LOAD DATA
    // =================================================

    const loadFixedDeposits = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getAllFixedDeposits();

            const data = Array.isArray(response?.data)
                ? response.data
                : [];

            setFixedDeposits(data);

        } catch (err) {

            console.error(
                "Failed to load fixed deposits:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load Fixed Deposits."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadFixedDeposits();
    }, []);


    // =================================================
    // FILTERING
    // =================================================

    const filteredFDs = useMemo(() => {

        const query = search.trim().toLowerCase();

        return fixedDeposits.filter((fd) => {

            const status = normalizeStatus(fd.status);

            const matchesStatus =
                statusFilter === "ALL" ||
                status === statusFilter;

            if (!matchesStatus) {
                return false;
            }

            if (!query) {
                return true;
            }

            const idMatch = String(fd.id || "")
                .toLowerCase()
                .includes(query);

            const emailMatch = String(
                fd.customerEmail || ""
            )
                .toLowerCase()
                .includes(query);

            return idMatch || emailMatch;

        });

    }, [
        fixedDeposits,
        search,
        statusFilter
    ]);


    // =================================================
    // STATISTICS
    // =================================================

    const statistics = useMemo(() => {

        const result = {
            total: fixedDeposits.length,
            pending: 0,
            active: 0,
            rejected: 0,
            closed: 0
        };

        fixedDeposits.forEach((fd) => {

            const status = normalizeStatus(fd.status);

            if (status === "PENDING") {
                result.pending++;
            }

            if (status === "ACTIVE") {
                result.active++;
            }

            if (status === "REJECTED") {
                result.rejected++;
            }

            if (status === "CLOSED") {
                result.closed++;
            }

        });

        return result;

    }, [fixedDeposits]);


    // =================================================
    // OPEN VIEW MODAL
    // =================================================

    const openViewModal = (fd) => {

        setSelectedFD(fd);
        setViewModalOpen(true);

    };


    const closeViewModal = () => {

        if (actionLoading) {
            return;
        }

        setViewModalOpen(false);
        setSelectedFD(null);

    };


    // =================================================
    // OPEN ACTION MODAL
    // =================================================

    const openActionModal = (type, fd) => {

        setSelectedFD(fd);
        setActionType(type);

    };


    const closeActionModal = () => {

        if (actionLoading) {
            return;
        }

        setActionType(null);
        setSelectedFD(null);

    };


    // =================================================
    // ACTION HANDLER
    // =================================================

    const handleAction = async (payload) => {

        if (!selectedFD || !actionType) {
            return;
        }

        try {

            setActionLoading(true);
            setError("");

            const id = selectedFD.id;

            if (actionType === "approve") {

                await approveFixedDeposit(id);

            } else if (actionType === "reject") {

                await rejectFixedDeposit(
                    id,
                    payload
                );

            } else if (actionType === "close") {

                await closeFixedDeposit(id);

            }

            closeActionModal();

            await loadFixedDeposits();

        } catch (err) {

            console.error(
                "Fixed Deposit action failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to complete the requested action."
            );

        } finally {

            setActionLoading(false);

        }

    };


    // =================================================
    // RENDER
    // =================================================

    return (
        <div className="admin-fixed-deposits-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="fd-page-header">

                <div>
                    <div className="fd-page-eyebrow">
                        ADMINISTRATION
                    </div>

                    <h1>
                        Fixed Deposit Management
                    </h1>

                    <p>
                        Review, approve, reject and close
                        customer Fixed Deposit applications.
                    </p>
                </div>

                <button
                    type="button"
                    className="fd-refresh-btn"
                    onClick={loadFixedDeposits}
                    disabled={loading}
                >
                    <FaRedo
                        className={
                            loading
                                ? "fd-refresh-spinning"
                                : ""
                        }
                    />

                    Refresh
                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="fd-error-banner">

                    <div>
                        <FaTimes />

                        <span>{error}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setError("")}
                        aria-label="Dismiss error"
                    >
                        <FaTimes />
                    </button>

                </div>
            )}


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="fd-summary-grid">

                <div className="fd-summary-card total">

                    <div className="fd-summary-icon">
                        <FaUniversity />
                    </div>

                    <div>
                        <span>Total FDs</span>
                        <strong>
                            {statistics.total}
                        </strong>
                    </div>

                </div>


                <div className="fd-summary-card pending">

                    <div className="fd-summary-icon">
                        <FaClock />
                    </div>

                    <div>
                        <span>Pending</span>
                        <strong>
                            {statistics.pending}
                        </strong>
                    </div>

                </div>


                <div className="fd-summary-card active">

                    <div className="fd-summary-icon">
                        <FaCheck />
                    </div>

                    <div>
                        <span>Active</span>
                        <strong>
                            {statistics.active}
                        </strong>
                    </div>

                </div>


                <div className="fd-summary-card rejected">

                    <div className="fd-summary-icon">
                        <FaTimes />
                    </div>

                    <div>
                        <span>Rejected</span>
                        <strong>
                            {statistics.rejected}
                        </strong>
                    </div>

                </div>


                <div className="fd-summary-card closed">

                    <div className="fd-summary-icon">
                        <FaLock />
                    </div>

                    <div>
                        <span>Closed</span>
                        <strong>
                            {statistics.closed}
                        </strong>
                    </div>

                </div>

            </div>


            {/* =================================================
                FILTER CARD
            ================================================= */}

            <div className="fd-filter-card">

                <div className="fd-search-box">

                    <FaSearch />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search by FD ID or customer email..."
                    />

                    {search && (
                        <button
                            type="button"
                            className="fd-clear-search"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                        >
                            <FaTimes />
                        </button>
                    )}

                </div>


                <div className="fd-status-filter">

                    <label htmlFor="fd-status-filter">
                        Status
                    </label>

                    <select
                        id="fd-status-filter"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >
                        <option value="ALL">
                            All Statuses
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="REJECTED">
                            Rejected
                        </option>

                        <option value="CLOSED">
                            Closed
                        </option>
                    </select>

                </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="fd-table-card">

                <div className="fd-table-header">

                    <div>
                        <h2>
                            Fixed Deposit Requests
                        </h2>

                        <p>
                            Showing{" "}
                            <strong>
                                {filteredFDs.length}
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {fixedDeposits.length}
                            </strong>{" "}
                            records
                        </p>
                    </div>

                    <div className="fd-table-total">
                        <FaPiggyBank />

                        <span>
                            {statistics.total} Total
                        </span>
                    </div>

                </div>


                {loading ? (

                    <div className="fd-loading">

                        <span className="fd-spinner" />

                        <p>
                            Loading Fixed Deposits...
                        </p>

                    </div>

                ) : filteredFDs.length === 0 ? (

                    <div className="fd-empty-state">

                        <div className="fd-empty-icon">
                            <FaUniversity />
                        </div>

                        <h3>
                            No Fixed Deposits Found
                        </h3>

                        <p>
                            No records match the current
                            search or status filter.
                        </p>

                    </div>

                ) : (

                    <div className="fd-table-wrapper">

                        <table className="fd-table">

                            <thead>
                                <tr>

                                    <th>ID</th>

                                    <th>Customer</th>

                                    <th>Principal</th>

                                    <th>Interest</th>

                                    <th>Tenure</th>

                                    <th>Maturity Amount</th>

                                    <th>Status</th>

                                    <th>Created Date</th>

                                    <th>Actions</th>

                                </tr>
                            </thead>

                            <tbody>

                                {filteredFDs.map((fd) => {

                                    const status =
                                        normalizeStatus(
                                            fd.status
                                        );

                                    return (
                                        <tr key={fd.id}>

                                            <td>
                                                <span className="fd-id">
                                                    #{fd.id}
                                                </span>
                                            </td>


                                            <td>

                                                <div className="fd-customer-cell">

                                                    <div className="fd-customer-avatar">
                                                        <FaUsers />
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {fd.customerEmail ||
                                                                "—"}
                                                        </strong>

                                                        <small>
                                                            FD #{fd.id}
                                                        </small>
                                                    </div>

                                                </div>

                                            </td>


                                            <td>
                                                <strong className="fd-money">
                                                    {formatCurrency(
                                                        fd.principalAmount
                                                    )}
                                                </strong>
                                            </td>


                                            <td>
                                                <span className="fd-interest">
                                                    {fd.interestRate ?? "—"}%
                                                </span>
                                            </td>


                                            <td>
                                                <span className="fd-tenure">
                                                    {fd.tenureMonths
                                                        ? `${fd.tenureMonths} mo`
                                                        : "—"}
                                                </span>
                                            </td>


                                            <td>
                                                <strong className="fd-money maturity">
                                                    {formatCurrency(
                                                        fd.maturityAmount
                                                    )}
                                                </strong>
                                            </td>


                                            <td>
                                                <span
                                                    className={`fd-status-badge ${statusClass(
                                                        status
                                                    )}`}
                                                >
                                                    {status}
                                                </span>
                                            </td>


                                            <td>
                                                <span className="fd-date">
                                                    {formatDate(
                                                        fd.createdDate
                                                    )}
                                                </span>
                                            </td>


                                            <td>

                                                <div className="fd-actions">

                                                    <button
                                                        type="button"
                                                        className="fd-action-btn view"
                                                        onClick={() =>
                                                            openViewModal(
                                                                fd
                                                            )
                                                        }
                                                        title="View details"
                                                        aria-label={`View FD ${fd.id}`}
                                                    >
                                                        <FaEye />
                                                    </button>


                                                    {status === "PENDING" && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="fd-action-btn approve"
                                                                onClick={() =>
                                                                    openActionModal(
                                                                        "approve",
                                                                        fd
                                                                    )
                                                                }
                                                                title="Approve FD"
                                                                aria-label={`Approve FD ${fd.id}`}
                                                            >
                                                                <FaCheck />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="fd-action-btn reject"
                                                                onClick={() =>
                                                                    openActionModal(
                                                                        "reject",
                                                                        fd
                                                                    )
                                                                }
                                                                title="Reject FD"
                                                                aria-label={`Reject FD ${fd.id}`}
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </>
                                                    )}


                                                    {status === "ACTIVE" && (
                                                        <button
                                                            type="button"
                                                            className="fd-action-btn close"
                                                            onClick={() =>
                                                                openActionModal(
                                                                    "close",
                                                                    fd
                                                                )
                                                            }
                                                            title="Close FD"
                                                            aria-label={`Close FD ${fd.id}`}
                                                        >
                                                            <FaLock />
                                                        </button>
                                                    )}

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* =================================================
                VIEW MODAL
            ================================================= */}

            {viewModalOpen && (
                <ViewFDModal
                    fd={selectedFD}
                    onClose={closeViewModal}
                />
            )}


            {/* =================================================
                ACTION MODAL
            ================================================= */}

            {actionType && selectedFD && (
                <ActionModal
                    type={actionType}
                    fd={selectedFD}
                    loading={actionLoading}
                    onClose={closeActionModal}
                    onConfirm={handleAction}
                />
            )}

        </div>
    );
}

export default AdminFixedDeposits;