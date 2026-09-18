import React, { useEffect, useMemo, useState } from "react";
import {
    getAllLoans,
    approveLoan,
    rejectLoan,
    disburseLoan,
    closeLoan,
} from "../../api/adminApi";
import "../../assets/styles/admin-loans.css";

const AdminLoans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [selectedLoan, setSelectedLoan] = useState(null);
    const [modal, setModal] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [notification, setNotification] = useState(null);

    const loadLoans = async () => {
        try {
            setLoading(true);

            const response = await getAllLoans();

            setLoans(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Unable to load loans:", error);

            showNotification(
                "error",
                "Unable to Load Loans",
                error.response?.data?.message ||
                    "Unable to load loan applications."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLoans();
    }, []);

    const closeModal = () => {
        if (actionLoading) return;

        setModal(null);
        setSelectedLoan(null);
        setRejectionReason("");
    };

    const showNotification = (type, title, message) => {
        setNotification({ type, title, message });
    };

    const closeNotification = () => {
        setNotification(null);
    };

    const handleApprove = async () => {
        if (!selectedLoan) return;

        try {
            setActionLoading(true);

            await approveLoan(selectedLoan.id);

            showNotification("success", "Loan Approved", "Loan approved successfully.");

            closeModal();
            await loadLoans();
        } catch (error) {
            console.error("Approve loan error:", error);

            showNotification(
                "error",
                "Approval Failed",
                error.response?.data?.message ||
                    "Unable to approve loan."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedLoan) return;

        const reason = rejectionReason.trim();

        if (!reason) {
            showNotification("warning", "Reason Required", "Please enter a rejection reason.");
            return;
        }

        try {
            setActionLoading(true);

            await rejectLoan(selectedLoan.id, {
                reason,
            });

            showNotification("success", "Loan Rejected", "Loan rejected successfully.");

            closeModal();
            await loadLoans();
        } catch (error) {
            console.error("Reject loan error:", error);

            showNotification(
                "error",
                "Rejection Failed",
                error.response?.data?.message ||
                    "Unable to reject loan."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleDisburse = async () => {
        if (!selectedLoan) return;

        try {
            setActionLoading(true);

            await disburseLoan(selectedLoan.id);

            showNotification("success", "Loan Disbursed", "Loan disbursed successfully.");

            closeModal();
            await loadLoans();
        } catch (error) {
            console.error("Disburse loan error:", error);

            showNotification(
                "error",
                "Disbursement Failed",
                error.response?.data?.message ||
                    "Unable to disburse loan."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleCloseLoan = async () => {
        if (!selectedLoan) return;

        try {
            setActionLoading(true);

            await closeLoan(selectedLoan.id);

            showNotification("success", "Loan Closed", "Loan closed successfully.");

            closeModal();
            await loadLoans();
        } catch (error) {
            console.error("Close loan error:", error);

            showNotification(
                "error",
                "Closure Failed",
                error.response?.data?.message ||
                    "Unable to close loan."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const filteredLoans = useMemo(() => {
        const query = search.trim().toLowerCase();

        return loans.filter((loan) => {
            const matchesStatus =
                statusFilter === "ALL" ||
                loan.status === statusFilter;

            if (!matchesStatus) return false;

            if (!query) return true;

            return (
                String(loan.id ?? "")
                    .toLowerCase()
                    .includes(query) ||
                String(loan.customerEmail ?? "")
                    .toLowerCase()
                    .includes(query) ||
                String(loan.loanType ?? "")
                    .toLowerCase()
                    .includes(query)
            );
        });
    }, [loans, search, statusFilter]);

    const summary = useMemo(() => {
        return {
            total: loans.length,
            applied: loans.filter(
                (loan) => loan.status === "APPLIED"
            ).length,
            approved: loans.filter(
                (loan) => loan.status === "APPROVED"
            ).length,
            rejected: loans.filter(
                (loan) => loan.status === "REJECTED"
            ).length,
            disbursed: loans.filter(
                (loan) => loan.status === "DISBURSED"
            ).length,
            closed: loans.filter(
                (loan) => loan.status === "CLOSED"
            ).length,
        };
    }, [loans]);

    const formatCurrency = (value) => {
        const amount = Number(value);

        if (!Number.isFinite(amount)) return "₹ 0.00";

        return `₹ ${amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const formatDate = (value) => {
        if (!value) return "--";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return "--";

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatLoanType = (type) => {
        if (!type) return "--";

        return String(type)
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    const getStatusClass = (status) => {
        return String(status || "UNKNOWN")
            .toLowerCase()
            .replace(/\s+/g, "-");
    };

    const openModal = (type, loan) => {
        setSelectedLoan(loan);
        setModal(type);
        setRejectionReason("");
    };

    return (
        <div className="admin-loans-page">
            {/* =========================
                BLUE HERO HEADER
            ========================== */}
            <div className="loan-hero">
                <div className="loan-hero-content">
                    <div className="loan-hero-eyebrow">
                        <span className="loan-hero-dot"></span>
                        LOAN MANAGEMENT
                    </div>

                    <h1>Loan Management</h1>

                    <p>
                        Review, approve, reject and manage customer loan applications.
                    </p>
                </div>

                <button
                    type="button"
                    className="loan-hero-refresh"
                    onClick={loadLoans}
                    disabled={loading || actionLoading}
                >
                    <i className="bi bi-arrow-clockwise"></i>
                    Refresh
                </button>
            </div>

            {/* =========================
                SUMMARY
            ========================== */}
            <div className="loan-summary-grid">
                <div className="loan-summary-card total">
                    <div className="loan-summary-icon">
                        <i className="bi bi-files"></i>
                    </div>
                    <div>
                        <span>Total Loans</span>
                        <strong>{summary.total}</strong>
                    </div>
                </div>

                <div className="loan-summary-card applied">
                    <div className="loan-summary-icon">
                        <i className="bi bi-hourglass-split"></i>
                    </div>
                    <div>
                        <span>Applied</span>
                        <strong>{summary.applied}</strong>
                    </div>
                </div>

                <div className="loan-summary-card approved">
                    <div className="loan-summary-icon">
                        <i className="bi bi-check-circle"></i>
                    </div>
                    <div>
                        <span>Approved</span>
                        <strong>{summary.approved}</strong>
                    </div>
                </div>

                <div className="loan-summary-card rejected">
                    <div className="loan-summary-icon">
                        <i className="bi bi-x-circle"></i>
                    </div>
                    <div>
                        <span>Rejected</span>
                        <strong>{summary.rejected}</strong>
                    </div>
                </div>

                <div className="loan-summary-card disbursed">
                    <div className="loan-summary-icon">
                        <i className="bi bi-cash-stack"></i>
                    </div>
                    <div>
                        <span>Disbursed</span>
                        <strong>{summary.disbursed}</strong>
                    </div>
                </div>

                <div className="loan-summary-card closed">
                    <div className="loan-summary-icon">
                        <i className="bi bi-lock"></i>
                    </div>
                    <div>
                        <span>Closed</span>
                        <strong>{summary.closed}</strong>
                    </div>
                </div>
            </div>

            {/* =========================
                FILTERS
            ========================== */}
            <div className="loan-filter-card">
                <div className="loan-search-box">
                    <i className="bi bi-search"></i>

                    <input
                        type="text"
                        placeholder="Search by loan ID, customer email or loan type..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                    {search && (
                        <button
                            type="button"
                            className="loan-clear-search"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                        >
                            <i className="bi bi-x"></i>
                        </button>
                    )}
                </div>

                <div className="loan-status-filter">
                    <label htmlFor="loan-status-filter">
                        Status
                    </label>

                    <select
                        id="loan-status-filter"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                    >
                        <option value="ALL">All Status</option>
                        <option value="APPLIED">Applied</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="DISBURSED">Disbursed</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
            </div>

            {/* =========================
                TABLE
            ========================== */}
            <div className="loan-table-card">
                <div className="loan-table-header">
                    <div>
                        <h2>Loan Applications</h2>
                        <p>
                            Showing {filteredLoans.length} of{" "}
                            {loans.length} loans
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="loan-loading">
                        <div className="loan-spinner"></div>
                        <p>Loading loan applications...</p>
                    </div>
                ) : filteredLoans.length === 0 ? (
                    <div className="loan-empty-state">
                        <div className="loan-empty-icon">
                            <i className="bi bi-bank"></i>
                        </div>

                        <h3>No Loans Found</h3>

                        <p>
                            {search || statusFilter !== "ALL"
                                ? "No loan applications match your current filters."
                                : "There are no loan applications yet."}
                        </p>
                    </div>
                ) : (
                    <div className="loan-table-wrapper">
                        <table className="loan-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Loan Type</th>
                                    <th>Amount</th>
                                    <th>Interest</th>
                                    <th>Tenure</th>
                                    <th>EMI</th>
                                    <th>Status</th>
                                    <th>Applied On</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredLoans.map((loan) => (
                                    <tr key={loan.id}>
                                        <td>
                                            <span className="loan-id">
                                                #{loan.id}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="loan-customer-cell">
                                                <div className="loan-customer-avatar">
                                                    <i className="bi bi-person"></i>
                                                </div>

                                                <div>
                                                    <strong>
                                                        {loan.customerEmail ||
                                                            "--"}
                                                    </strong>
                                                    <small>
                                                        Loan #{loan.id}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="loan-type-badge">
                                                {formatLoanType(
                                                    loan.loanType
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            <strong>
                                                {formatCurrency(
                                                    loan.amount
                                                )}
                                            </strong>
                                        </td>

                                        <td>
                                            {loan.interestRate != null
                                                ? `${loan.interestRate}%`
                                                : "--"}
                                        </td>

                                        <td>
                                            {loan.tenureMonths != null
                                                ? `${loan.tenureMonths} mo`
                                                : "--"}
                                        </td>

                                        <td>
                                            <strong>
                                                {formatCurrency(
                                                    loan.emi
                                                )}
                                            </strong>
                                        </td>

                                        <td>
                                            <span
                                                className={`loan-status-badge ${getStatusClass(
                                                    loan.status
                                                )}`}
                                            >
                                                {loan.status || "UNKNOWN"}
                                            </span>
                                        </td>

                                        <td>
                                            {formatDate(
                                                loan.appliedDate
                                            )}
                                        </td>

                                        <td>
                                            <div className="loan-actions">
                                                <button
                                                    type="button"
                                                    className="loan-action-btn view"
                                                    title="View loan"
                                                    onClick={() =>
                                                        openModal(
                                                            "view",
                                                            loan
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </button>

                                                {loan.status ===
                                                    "APPLIED" && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="loan-action-btn approve"
                                                            title="Approve loan"
                                                            onClick={() =>
                                                                openModal(
                                                                    "approve",
                                                                    loan
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-check-lg"></i>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="loan-action-btn reject"
                                                            title="Reject loan"
                                                            onClick={() =>
                                                                openModal(
                                                                    "reject",
                                                                    loan
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-x-lg"></i>
                                                        </button>
                                                    </>
                                                )}

                                                {loan.status ===
                                                    "APPROVED" && (
                                                    <button
                                                        type="button"
                                                        className="loan-action-btn disburse"
                                                        title="Disburse loan"
                                                        onClick={() =>
                                                            openModal(
                                                                "disburse",
                                                                loan
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-cash-stack"></i>
                                                    </button>
                                                )}

                                                {loan.status ===
                                                    "DISBURSED" && (
                                                    <button
                                                        type="button"
                                                        className="loan-action-btn close"
                                                        title="Close loan"
                                                        onClick={() =>
                                                            openModal(
                                                                "close",
                                                                loan
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-lock"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* =========================
                VIEW MODAL
            ========================== */}
            {modal === "view" && selectedLoan && (
                <div
                    className="loan-modal-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget
                        ) {
                            closeModal();
                        }
                    }}
                >
                    <div className="loan-modal view-modal">
                        <div className="loan-modal-header">
                            <div>
                                <span>LOAN DETAILS</span>
                                <h2>
                                    Loan #{selectedLoan.id}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="loan-modal-close"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="loan-modal-body">
                            <div className="loan-detail-status">
                                <span>Status</span>
                                <strong
                                    className={`loan-status-badge ${getStatusClass(
                                        selectedLoan.status
                                    )}`}
                                >
                                    {selectedLoan.status}
                                </strong>
                            </div>

                            <div className="loan-detail-grid">
                                <div>
                                    <span>Customer Email</span>
                                    <strong>
                                        {selectedLoan.customerEmail ||
                                            "--"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Loan Type</span>
                                    <strong>
                                        {formatLoanType(
                                            selectedLoan.loanType
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Loan Amount</span>
                                    <strong>
                                        {formatCurrency(
                                            selectedLoan.amount
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Interest Rate</span>
                                    <strong>
                                        {selectedLoan.interestRate !=
                                        null
                                            ? `${selectedLoan.interestRate}% p.a.`
                                            : "--"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Tenure</span>
                                    <strong>
                                        {selectedLoan.tenureMonths !=
                                        null
                                            ? `${selectedLoan.tenureMonths} Months`
                                            : "--"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Monthly EMI</span>
                                    <strong>
                                        {formatCurrency(
                                            selectedLoan.emi
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Remaining Amount</span>
                                    <strong>
                                        {formatCurrency(
                                            selectedLoan.remainingAmount
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Paid Installments</span>
                                    <strong>
                                        {selectedLoan.paidInstallments ??
                                            0}
                                    </strong>
                                </div>

                                <div>
                                    <span>Remaining Installments</span>
                                    <strong>
                                        {selectedLoan.remainingInstallments ??
                                            0}
                                    </strong>
                                </div>

                                <div>
                                    <span>Next EMI Date</span>
                                    <strong>
                                        {formatDate(
                                            selectedLoan.nextEmiDate
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Applied Date</span>
                                    <strong>
                                        {formatDate(
                                            selectedLoan.appliedDate
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Approved Date</span>
                                    <strong>
                                        {formatDate(
                                            selectedLoan.approvedDate
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Disbursed Date</span>
                                    <strong>
                                        {formatDate(
                                            selectedLoan.disbursedDate
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Closed Date</span>
                                    <strong>
                                        {formatDate(
                                            selectedLoan.closedDate
                                        )}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="loan-modal-footer">
                            <button
                                type="button"
                                className="loan-modal-secondary"
                                onClick={closeModal}
                            >
                                Close
                            </button>

                            {selectedLoan.status ===
                                "APPLIED" && (
                                <>
                                    <button
                                        type="button"
                                        className="loan-modal-danger"
                                        onClick={() =>
                                            openModal(
                                                "reject",
                                                selectedLoan
                                            )
                                        }
                                    >
                                        Reject
                                    </button>

                                    <button
                                        type="button"
                                        className="loan-modal-primary"
                                        onClick={() =>
                                            openModal(
                                                "approve",
                                                selectedLoan
                                            )
                                        }
                                    >
                                        Approve
                                    </button>
                                </>
                            )}

                            {selectedLoan.status ===
                                "APPROVED" && (
                                <button
                                    type="button"
                                    className="loan-modal-primary"
                                    onClick={() =>
                                        openModal(
                                            "disburse",
                                            selectedLoan
                                        )
                                    }
                                >
                                    Disburse Loan
                                </button>
                            )}

                            {selectedLoan.status ===
                                "DISBURSED" && (
                                <button
                                    type="button"
                                    className="loan-modal-primary"
                                    onClick={() =>
                                        openModal(
                                            "close",
                                            selectedLoan
                                        )
                                    }
                                >
                                    Close Loan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* =========================
                APPROVE MODAL
            ========================== */}
            {modal === "approve" && selectedLoan && (
                <div className="loan-modal-overlay">
                    <div className="loan-modal action-modal">
                        <div className="loan-modal-header">
                            <div>
                                <span>LOAN APPROVAL</span>
                                <h2>Approve Application</h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="loan-modal-close"
                                disabled={actionLoading}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="loan-modal-body">
                            <div className="loan-confirm-icon approve-icon">
                                <i className="bi bi-check-circle-fill"></i>
                            </div>

                            <h3>
                                Approve Loan #{selectedLoan.id}?
                            </h3>

                            <p>
                                You are about to approve this{" "}
                                {formatLoanType(
                                    selectedLoan.loanType
                                )}{" "}
                                loan application.
                            </p>

                            <div className="loan-confirm-info">
                                <div>
                                    <span>Customer</span>
                                    <strong>
                                        {selectedLoan.customerEmail}
                                    </strong>
                                </div>

                                <div>
                                    <span>Amount</span>
                                    <strong>
                                        {formatCurrency(
                                            selectedLoan.amount
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>EMI</span>
                                    <strong>
                                        {formatCurrency(
                                            selectedLoan.emi
                                        )}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="loan-modal-footer">
                            <button
                                type="button"
                                className="loan-modal-secondary"
                                onClick={closeModal}
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="loan-modal-primary"
                                onClick={handleApprove}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <>
                                        <span className="button-spinner"></span>
                                        Approving...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg"></i>
                                        Confirm Approval
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================
                REJECT MODAL
            ========================== */}
            {modal === "reject" && selectedLoan && (
                <div className="loan-modal-overlay">
                    <div className="loan-modal action-modal">
                        <div className="loan-modal-header">
                            <div>
                                <span>LOAN REJECTION</span>
                                <h2>Reject Application</h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="loan-modal-close"
                                disabled={actionLoading}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="loan-modal-body">
                            <div className="loan-confirm-icon reject-icon">
                                <i className="bi bi-x-circle-fill"></i>
                            </div>

                            <h3>
                                Reject Loan #{selectedLoan.id}?
                            </h3>

                            <p>
                                Please provide a reason for rejecting
                                this loan application.
                            </p>

                            <div className="loan-reject-field">
                                <label htmlFor="loan-rejection-reason">
                                    Rejection Reason{" "}
                                    <span>*</span>
                                </label>

                                <textarea
                                    id="loan-rejection-reason"
                                    rows="4"
                                    placeholder="Enter the reason for rejecting this loan..."
                                    value={rejectionReason}
                                    onChange={(event) =>
                                        setRejectionReason(
                                            event.target.value
                                        )
                                    }
                                    disabled={actionLoading}
                                />
                            </div>
                        </div>

                        <div className="loan-modal-footer">
                            <button
                                type="button"
                                className="loan-modal-secondary"
                                onClick={closeModal}
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="loan-modal-danger"
                                onClick={handleReject}
                                disabled={
                                    actionLoading ||
                                    !rejectionReason.trim()
                                }
                            >
                                {actionLoading ? (
                                    <>
                                        <span className="button-spinner"></span>
                                        Rejecting...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-x-lg"></i>
                                        Reject Loan
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================
                DISBURSE MODAL
            ========================== */}
            {modal === "disburse" && selectedLoan && (
                <div className="loan-modal-overlay">
                    <div className="loan-modal action-modal">
                        <div className="loan-modal-header">
                            <div>
                                <span>LOAN DISBURSEMENT</span>
                                <h2>Disburse Loan</h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="loan-modal-close"
                                disabled={actionLoading}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="loan-modal-body">
                            <div className="loan-confirm-icon disburse-icon">
                                <i className="bi bi-cash-stack"></i>
                            </div>

                            <h3>
                                Disburse Loan #{selectedLoan.id}?
                            </h3>

                            <p>
                                The approved loan amount will be
                                credited to the customer's account and
                                the EMI schedule will be activated.
                            </p>

                            <div className="loan-confirm-info">
                                <div>
                                    <span>Customer</span>
                                    <strong>
                                        {selectedLoan.customerEmail}
                                    </strong>
                                </div>

                                <div>
                                    <span>Loan Amount</span>
                                    <strong>
                                        {formatCurrency(
                                            selectedLoan.amount
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Monthly EMI</span>
                                    <strong>
                                        {formatCurrency(
                                            selectedLoan.emi
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Tenure</span>
                                    <strong>
                                        {
                                            selectedLoan.tenureMonths
                                        }{" "}
                                        Months
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="loan-modal-footer">
                            <button
                                type="button"
                                className="loan-modal-secondary"
                                onClick={closeModal}
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="loan-modal-primary"
                                onClick={handleDisburse}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <>
                                        <span className="button-spinner"></span>
                                        Disbursing...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-cash-stack"></i>
                                        Confirm Disbursement
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================
                CLOSE MODAL
            ========================== */}
            {modal === "close" && selectedLoan && (
                <div className="loan-modal-overlay">
                    <div className="loan-modal action-modal">
                        <div className="loan-modal-header">
                            <div>
                                <span>LOAN CLOSURE</span>
                                <h2>Close Loan</h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="loan-modal-close"
                                disabled={actionLoading}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="loan-modal-body">
                            <div className="loan-confirm-icon close-icon">
                                <i className="bi bi-lock-fill"></i>
                            </div>

                            <h3>
                                Close Loan #{selectedLoan.id}?
                            </h3>

                            <p>
                                This will mark the disbursed loan as
                                closed. Continue only if the loan
                                should be closed.
                            </p>

                            <div className="loan-confirm-info">
                                <div>
                                    <span>Customer</span>
                                    <strong>
                                        {selectedLoan.customerEmail}
                                    </strong>
                                </div>

                                <div>
                                    <span>Loan Amount</span>
                                    <strong>
                                        {formatCurrency(
                                            selectedLoan.amount
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Remaining Amount</span>
                                    <strong>
                                        {formatCurrency(
                                            selectedLoan.remainingAmount
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Remaining EMI</span>
                                    <strong>
                                        {
                                            selectedLoan.remainingInstallments
                                        }
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="loan-modal-footer">
                            <button
                                type="button"
                                className="loan-modal-secondary"
                                onClick={closeModal}
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="loan-modal-primary"
                                onClick={handleCloseLoan}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <>
                                        <span className="button-spinner"></span>
                                        Closing...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-lock-fill"></i>
                                        Confirm Closure
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================
                NOTIFICATION MODAL
            ========================== */}
            {notification && (
                <div
                    className="loan-modal-overlay notification-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeNotification();
                    }}
                >
                    <div className={`loan-modal action-modal notification-modal ${notification.type}`}>
                        <div className="loan-modal-body">
                            <div className={`loan-confirm-icon notification-icon ${notification.type}-icon`}>
                                <i
                                    className={
                                        notification.type === "success"
                                            ? "bi bi-check-circle-fill"
                                            : notification.type === "warning"
                                            ? "bi bi-exclamation-circle-fill"
                                            : "bi bi-x-circle-fill"
                                    }
                                ></i>
                            </div>
                            <h3>{notification.title}</h3>
                            <p>{notification.message}</p>
                        </div>
                        <div className="loan-modal-footer notification-footer">
                            <button
                                type="button"
                                className={notification.type === "error" ? "loan-modal-danger" : "loan-modal-primary"}
                                onClick={closeNotification}
                            >
                                <i className="bi bi-check-lg"></i>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLoans;