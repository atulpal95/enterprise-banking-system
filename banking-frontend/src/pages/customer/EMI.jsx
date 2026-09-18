import React, { useEffect, useMemo, useState } from "react";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaWallet,
  FaExclamationTriangle,
} from "react-icons/fa";
import customerService from "../../services/customerService";
import "../../assets/styles/emi.css";

function EMI() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingLoanId, setPayingLoanId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  const loadLoans = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await customerService.getLoans();
      const data = Array.isArray(response.data) ? response.data : [];

      setLoans(data);
    } catch (err) {
      console.error("Failed to load loans:", err);
      setError(
        err.response?.data?.message || "Unable to load your loan information.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const activeLoans = useMemo(() => {
    return loans.filter((loan) =>
      ["DISBURSED", "ACTIVE"].includes(String(loan.status || "").toUpperCase()),
    );
  }, [loans]);

  const openPaymentConfirmation = (loan) => {
    setError("");
    setMessage("");
    setPaymentResult(null);
    setSelectedLoan(loan);
    setShowConfirm(true);
  };

  const closePaymentConfirmation = () => {
    if (!payingLoanId) {
      setShowConfirm(false);
      setSelectedLoan(null);
    }
  };

  const payEmi = async () => {
    if (!selectedLoan?.id) return;

    try {
      setPayingLoanId(selectedLoan.id);
      setError("");
      setMessage("");

      const response = await customerService.payEmi(selectedLoan.id);

      setPaymentResult(response.data);
      setMessage(
        response.data?.message || "EMI payment completed successfully.",
      );

      setShowConfirm(false);
      setSelectedLoan(null);

      await loadLoans();
    } catch (err) {
      console.error("EMI payment failed:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "EMI payment failed. Please try again.",
      );
    } finally {
      setPayingLoanId(null);
    }
  };

  const formatCurrency = (value) => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
      return "₹0.00";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getLoanLabel = (loanType) => {
    if (!loanType) return "Loan";

    return String(loanType)
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusClass = (status) => {
    const normalized = String(status || "").toUpperCase();

    if (normalized === "DISBURSED") return "emi-status disbursed";
    if (normalized === "ACTIVE") return "emi-status active";

    return "emi-status";
  };

  if (loading) {
    return (
      <div className="emi-page">
        <div className="emi-loading-card">
          <div className="emi-spinner" />
          <h3>Loading EMI details...</h3>
          <p>Please wait while we fetch your loan information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="emi-page">
      <div className="emi-page-header">
        <div>
          <span className="emi-eyebrow">LOAN SERVICES</span>
          <h1>EMI Payment</h1>
          <p>Manage your active loan EMIs and make your monthly payments.</p>
        </div>

        <div className="emi-header-icon">
          <FaMoneyBillWave />
        </div>
      </div>

      {error && (
        <div className="emi-alert error">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="emi-alert success">
          <FaCheckCircle />
          <span>{message}</span>
        </div>
      )}

      {paymentResult && (
        <div className="emi-payment-success">
          <div className="emi-success-icon">
            <FaCheckCircle />
          </div>

          <div className="emi-success-content">
            <h2>EMI Payment Successful</h2>
            <p>Your EMI payment has been processed successfully.</p>

            <div className="emi-success-grid">
              <div>
                <span>EMI Paid</span>
                <strong>{formatCurrency(paymentResult.emiPaid)}</strong>
              </div>

              <div>
                <span>Remaining Loan</span>
                <strong>{formatCurrency(paymentResult.remainingLoan)}</strong>
              </div>

              <div>
                <span>Remaining EMIs</span>
                <strong>{paymentResult.remainingInstallments ?? "—"}</strong>
              </div>

              <div>
                <span>Next EMI Date</span>
                <strong>{formatDate(paymentResult.nextEmiDate)}</strong>
              </div>

              <div>
                <span>Current Balance</span>
                <strong>{formatCurrency(paymentResult.currentBalance)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeLoans.length === 0 ? (
        <div className="emi-empty-card">
          <div className="emi-empty-icon">
            <FaMoneyBillWave />
          </div>

          <h2>No Active Loans</h2>

          <p>
            You do not currently have a disbursed or active loan eligible for
            EMI payment.
          </p>

          <button
            type="button"
            className="emi-secondary-button"
            onClick={loadLoans}
          >
            Refresh
          </button>
        </div>
      ) : (
        <>
          <div className="emi-summary-grid">
            <div className="emi-summary-card">
              <div className="emi-summary-icon blue">
                <FaMoneyBillWave />
              </div>
              <div>
                <span>Active Loans</span>
                <strong>{activeLoans.length}</strong>
              </div>
            </div>

            <div className="emi-summary-card">
              <div className="emi-summary-icon green">
                <FaCheckCircle />
              </div>
              <div>
                <span>Monthly EMI</span>
                <strong>
                  {formatCurrency(
                    activeLoans.reduce(
                      (total, loan) => total + Number(loan.emi || 0),
                      0,
                    ),
                  )}
                </strong>
              </div>
            </div>

            <div className="emi-summary-card">
              <div className="emi-summary-icon orange">
                <FaClock />
              </div>
              <div>
                <span>Remaining EMIs</span>
                <strong>
                  {activeLoans.reduce(
                    (total, loan) =>
                      total + Number(loan.remainingInstallments || 0),
                    0,
                  )}
                </strong>
              </div>
            </div>

            <div className="emi-summary-card">
              <div className="emi-summary-icon purple">
                <FaWallet />
              </div>
              <div>
                <span>Outstanding Amount</span>
                <strong>
                  {formatCurrency(
                    activeLoans.reduce(
                      (total, loan) =>
                        total + Number(loan.remainingAmount || 0),
                      0,
                    ),
                  )}
                </strong>
              </div>
            </div>
          </div>

          <section className="emi-section">
            <div className="emi-section-heading">
              <div>
                <h2>Active Loans</h2>
                <p>Select a loan below to make its EMI payment.</p>
              </div>
            </div>

            <div className="emi-loan-list">
              {activeLoans.map((loan) => (
                <div className="emi-loan-card" key={loan.id}>
                  <div className="emi-loan-top">
                    <div className="emi-loan-title">
                      <div className="emi-loan-icon">
                        <FaMoneyBillWave />
                      </div>

                      <div>
                        <h3>{getLoanLabel(loan.loanType)}</h3>
                        <span>Loan #{loan.id}</span>
                      </div>
                    </div>

                    <span className={getStatusClass(loan.status)}>
                      {loan.status || "ACTIVE"}
                    </span>
                  </div>

                  <div className="emi-details-grid">
                    <div className="emi-detail">
                      <span>Loan Amount</span>
                      <strong>{formatCurrency(loan.amount)}</strong>
                    </div>

                    <div className="emi-detail">
                      <span>Interest Rate</span>
                      <strong>{loan.interestRate ?? "—"}%</strong>
                    </div>

                    <div className="emi-detail">
                      <span>Tenure</span>
                      <strong>{loan.tenureMonths ?? "—"} Months</strong>
                    </div>

                    <div className="emi-detail highlight">
                      <span>Monthly EMI</span>
                      <strong>{formatCurrency(loan.emi)}</strong>
                    </div>

                    <div className="emi-detail">
                      <span>Paid Installments</span>
                      <strong>{loan.paidInstallments ?? 0}</strong>
                    </div>

                    <div className="emi-detail">
                      <span>Remaining Installments</span>
                      <strong>{loan.remainingInstallments ?? 0}</strong>
                    </div>

                    <div className="emi-detail">
                      <span>Outstanding Loan</span>
                      <strong>{formatCurrency(loan.remainingAmount)}</strong>
                    </div>

                    <div className="emi-detail">
                      <span>Next EMI Date</span>
                      <strong className="date-value">
                        <FaCalendarAlt />
                        {formatDate(loan.nextEmiDate)}
                      </strong>
                    </div>
                  </div>

                  <div className="emi-loan-footer">
                    <div>
                      <span>Disbursed</span>
                      <strong>{formatDate(loan.disbursedDate)}</strong>
                    </div>

                    <button
                      type="button"
                      className="emi-pay-button"
                      onClick={() => openPaymentConfirmation(loan)}
                      disabled={
                        payingLoanId === loan.id ||
                        Number(loan.remainingInstallments || 0) <= 0 ||
                        (loan.nextEmiDate &&
                          new Date() < new Date(loan.nextEmiDate))
                      }
                    >
                      <FaMoneyBillWave />
                      {Number(loan.remainingInstallments || 0) <= 0
                        ? "Loan Completed"
                        : loan.nextEmiDate &&
                            new Date() < new Date(loan.nextEmiDate)
                          ? "EMI Not Due"
                          : "Pay EMI"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {showConfirm && selectedLoan && (
        <div
          className="emi-modal-overlay"
          onMouseDown={closePaymentConfirmation}
        >
          <div
            className="emi-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="emi-modal-icon">
              <FaMoneyBillWave />
            </div>

            <h2>Confirm EMI Payment</h2>

            <p className="emi-modal-description">
              Please review the payment details before continuing.
            </p>

            <div className="emi-confirm-box">
              <div>
                <span>Loan</span>
                <strong>{getLoanLabel(selectedLoan.loanType)}</strong>
              </div>

              <div>
                <span>Loan ID</span>
                <strong>#{selectedLoan.id}</strong>
              </div>

              <div>
                <span>EMI Amount</span>
                <strong>{formatCurrency(selectedLoan.emi)}</strong>
              </div>
            </div>

            <div className="emi-modal-warning">
              <FaExclamationTriangle />
              <span>
                The EMI amount will be deducted from your account balance. Make
                sure you have sufficient funds before proceeding.
              </span>
            </div>

            <div className="emi-modal-actions">
              <button
                type="button"
                className="emi-cancel-button"
                onClick={closePaymentConfirmation}
                disabled={!!payingLoanId}
              >
                Cancel
              </button>

              <button
                type="button"
                className="emi-confirm-button"
                onClick={payEmi}
                disabled={!!payingLoanId}
              >
                {payingLoanId ? (
                  <>
                    <span className="emi-button-spinner" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaMoneyBillWave />
                    Pay {formatCurrency(selectedLoan.emi)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EMI;
