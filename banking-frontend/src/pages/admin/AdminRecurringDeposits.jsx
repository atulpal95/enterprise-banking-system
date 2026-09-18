import { useEffect, useState } from "react";
import {
    getAllRecurringDeposits,
    approveRecurringDeposit,
    rejectRecurringDeposit,
    closeRecurringDeposit,
} from "../../api/adminApi";

import "../../assets/styles/admin-recurring-deposits.css";

function AdminRecurringDeposits() {

    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [actionModal, setActionModal] = useState(null);
    const [notice, setNotice] = useState(null);

    const loadRecurringDeposits = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAllRecurringDeposits();
            setDeposits(response.data || []);
        } catch (err) {
            console.error("Unable to load recurring deposits:", err);
            setError(
                err.response?.data?.message ||
                "Unable to load recurring deposits."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecurringDeposits();
    }, []);

    const showNotice = (type, message) => {
        setNotice({ type, message });

        window.setTimeout(() => {
            setNotice(null);
        }, 4000);
    };

    const openActionModal = (deposit, action) => {
        setActionModal({
            deposit,
            action,
        });
    };

    const closeActionModal = () => {
        if (actionLoading) return;

        setActionModal(null);
    };

    const handleApprove = async () => {
        if (!actionModal || actionModal.action !== "approve") {
            return;
        }

        const { deposit } = actionModal;

        try {
            setActionLoading(`approve-${deposit.id}`);

            await approveRecurringDeposit(deposit.id);

            setActionModal(null);
            showNotice(
                "success",
                "Recurring Deposit approved successfully."
            );

            await loadRecurringDeposits();
        } catch (err) {
            showNotice(
                "error",
                err.response?.data?.message ||
                "Unable to approve Recurring Deposit."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const openRejectModal = (deposit) => {
        setRejectModal(deposit);
        setRejectReason("");
    };

    const closeRejectModal = () => {
        if (actionLoading) return;

        setRejectModal(null);
        setRejectReason("");
    };

    const handleReject = async () => {

        if (!rejectModal) return;

        const reason = rejectReason.trim();

        if (!reason) {
            showNotice(
                "error",
                "Please enter a rejection reason."
            );
            return;
        }

        try {
            setActionLoading(`reject-${rejectModal.id}`);

            await rejectRecurringDeposit(
                rejectModal.id,
                { reason }
            );

            setRejectModal(null);
            setRejectReason("");

            showNotice(
                "success",
                "Recurring Deposit rejected successfully."
            );

            await loadRecurringDeposits();
        } catch (err) {
            showNotice(
                "error",
                err.response?.data?.message ||
                "Unable to reject Recurring Deposit."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleClose = async () => {
        if (!actionModal || actionModal.action !== "close") {
            return;
        }

        const { deposit } = actionModal;

        try {
            setActionLoading(`close-${deposit.id}`);

            await closeRecurringDeposit(deposit.id);

            setActionModal(null);
            showNotice(
                "success",
                "Recurring Deposit closed successfully."
            );

            await loadRecurringDeposits();
        } catch (err) {
            showNotice(
                "error",
                err.response?.data?.message ||
                "Unable to close Recurring Deposit."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (value) => {
        if (!value) return "--";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "--";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatCurrency = (value) => {
        if (value === null || value === undefined) {
            return "--";
        }

        return `₹${Number(value).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
        })}`;
    };

    const getStatusClass = (status) => {
        return status
            ? status.toLowerCase().replace(/\s+/g, "-")
            : "";
    };

    const pendingCount = deposits.filter(
        (item) => item.status === "PENDING"
    ).length;

    const activeCount = deposits.filter(
        (item) => item.status === "ACTIVE"
    ).length;

    const rejectedCount = deposits.filter(
        (item) => item.status === "REJECTED"
    ).length;

    return (
        <div className="admin-rd-page">

            {/* HEADER */}
            <div className="admin-rd-header">

                <div>
                    <span className="admin-rd-eyebrow">
                        FINANCE MANAGEMENT
                    </span>

                    <h1>Recurring Deposits</h1>

                    <p>
                        Review, approve, reject and close customer
                        recurring deposit requests.
                    </p>
                </div>

                <button
                    type="button"
                    className="admin-rd-refresh-btn"
                    onClick={loadRecurringDeposits}
                    disabled={loading}
                >
                    ↻ Refresh
                </button>

            </div>

            {notice && (
                <div
                    role="alert"
                    style={{
                        margin: "0 0 18px",
                        padding: "13px 16px",
                        borderRadius: "12px",
                        border: `1px solid ${
                            notice.type === "success"
                                ? "#bbf7d0"
                                : "#fecaca"
                        }`,
                        background:
                            notice.type === "success"
                                ? "#f0fdf4"
                                : "#fef2f2",
                        color:
                            notice.type === "success"
                                ? "#166534"
                                : "#991b1b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        fontWeight: 600,
                    }}
                >
                    <span>{notice.message}</span>

                    <button
                        type="button"
                        onClick={() => setNotice(null)}
                        style={{
                            border: "none",
                            background: "transparent",
                            color: "inherit",
                            cursor: "pointer",
                            fontSize: "18px",
                            lineHeight: 1,
                        }}
                        aria-label="Dismiss notification"
                    >
                        ×
                    </button>
                </div>
            )}


            {/* SUMMARY */}
            <div className="admin-rd-summary">

                <div className="admin-rd-summary-card">
                    <span>Total RD</span>
                    <strong>{deposits.length}</strong>
                </div>

                <div className="admin-rd-summary-card pending">
                    <span>Pending</span>
                    <strong>{pendingCount}</strong>
                </div>

                <div className="admin-rd-summary-card active">
                    <span>Active</span>
                    <strong>{activeCount}</strong>
                </div>

                <div className="admin-rd-summary-card rejected">
                    <span>Rejected</span>
                    <strong>{rejectedCount}</strong>
                </div>

            </div>


            {/* CONTENT */}
            <div className="admin-rd-content">

                {loading ? (

                    <div className="admin-rd-state">
                        <div className="admin-rd-loader" />
                        <p>Loading recurring deposits...</p>
                    </div>

                ) : error ? (

                    <div className="admin-rd-state error">
                        <div className="admin-rd-state-icon">!</div>
                        <h3>Unable to load data</h3>
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={loadRecurringDeposits}
                        >
                            Try Again
                        </button>
                    </div>

                ) : deposits.length === 0 ? (

                    <div className="admin-rd-state">
                        <div className="admin-rd-state-icon">₹</div>
                        <h3>No Recurring Deposits Found</h3>
                        <p>
                            There are currently no recurring deposit
                            requests in the system.
                        </p>
                    </div>

                ) : (

                    <div className="admin-rd-table-wrapper">

                        <table className="admin-rd-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Monthly Installment</th>
                                    <th>Interest</th>
                                    <th>Tenure</th>
                                    <th>Total Deposited</th>
                                    <th>Maturity Amount</th>
                                    <th>Created</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {deposits.map((rd) => {

                                    const isPending =
                                        rd.status === "PENDING";

                                    const isActive =
                                        rd.status === "ACTIVE";

                                    const busy =
                                        actionLoading !== null &&
                                        (
                                            actionLoading ===
                                                `approve-${rd.id}` ||
                                            actionLoading ===
                                                `reject-${rd.id}` ||
                                            actionLoading ===
                                                `close-${rd.id}`
                                        );

                                    return (
                                        <tr key={rd.id}>

                                            <td>
                                                <span className="admin-rd-id">
                                                    #{rd.id}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="admin-rd-customer">
                                                    <strong>
                                                        {rd.customerEmail}
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                <strong>
                                                    {formatCurrency(
                                                        rd.monthlyInstallment
                                                    )}
                                                </strong>
                                                <small>
                                                    / month
                                                </small>
                                            </td>

                                            <td>
                                                {rd.interestRate ?? "--"}%
                                            </td>

                                            <td>
                                                {rd.tenureMonths ?? "--"} months
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    rd.totalDeposited
                                                )}
                                            </td>

                                            <td>
                                                <strong className="admin-rd-maturity">
                                                    {formatCurrency(
                                                        rd.maturityAmount
                                                    )}
                                                </strong>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    rd.createdDate
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`admin-rd-status ${getStatusClass(
                                                        rd.status
                                                    )}`}
                                                >
                                                    {rd.status || "--"}
                                                </span>
                                            </td>

                                            <td>

                                                {isPending && (
                                                    <div className="admin-rd-actions">

                                                        <button
                                                            type="button"
                                                            className="admin-rd-action approve"
                                                            onClick={() =>
                                                                openActionModal(
                                                                    rd,
                                                                    "approve"
                                                                )
                                                            }
                                                            disabled={busy}
                                                        >
                                                            {actionLoading ===
                                                            `approve-${rd.id}`
                                                                ? "Approving..."
                                                                : "Approve"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="admin-rd-action reject"
                                                            onClick={() =>
                                                                openRejectModal(
                                                                    rd
                                                                )
                                                            }
                                                            disabled={busy}
                                                        >
                                                            Reject
                                                        </button>

                                                    </div>
                                                )}

                                                {isActive && (
                                                    <button
                                                        type="button"
                                                        className="admin-rd-action close"
                                                        onClick={() =>
                                                            openActionModal(
                                                                rd,
                                                                "close"
                                                            )
                                                        }
                                                        disabled={busy}
                                                    >
                                                        {actionLoading ===
                                                        `close-${rd.id}`
                                                            ? "Closing..."
                                                            : "Close"}
                                                    </button>
                                                )}

                                                {!isPending &&
                                                    !isActive && (
                                                        <span className="admin-rd-no-action">
                                                            No Action
                                                        </span>
                                                    )}

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>


            {/* ACTION CONFIRMATION MODAL */}
            {actionModal && (
                <div
                    className="admin-rd-modal-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !actionLoading
                        ) {
                            closeActionModal();
                        }
                    }}
                >
                    <div className="admin-rd-modal">

                        <div className="admin-rd-modal-header">
                            <div>
                                <span>
                                    {actionModal.action === "approve"
                                        ? "APPROVAL CONFIRMATION"
                                        : "CLOSURE CONFIRMATION"}
                                </span>

                                <h2>
                                    {actionModal.action === "approve"
                                        ? "Approve Recurring Deposit"
                                        : "Close Recurring Deposit"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeActionModal}
                                disabled={!!actionLoading}
                                className="admin-rd-modal-close"
                                aria-label="Close confirmation"
                            >
                                ×
                            </button>
                        </div>

                        <div className="admin-rd-modal-info">
                            <div>
                                <span>Request ID</span>
                                <strong>
                                    #{actionModal.deposit.id}
                                </strong>
                            </div>

                            <div>
                                <span>Customer</span>
                                <strong>
                                    {actionModal.deposit.customerEmail}
                                </strong>
                            </div>

                            <div>
                                <span>Monthly Installment</span>
                                <strong>
                                    {formatCurrency(
                                        actionModal.deposit.monthlyInstallment
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Tenure</span>
                                <strong>
                                    {actionModal.deposit.tenureMonths ?? "--"} months
                                </strong>
                            </div>

                            <div>
                                <span>Maturity Amount</span>
                                <strong className="admin-rd-maturity">
                                    {formatCurrency(
                                        actionModal.deposit.maturityAmount
                                    )}
                                </strong>
                            </div>
                        </div>

                        <div
                            style={{
                                marginTop: "20px",
                                padding: "14px 16px",
                                borderRadius: "12px",
                                background:
                                    actionModal.action === "approve"
                                        ? "#eff6ff"
                                        : "#fff7ed",
                                border:
                                    actionModal.action === "approve"
                                        ? "1px solid #bfdbfe"
                                        : "1px solid #fed7aa",
                                color:
                                    actionModal.action === "approve"
                                        ? "#1e40af"
                                        : "#9a3412",
                                lineHeight: 1.5,
                            }}
                        >
                            {actionModal.action === "approve" ? (
                                <>
                                    <strong>Confirm approval?</strong>
                                    <br />
                                    The RD will become <strong>ACTIVE</strong>,
                                    and the next installment schedule will
                                    begin after approval.
                                </>
                            ) : (
                                <>
                                    <strong>Confirm closure?</strong>
                                    <br />
                                    The maturity amount will be credited to
                                    the customer account and this RD will
                                    become <strong>CLOSED</strong>.
                                </>
                            )}
                        </div>

                        <div className="admin-rd-modal-actions">

                            <button
                                type="button"
                                className="admin-rd-modal-cancel"
                                onClick={closeActionModal}
                                disabled={!!actionLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-rd-modal-confirm"
                                onClick={
                                    actionModal.action === "approve"
                                        ? handleApprove
                                        : handleClose
                                }
                                disabled={!!actionLoading}
                            >
                                {actionModal.action === "approve"
                                    ? actionLoading ===
                                      `approve-${actionModal.deposit.id}`
                                        ? "Approving..."
                                        : "Approve RD"
                                    : actionLoading ===
                                      `close-${actionModal.deposit.id}`
                                        ? "Closing..."
                                        : "Close RD"}
                            </button>

                        </div>

                    </div>
                </div>
            )}


            {/* REJECTION MODAL */}
            {rejectModal && (

                <div
                    className="admin-rd-modal-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !actionLoading
                        ) {
                            closeRejectModal();
                        }
                    }}
                >

                    <div className="admin-rd-modal">

                        <div className="admin-rd-modal-header">

                            <div>
                                <span>REJECT REQUEST</span>
                                <h2>Reject Recurring Deposit</h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeRejectModal}
                                disabled={!!actionLoading}
                                className="admin-rd-modal-close"
                            >
                                ×
                            </button>

                        </div>

                        <div className="admin-rd-modal-info">

                            <div>
                                <span>Request ID</span>
                                <strong>
                                    #{rejectModal.id}
                                </strong>
                            </div>

                            <div>
                                <span>Customer</span>
                                <strong>
                                    {rejectModal.customerEmail}
                                </strong>
                            </div>

                            <div>
                                <span>Monthly Installment</span>
                                <strong>
                                    {formatCurrency(
                                        rejectModal.monthlyInstallment
                                    )}
                                </strong>
                            </div>

                        </div>

                        <div className="admin-rd-form-group">

                            <label htmlFor="rd-rejection-reason">
                                Rejection Reason
                            </label>

                            <textarea
                                id="rd-rejection-reason"
                                rows="5"
                                value={rejectReason}
                                onChange={(event) =>
                                    setRejectReason(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter the reason for rejecting this recurring deposit..."
                                maxLength={500}
                                autoFocus
                            />

                            <small>
                                {rejectReason.length}/500
                            </small>

                        </div>

                        <div className="admin-rd-modal-actions">

                            <button
                                type="button"
                                className="admin-rd-modal-cancel"
                                onClick={closeRejectModal}
                                disabled={!!actionLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-rd-modal-confirm"
                                onClick={handleReject}
                                disabled={
                                    !!actionLoading ||
                                    !rejectReason.trim()
                                }
                            >
                                {actionLoading ===
                                `reject-${rejectModal.id}`
                                    ? "Rejecting..."
                                    : "Reject RD"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminRecurringDeposits;
