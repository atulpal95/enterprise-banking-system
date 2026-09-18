import "../../assets/styles/FixedDeposit.css";
import { useEffect, useState } from "react";
import customerService from "../../services/customerService";

function FixedDeposit() {
    const [amount, setAmount] = useState("");
    const [tenure, setTenure] = useState("");
    const [fdHistory, setFdHistory] = useState([]);
    const [opening, setOpening] = useState(false);
    const [modal, setModal] = useState({
        open: false,
        type: "confirm",
        title: "",
        message: "",
    });

    const interestRate = 7.5;

    const calculateMaturity = () => {
        if (!amount || !tenure) {
            return null;
        }

        const principal = Number(amount);
        const months = Number(tenure);

        const maturity =
            principal +
            (principal * interestRate * months) / (12 * 100);

        return maturity.toFixed(2);
    };

    const loadFDs = async () => {
        try {
            const response = await customerService.getFixedDeposits();
            setFdHistory(response.data);
        } catch (error) {
            console.error("Unable to load fixed deposits:", error);
        }
    };

    useEffect(() => {
        loadFDs();
    }, []);

    const handleOpenFD = () => {
        if (!amount || !tenure) {
            return;
        }

        setModal({
            open: true,
            type: "confirm",
            title: "Open Fixed Deposit?",
            message: "Please review your Fixed Deposit details before confirming.",
        });
    };

    const closeModal = () => {
        if (opening) {
            return;
        }

        setModal((current) => ({
            ...current,
            open: false,
        }));
    };

    const confirmOpenFD = async () => {
        try {
            setOpening(true);

            await customerService.openFixedDeposit({
                amount: Number(amount),
                tenureMonths: Number(tenure),
            });

            setAmount("");
            setTenure("");

            await loadFDs();

            setModal({
                open: true,
                type: "success",
                title: "Fixed Deposit Opened",
                message: "Your Fixed Deposit has been opened successfully.",
            });
        } catch (error) {
            setModal({
                open: true,
                type: "error",
                title: "Unable to Open Fixed Deposit",
                message:
                    error.response?.data?.message ||
                    "Unable to open Fixed Deposit. Please try again.",
            });
        } finally {
            setOpening(false);
        }
    };

    const maturityAmount = calculateMaturity();

    const principalAmount = amount ? Number(amount) : 0;

    const interestEarned =
        maturityAmount && principalAmount
            ? (Number(maturityAmount) - principalAmount).toFixed(2)
            : null;

    return (
        <div className="fd-page">

            {/* =========================================
                TOP SECTION
            ========================================= */}

            <div className="fd-top">

                {/* =====================================
                    LEFT — FD INFORMATION CARD
                ===================================== */}

                <div className="fd-card">

                    <div className="fd-illustration">

                        <div className="fd-icon-wrapper">
                            <span className="fd-icon">₹</span>
                        </div>

                        <span className="fd-label">
                            PAL BANK
                        </span>

                        <h2>
                            Fixed Deposit
                        </h2>

                        <p>
                            Safe • Secure • Guaranteed Returns
                        </p>

                        <div className="fd-highlights">

                            <div className="fd-highlight">
                                <strong>7.5%</strong>
                                <span>Interest Rate</span>
                            </div>

                            <div className="fd-highlight-divider" />

                            <div className="fd-highlight">
                                <strong>Secure</strong>
                                <span>Investment</span>
                            </div>

                        </div>

                    </div>

                </div>

                {/* =====================================
                    RIGHT — FD CALCULATOR
                ===================================== */}

                <div className="fd-calculator">

                    <div className="fd-section-heading">

                        <div>
                            <span className="section-label">
                                INVEST & GROW
                            </span>

                            <h2>
                                Open Fixed Deposit
                            </h2>

                            <p>
                                Choose your amount and tenure to estimate
                                your maturity value.
                            </p>
                        </div>

                    </div>

                    <div className="fd-form">

                        {/* Deposit Amount */}

                        <div className="form-group">

                            <label htmlFor="fd-amount">
                                Deposit Amount
                            </label>

                            <div className="input-wrapper">

                                <span className="input-prefix">
                                    ₹
                                </span>

                                <input
                                    id="fd-amount"
                                    type="number"
                                    min="1000"
                                    placeholder="Minimum ₹1,000"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                        {/* Tenure */}

                        <div className="form-group">

                            <label htmlFor="fd-tenure">
                                Tenure
                            </label>

                            <div className="input-wrapper">

                                <input
                                    id="fd-tenure"
                                    type="number"
                                    min="1"
                                    placeholder="Enter months"
                                    value={tenure}
                                    onChange={(e) =>
                                        setTenure(e.target.value)
                                    }
                                />

                                <span className="input-suffix">
                                    Months
                                </span>

                            </div>

                        </div>

                        {/* Interest Rate */}

                        <div className="form-group">

                            <label htmlFor="fd-interest">
                                Interest Rate
                            </label>

                            <div className="input-wrapper">

                                <input
                                    id="fd-interest"
                                    type="text"
                                    value={`${interestRate}%`}
                                    readOnly
                                />

                                <span className="rate-badge">
                                    FIXED
                                </span>

                            </div>

                        </div>

                        {/* Maturity Preview */}

                        {maturityAmount && (
                            <div className="maturity-card">

                                <div className="maturity-header">

                                    <div>
                                        <span>
                                            ESTIMATED MATURITY
                                        </span>

                                        <h3>
                                            ₹ {maturityAmount}
                                        </h3>
                                    </div>

                                    <div className="maturity-icon">
                                        ₹
                                    </div>

                                </div>

                                <div className="maturity-details">

                                    <div>
                                        <span>
                                            Principal
                                        </span>

                                        <strong>
                                            ₹ {principalAmount.toLocaleString("en-IN")}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Interest Earned
                                        </span>

                                        <strong>
                                            ₹ {Number(interestEarned).toLocaleString("en-IN")}
                                        </strong>
                                    </div>

                                </div>

                            </div>
                        )}

                        {/* Open FD Button */}

                        <button
                            type="button"
                            className={`fd-btn ${
                                opening ? "loading" : ""
                            }`}
                            onClick={handleOpenFD}
                            disabled={
                                opening ||
                                !amount ||
                                !tenure
                            }
                        >

                            {opening ? (
                                <>
                                    <span className="fd-spinner" />
                                    Opening...
                                </>
                            ) : (
                                <>
                                    Open Fixed Deposit
                                    <span className="btn-arrow">
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </div>

                </div>

            </div>

            {/* =========================================
                FD HISTORY
            ========================================= */}

            <section className="fd-history">

                <div className="history-heading">

                    <div>
                        <span className="section-label">
                            YOUR INVESTMENTS
                        </span>

                        <h2>
                            My Fixed Deposits
                        </h2>
                    </div>

                    <span className="fd-count">
                        {fdHistory.length}{" "}
                        {fdHistory.length === 1
                            ? "Deposit"
                            : "Deposits"}
                    </span>

                </div>

                {fdHistory.length === 0 ? (

                    <div className="empty-card">

                        <div className="empty-icon">
                            ₹
                        </div>

                        <h3>
                            No Fixed Deposits Found
                        </h3>

                        <p>
                            Open your first Fixed Deposit and start
                            growing your savings securely.
                        </p>

                    </div>

                ) : (

                    <div className="fd-list">

                        {fdHistory.map((fd) => (

                            <div
                                className="fd-item"
                                key={fd.id}
                            >

                                <div className="fd-item-header">

                                    <div>

                                        <span className="fd-account-label">
                                            FIXED DEPOSIT
                                        </span>

                                        <h3>
                                            ₹{" "}
                                            {Number(
                                                fd.principalAmount
                                            ).toLocaleString("en-IN")}
                                        </h3>

                                    </div>

                                    <span
                                        className={`fd-status ${
                                            fd.status?.toLowerCase()
                                        }`}
                                    >
                                        {fd.status}
                                    </span>

                                </div>

                                <div className="fd-details-grid">

                                    <div className="fd-detail">

                                        <span>
                                            Interest Rate
                                        </span>

                                        <strong>
                                            {fd.interestRate}%
                                        </strong>

                                    </div>

                                    <div className="fd-detail">

                                        <span>
                                            Tenure
                                        </span>

                                        <strong>
                                            {fd.tenureMonths} Months
                                        </strong>

                                    </div>

                                    <div className="fd-detail">

                                        <span>
                                            Maturity Amount
                                        </span>

                                        <strong className="maturity-value">
                                            ₹{" "}
                                            {Number(
                                                fd.maturityAmount
                                            ).toLocaleString("en-IN")}
                                        </strong>

                                    </div>

                                    <div className="fd-detail">

                                        <span>
                                            Created
                                        </span>

                                        <strong>
                                            {fd.createdDate
                                                ? fd.createdDate.substring(
                                                      0,
                                                      10
                                                  )
                                                : "--"}
                                        </strong>

                                    </div>

                                </div>

                                {/* Rejection Information */}
                                {fd.status === "REJECTED" && fd.rejectionReason && (
                                    <div className="fd-rejection-info">
                                        <div className="fd-rejection-header">
                                            <span className="fd-rejection-icon">⚠</span>
                                            <div>
                                                <strong>Fixed Deposit Rejected</strong>
                                                <p>
                                                    Your Fixed Deposit application was rejected by the bank.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="fd-rejection-reason">
                                            <span>Rejection Reason</span>
                                            <p>{fd.rejectionReason}</p>
                                        </div>

                                        <div className="fd-refund-message">
                                            Your principal amount has been refunded to your account.
                                        </div>
                                    </div>
                                )}

                            </div>

                        ))}

                    </div>

                )}

            </section>

            {/* =========================================
                CUSTOM FD CONFIRMATION / RESULT MODAL
                Replaces browser alert() popups
            ========================================= */}
            {modal.open && (
                <div
                    className="fd-modal-overlay"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !opening) {
                            closeModal();
                        }
                    }}
                >
                    <div
                        className={`fd-modal fd-modal-${modal.type}`}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="fd-modal-title"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <div className="fd-modal-header">
                            <div>
                                <span className="fd-modal-eyebrow">
                                    {modal.type === "confirm"
                                        ? "ACTION CONFIRMATION"
                                        : modal.type === "success"
                                            ? "TRANSACTION SUCCESSFUL"
                                            : "ACTION FAILED"}
                                </span>
                                <h2 id="fd-modal-title">{modal.title}</h2>
                            </div>

                            <button
                                type="button"
                                className="fd-modal-close"
                                onClick={closeModal}
                                disabled={opening}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <div className="fd-modal-body">
                            {modal.type === "confirm" ? (
                                <>
                                    <div className="fd-modal-icon fd-modal-icon-confirm">
                                        ₹
                                    </div>

                                    <h3>Confirm Fixed Deposit</h3>
                                    <p>{modal.message}</p>

                                    <div className="fd-modal-summary">
                                        <div>
                                            <span>DEPOSIT AMOUNT</span>
                                            <strong>
                                                ₹ {Number(amount || 0).toLocaleString("en-IN")}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>TENURE</span>
                                            <strong>{Number(tenure || 0)} Months</strong>
                                        </div>

                                        <div>
                                            <span>INTEREST RATE</span>
                                            <strong>{interestRate}%</strong>
                                        </div>

                                        <div>
                                            <span>MATURITY AMOUNT</span>
                                            <strong className="fd-modal-highlight">
                                                ₹{" "}
                                                {maturityAmount
                                                    ? Number(maturityAmount).toLocaleString("en-IN")
                                                    : "0.00"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="fd-modal-notice">
                                        <span className="fd-modal-notice-icon">✓</span>
                                        <span>
                                            The selected amount will be debited from your account
                                            when the Fixed Deposit is created.
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="fd-modal-icon">
                                        {modal.type === "success" ? "✓" : "!"}
                                    </div>

                                    <h3>{modal.title}</h3>
                                    <p>{modal.message}</p>
                                </>
                            )}
                        </div>

                        <div className="fd-modal-footer">
                            {modal.type === "confirm" ? (
                                <>
                                    <button
                                        type="button"
                                        className="fd-modal-btn fd-modal-btn-secondary"
                                        onClick={closeModal}
                                        disabled={opening}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        className="fd-modal-btn fd-modal-btn-primary"
                                        onClick={confirmOpenFD}
                                        disabled={opening}
                                    >
                                        {opening ? (
                                            <>
                                                <span className="fd-modal-spinner" />
                                                Opening...
                                            </>
                                        ) : (
                                            <>✓ Confirm & Open FD</>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className="fd-modal-btn fd-modal-btn-primary"
                                    onClick={closeModal}
                                >
                                    Done
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FixedDeposit;