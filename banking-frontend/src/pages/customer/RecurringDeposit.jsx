import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import customerService from "../../services/customerService";
import "../../assets/styles/RecurringDeposit.css";


function RecurringDeposit() {
  const [monthlyInstallment, setMonthlyInstallment] = useState("");
  const [tenure, setTenure] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [payingId, setPayingId] = useState(null);
  const [actionModal, setActionModal] = useState(null);

  const interestRate = 7;

  const calculateMaturity = () => {
    if (!monthlyInstallment || !tenure) {
      return null;
    }

    const monthly = Number(monthlyInstallment);
    const months = Number(tenure);

    const total = monthly * months;

    const maturity = total + (total * interestRate * months) / (12 * 100);

    return {
      total,
      maturity: maturity.toFixed(2),
    };
  };

  const loadRecurringDeposits = async () => {
    try {
      const response = await customerService.getRecurringDeposits();

      setHistory(response.data);
    } catch (error) {
      console.error("Unable to load recurring deposits:", error);
    }
  };

  useEffect(() => {
    loadRecurringDeposits();
  }, []);

  const closeActionModal = () => {
    if (loading || payingId !== null) {
      return;
    }

    setActionModal(null);
  };

  const handleOpenRD = () => {
    if (!monthlyInstallment || !tenure) {
      toast.error("Please enter monthly installment and tenure.");
      return;
    }

    const monthly = Number(monthlyInstallment);
    const months = Number(tenure);

    if (monthly <= 0) {
      toast.error("Invalid monthly installment.");
      return;
    }

    if (months < 6) {
      toast.error("Minimum RD tenure is 6 months.");
      return;
    }

    setActionModal({
      type: "open",
      monthlyInstallment: monthly,
      tenureMonths: months,
    });
  };

  const confirmOpenRD = async () => {
    try {
      setLoading(true);

      await customerService.openRecurringDeposit({
        monthlyInstallment: Number(monthlyInstallment),
        tenureMonths: Number(tenure),
      });

      toast.success("Recurring Deposit opened successfully.");

      setMonthlyInstallment("");
      setTenure("");
      setActionModal(null);

      await loadRecurringDeposits();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to open Recurring Deposit."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayInstallment = (rd) => {
    if (!rd?.id) {
      return;
    }

    const paid = Number(rd.paidInstallments || 0);
    const total = Number(rd.tenureMonths || 0);

    if (paid >= total) {
      toast.info("All RD installments have already been paid.");
      return;
    }

    setActionModal({
      type: "pay",
      rd,
    });
  };

  const confirmPayInstallment = async () => {
    const rd = actionModal?.rd;

    if (!rd?.id) {
      return;
    }

    try {
      setPayingId(rd.id);

      await customerService.payRecurringDepositInstallment(rd.id);

      toast.success("RD installment paid successfully.");

      setActionModal(null);

      await loadRecurringDeposits();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to pay RD installment."
      );
    } finally {
      setPayingId(null);
    }
  };

  const handleActionConfirm = () => {
    if (actionModal?.type === "open") {
      confirmOpenRD();
      return;
    }

    if (actionModal?.type === "pay") {
      confirmPayInstallment();
    }
  };

  const summary = calculateMaturity();

  const interestEarned =
    summary && summary.total
      ? (Number(summary.maturity) - summary.total).toFixed(2)
      : null;

  const isInstallmentDue = (rd) => {
    if (!rd?.nextInstallmentDate) {
      return false;
    }

    return new Date(rd.nextInstallmentDate) <= new Date();
  };

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

  return (
    <div className="rd-page">
      {/* =========================================
                TOP SECTION
            ========================================= */}

      <div className="rd-top">
        {/* =====================================
                    LEFT — RD INFORMATION
                ===================================== */}

        <div className="rd-card">
          <div className="rd-illustration">
            <div className="rd-icon-wrapper">
              <span className="rd-icon">₹</span>
            </div>

            <span className="rd-label">PAL BANK</span>

            <h2>Recurring Deposit</h2>

            <p>Save Monthly • Earn More</p>

            <div className="rd-highlights">
              <div className="rd-highlight">
                <strong>7%</strong>

                <span>Interest Rate</span>
              </div>

              <div className="rd-highlight-divider" />

              <div className="rd-highlight">
                <strong>Monthly</strong>

                <span>Savings</span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
                    RIGHT — RD CALCULATOR
                ===================================== */}

        <div className="rd-calculator">
          <div className="rd-section-heading">
            <div>
              <span className="section-label">SAVE & GROW</span>

              <h2>Open Recurring Deposit</h2>

              <p>
                Invest a fixed amount every month and build your savings over
                time.
              </p>
            </div>
          </div>

          <div className="rd-form">
            {/* Monthly Installment */}

            <div className="form-group">
              <label htmlFor="rd-monthly">Monthly Installment</label>

              <div className="rd-input-wrapper">
                <span className="input-prefix">₹</span>

                <input
                  id="rd-monthly"
                  type="number"
                  min="100"
                  placeholder="Minimum ₹100"
                  value={monthlyInstallment}
                  onChange={(e) => setMonthlyInstallment(e.target.value)}
                />
              </div>
            </div>

            {/* Tenure */}

            <div className="form-group">
              <label htmlFor="rd-tenure">Tenure</label>

              <div className="rd-input-wrapper">
                <input
                  id="rd-tenure"
                  type="number"
                  min="1"
                  placeholder="Enter months"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                />

                <span className="input-suffix">Months</span>
              </div>
            </div>

            {/* Interest Rate */}

            <div className="form-group">
              <label htmlFor="rd-interest">Interest Rate</label>

              <div className="rd-input-wrapper">
                <input
                  id="rd-interest"
                  type="text"
                  value={`${interestRate}%`}
                  readOnly
                />

                <span className="rate-badge">FIXED</span>
              </div>
            </div>

            {/* Maturity Summary */}

            {summary && (
              <div className="rd-summary">
                <div className="rd-summary-header">
                  <div>
                    <span>ESTIMATED MATURITY</span>

                    <h3>
                      ₹ {Number(summary.maturity).toLocaleString("en-IN")}
                    </h3>
                  </div>

                  <div className="rd-summary-icon">₹</div>
                </div>

                <div className="rd-summary-details">
                  <div>
                    <span>Total Deposit</span>

                    <strong>₹ {summary.total.toLocaleString("en-IN")}</strong>
                  </div>

                  <div>
                    <span>Interest Earned</span>

                    <strong>
                      ₹ {Number(interestEarned).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Open RD */}

            <button
              type="button"
              className={`rd-btn ${loading ? "loading" : ""}`}
              onClick={handleOpenRD}
              disabled={loading || !monthlyInstallment || !tenure}
            >
              {loading ? (
                <>
                  <span className="rd-spinner" />
                  Opening...
                </>
              ) : (
                <>
                  Open Recurring Deposit
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
                RD HISTORY
            ========================================= */}

      <section className="rd-history">
        <div className="rd-history-heading">
          <div>
            <span className="section-label">YOUR INVESTMENTS</span>

            <h2>My Recurring Deposits</h2>
          </div>

          <span className="rd-count">
            {history.length} {history.length === 1 ? "Deposit" : "Deposits"}
          </span>
        </div>

        {history.length === 0 ? (
          <div className="rd-empty-card">
            <div className="rd-empty-icon">₹</div>

            <h3>No Recurring Deposits Found</h3>

            <p>
              Start your first monthly investment and build your savings step by
              step.
            </p>
          </div>
        ) : (
          <div className="rd-list">
            {history.map((rd) => (
              <div className="rd-item" key={rd.id}>
                <div className="rd-item-header">
                  <div>
                    <span className="rd-account-label">RECURRING DEPOSIT</span>

                    <h3>
                      ₹ {Number(rd.monthlyInstallment).toLocaleString("en-IN")}
                      <small>/ month</small>
                    </h3>
                  </div>

                  <span className={`rd-status ${rd.status?.toLowerCase()}`}>
                    {rd.status}
                  </span>
                </div>

                <div className="rd-details-grid">
                  <div className="rd-detail">
                    <span>Monthly Installment</span>

                    <strong>
                      ₹ {Number(rd.monthlyInstallment).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="rd-detail">
                    <span>Interest Rate</span>

                    <strong>{rd.interestRate ?? interestRate}%</strong>
                  </div>

                  <div className="rd-detail">
                    <span>Tenure</span>

                    <strong>{rd.tenureMonths} Months</strong>
                  </div>

                  <div className="rd-detail">
                    <span>Maturity Amount</span>

                    <strong className="rd-maturity-value">
                      ₹{" "}
                      {rd.maturityAmount
                        ? Number(rd.maturityAmount).toLocaleString("en-IN")
                        : "--"}
                    </strong>
                  </div>

                  <div className="rd-detail">
                    <span>Created</span>

                    <strong>
                      {rd.createdDate ? rd.createdDate.substring(0, 10) : "--"}
                    </strong>
                  </div>
                </div>
                {/* =========================================
    INSTALLMENT PROGRESS
========================================= */}

                {rd.status === "ACTIVE" && (
                  <div className="rd-installment-box">
                    <div className="rd-installment-header">
                      <div>
                        <span className="rd-installment-label">
                          INSTALLMENT PROGRESS
                        </span>

                        <h4>
                          {rd.paidInstallments ?? 0}
                          {" / "}
                          {rd.tenureMonths} Installments Paid
                        </h4>
                      </div>

                      <div className="rd-installment-amount">
                        ₹{" "}
                        {Number(rd.totalDeposited ?? 0).toLocaleString("en-IN")}
                      </div>
                    </div>

                    {/* Progress */}

                    <div className="rd-progress-track">
                      <div
                        className="rd-progress-fill"
                        style={{
                          width: `${Math.min(
                            100,
                            (Number(rd.paidInstallments ?? 0) /
                              Number(rd.tenureMonths || 1)) *
                              100,
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="rd-installment-stats">
                      <div>
                        <span>Paid</span>

                        <strong>{rd.paidInstallments ?? 0}</strong>
                      </div>

                      <div>
                        <span>Remaining</span>

                        <strong>
                          {Math.max(
                            0,
                            Number(rd.tenureMonths || 0) -
                              Number(rd.paidInstallments || 0),
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Next Due</span>

                        <strong>
                          {rd.nextInstallmentDate
                            ? formatDate(rd.nextInstallmentDate)
                            : "Completed"}
                        </strong>
                      </div>
                    </div>

                    {/* Payment */}

                    {Number(rd.paidInstallments || 0) <
                      Number(rd.tenureMonths || 0) && (
                      <div className="rd-payment-area">
                        {isInstallmentDue(rd) ? (
                          <button
                            type="button"
                            className="rd-pay-installment-btn"
                            onClick={() => handlePayInstallment(rd)}
                            disabled={payingId === rd.id}
                          >
                            {payingId === rd.id ? (
                              <>
                                <span className="rd-spinner" />
                                Processing...
                              </>
                            ) : (
                              <>
                                Pay Installment
                                <span>→</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="rd-next-due-message">
                            <span>Next installment due</span>

                            <strong>
                              {formatDate(rd.nextInstallmentDate)}
                            </strong>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {rd.status === "REJECTED" && rd.rejectionReason && (
                  <div className="rd-rejection-box">
                    <strong>Rejection Reason</strong>
                    <p>{rd.rejectionReason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      {/* =========================================================
          PROFESSIONAL ACTION CONFIRMATION MODAL
          Replaces browser alert/confirm dialogs.
      ========================================================= */}
      {actionModal && (
        <div
          className="rd-action-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !loading &&
              payingId === null
            ) {
              setActionModal(null);
            }
          }}
        >
          <div
            className="rd-action-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rd-action-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="rd-action-modal-header">
              <div>
                <span className="rd-action-modal-eyebrow">
                  ACTION CONFIRMATION
                </span>

                <h2 id="rd-action-modal-title">
                  {actionModal.type === "open"
                    ? "Open Recurring Deposit"
                    : "Pay RD Installment"}
                </h2>
              </div>

              <button
                type="button"
                className="rd-action-modal-close"
                onClick={closeActionModal}
                disabled={loading || payingId !== null}
                aria-label="Close"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="rd-action-modal-body">
              <div
                className={`rd-action-modal-icon ${
                  actionModal.type === "open" ? "open" : "pay"
                }`}
              >
                <i
                  className={
                    actionModal.type === "open"
                      ? "bi bi-bank"
                      : "bi bi-wallet2"
                  }
                />
              </div>

              {actionModal.type === "open" ? (
                <>
                  <h3>Confirm RD opening?</h3>

                  <p>
                    You are about to open a recurring deposit. The first
                    monthly installment will be deducted from your account
                    immediately.
                  </p>

                  <div className="rd-action-modal-info">
                    <div>
                      <span>Monthly Installment</span>
                      <strong>
                        ₹{" "}
                        {Number(
                          actionModal.monthlyInstallment
                        ).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div>
                      <span>Tenure</span>
                      <strong>
                        {actionModal.tenureMonths} Months
                      </strong>
                    </div>

                    <div>
                      <span>Interest Rate</span>
                      <strong>{interestRate}%</strong>
                    </div>

                    <div>
                      <span>First Payment</span>
                      <strong>₹{" "}
                        {Number(
                          actionModal.monthlyInstallment
                        ).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  <div className="rd-action-modal-warning">
                    <i className="bi bi-info-circle-fill" />
                    <span>
                      The first installment will be deducted when you
                      confirm this request. The RD will then remain
                      <strong> PENDING </strong>
                      until approved by the bank.
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <h3>Pay this RD installment?</h3>

                  <p>
                    Confirm the next monthly installment for your active
                    recurring deposit.
                  </p>

                  <div className="rd-action-modal-info">
                    <div>
                      <span>RD ID</span>
                      <strong>#{actionModal.rd.id}</strong>
                    </div>

                    <div>
                      <span>Installment</span>
                      <strong>
                        ₹{" "}
                        {Number(
                          actionModal.rd.monthlyInstallment
                        ).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div>
                      <span>Progress</span>
                      <strong>
                        {Number(actionModal.rd.paidInstallments || 0) + 1}
                        {" / "}
                        {actionModal.rd.tenureMonths}
                      </strong>
                    </div>

                    <div>
                      <span>Total After Payment</span>
                      <strong>
                        ₹{" "}
                        {(
                          Number(actionModal.rd.totalDeposited || 0) +
                          Number(actionModal.rd.monthlyInstallment || 0)
                        ).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  <div className="rd-action-modal-warning">
                    <i className="bi bi-shield-check" />
                    <span>
                      Your account balance will be debited by the
                      installment amount and a transaction record will be
                      created.
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="rd-action-modal-footer">
              <button
                type="button"
                className="rd-action-modal-secondary"
                onClick={closeActionModal}
                disabled={loading || payingId !== null}
              >
                Cancel
              </button>

              <button
                type="button"
                className={`rd-action-modal-primary ${
                  actionModal.type === "pay" ? "pay" : ""
                }`}
                onClick={handleActionConfirm}
                disabled={loading || payingId !== null}
              >
                {loading || payingId !== null ? (
                  <>
                    <span className="rd-modal-spinner" />
                    {actionModal.type === "open"
                      ? "Opening..."
                      : "Processing..."}
                  </>
                ) : (
                  <>
                    <i
                      className={
                        actionModal.type === "open"
                          ? "bi bi-check-lg"
                          : "bi bi-credit-card"
                      }
                    />
                    {actionModal.type === "open"
                      ? "Confirm Opening"
                      : "Pay Installment"}
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

export default RecurringDeposit;