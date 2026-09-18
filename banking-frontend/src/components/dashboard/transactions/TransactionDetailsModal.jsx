import { useEffect } from "react";
import {
    FaArrowDown,
    FaArrowUp,
    FaExchangeAlt,
    FaCheckCircle,
    FaTimes,
    FaReceipt,
    FaWallet,
    FaCalendarAlt,
    FaHashtag,
    FaFileAlt,
} from "react-icons/fa";

import "./TransactionDetailsModal.css";

export default function TransactionDetailsModal({
    transaction,
    onClose,
}) {

    useEffect(() => {
        if (!transaction) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [transaction, onClose]);

    if (!transaction) return null;

    const formatAmount = (amount) =>
        Number(amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const creditTypes = [
        "DEPOSIT",
        "TRANSFER_IN",
        "LOAN_CREDIT",
        "RD_MATURITY",
        "FD_MATURITY",
        "FD_REFUND",
        "RD_REFUND",
    ];

    const isCredit = creditTypes.includes(
        transaction.type
    );

    const transactionTitles = {
        DEPOSIT: "Cash Deposit",
        TRANSFER_IN: "Transfer Received",
        WITHDRAW: "Withdrawal",
        TRANSFER_OUT: "Transfer Sent",
        LOAN_CREDIT: "Loan Credited",
        LOAN_EMI: "Loan EMI",
        FIXED_DEPOSIT: "Fixed Deposit",
        FD_OPEN: "Fixed Deposit Opened",
        FD_MATURITY: "FD Maturity",
        FD_REFUND: "FD Refund",
        RD_OPEN: "Recurring Deposit",
        RD_MATURITY: "RD Maturity",
        RD_REFUND: "RD Refund",
    };

    const title =
        transactionTitles[transaction.type] ||
        "Transaction";

    const getIcon = () => {
        if (isCredit) {
            return <FaArrowDown />;
        }

        if (
            transaction.type === "WITHDRAW" ||
            transaction.type === "TRANSFER_OUT" ||
            transaction.type === "LOAN_EMI"
        ) {
            return <FaArrowUp />;
        }

        return <FaExchangeAlt />;
    };

    return (
        <div
            className="transaction-modal-overlay"
            onClick={onClose}
        >

            <div
                className="transaction-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* =========================
                    HEADER
                ========================= */}

                <div className="transaction-modal-header">

                    <div className="modal-header-left">

                        <div
                            className={`modal-transaction-icon ${
                                isCredit
                                    ? "credit"
                                    : "debit"
                            }`}
                        >
                            {getIcon()}
                        </div>

                        <div>
                            <span className="modal-label">
                                TRANSACTION DETAILS
                            </span>

                            <h2>{title}</h2>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="close-btn"
                        aria-label="Close"
                    >
                        <FaTimes />
                    </button>

                </div>


                {/* =========================
                    AMOUNT HERO
                ========================= */}

                <div
                    className={`transaction-amount-box ${
                        isCredit
                            ? "credit"
                            : "debit"
                    }`}
                >

                    <span>
                        {isCredit
                            ? "Amount Received"
                            : "Amount Paid"}
                    </span>

                    <strong>
                        {isCredit ? "+" : "-"}₹
                        {formatAmount(
                            transaction.amount
                        )}
                    </strong>

                    <div className="transaction-status">
                        <FaCheckCircle />
                        Successful Transaction
                    </div>

                </div>


                {/* =========================
                    DETAILS
                ========================= */}

                <div className="transaction-modal-body">

                    <div className="detail-row">

                        <div className="detail-label">
                            <FaReceipt />
                            <span>Transaction Type</span>
                        </div>

                        <strong>
                            {transaction.type}
                        </strong>

                    </div>


                    <div className="detail-row">

                        <div className="detail-label">
                            <FaFileAlt />
                            <span>Description</span>
                        </div>

                        <strong className="detail-value">
                            {transaction.description ||
                                "No description available"}
                        </strong>

                    </div>


                    <div className="detail-row">

                        <div className="detail-label">
                            <FaHashtag />
                            <span>Reference</span>
                        </div>

                        <strong className="reference-value">
                            {transaction.reference ||
                                "N/A"}
                        </strong>

                    </div>


                    <div className="detail-row">

                        <div className="detail-label">
                            <FaWallet />
                            <span>Balance After Transaction</span>
                        </div>

                        <strong>
                            ₹
                            {formatAmount(
                                transaction.balanceAfterTransaction
                            )}
                        </strong>

                    </div>


                    <div className="detail-row">

                        <div className="detail-label">
                            <FaCalendarAlt />
                            <span>Date & Time</span>
                        </div>

                        <strong className="detail-value">
                            {formatDate(
                                transaction.transactionTime
                            )}
                        </strong>

                    </div>


                    <div className="detail-row status-row">

                        <div className="detail-label">
                            <FaCheckCircle />
                            <span>Status</span>
                        </div>

                        <span className="modal-success-badge">
                            <FaCheckCircle />
                            Success
                        </span>

                    </div>

                </div>


                {/* =========================
                    FOOTER
                ========================= */}

                <div className="transaction-modal-footer">

                    <span>
                        This transaction has been
                        successfully processed.
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Done
                    </button>

                </div>

            </div>

        </div>
    );
}