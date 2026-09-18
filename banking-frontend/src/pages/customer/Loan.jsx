import { useEffect, useState } from "react";
import customerService from "../../services/customerService";
import "../../assets/styles/Loan.css";

function Loan() {
    const [selectedLoan, setSelectedLoan] = useState("HOME");
    const [amount, setAmount] = useState("");
    const [tenure, setTenure] = useState("");
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const interestRate =
        selectedLoan === "HOME"
            ? 8.5
            : selectedLoan === "CAR"
                ? 9
                : selectedLoan === "PERSONAL"
                    ? 12.5
                    : 7.5;

    const calculateEMI = () => {
        if (!amount || !tenure) {
            return null;
        }

        const principal = Number(amount);
        const months = Number(tenure);

        if (principal <= 0 || months <= 0) {
            return null;
        }

        const monthlyRate = interestRate / (12 * 100);

        const emi =
            (principal *
                monthlyRate *
                Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);

        const monthlyEmi = emi.toFixed(2);
        const totalPayment = (emi * months).toFixed(2);
        const totalInterest = (
            Number(totalPayment) - principal
        ).toFixed(2);

        return {
            monthlyEmi,
            totalPayment,
            totalInterest,
        };
    };

    const loadLoans = async () => {
        try {
            const response = await customerService.getLoans();
            setLoans(response.data);
        } catch (error) {
            console.error("Unable to load loans:", error);
        }
    };

    useEffect(() => {
        loadLoans();
    }, []);

    const handleApplyLoan = async () => {
        if (!amount || !tenure || Number(amount) <= 0 || Number(tenure) <= 0) {
            alert("Please enter a valid loan amount and tenure.");
            return;
        }

        try {
            setLoading(true);

            const request = {
                loanType: selectedLoan,
                amount: Number(amount),
                tenureMonths: Number(tenure),
            };

            await customerService.applyLoan(request);

            setShowSuccessModal(true);

            setAmount("");
            setTenure("");

            loadLoans();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to apply loan."
            );
        } finally {
            setLoading(false);
        }
    };

    const emiData = calculateEMI();

    const hasActiveLoan = loans.some((loan) =>
        ["APPLIED", "APPROVED", "DISBURSED"].includes(loan.status)
    );

    const loanTypes = [
        {
            type: "HOME",
            icon: "🏠",
            title: "Home Loan",
            description: "For your dream home",
            rate: "8.5%",
        },
        {
            type: "CAR",
            icon: "🚗",
            title: "Car Loan",
            description: "Drive your new car",
            rate: "9%",
        },
        {
            type: "PERSONAL",
            icon: "👤",
            title: "Personal",
            description: "Flexible personal finance",
            rate: "12.5%",
        },
        {
            type: "EDUCATION",
            icon: "🎓",
            title: "Education",
            description: "Invest in your future",
            rate: "7.5%",
        },
    ];

    const getRejectionReason = (loan) => {
        if (!loan || loan.status !== "REJECTED") {
            return "";
        }

        return (
            loan.rejectionReason ||
            loan.rejectReason ||
            loan.reason ||
            loan.rejection_reason ||
            ""
        );
    };

    return (
        <div className="loan-page">

            {/* ================================
                TOP SECTION
            ================================= */}

            <div className="loan-top">

                {/* Loan Types */}

                <section className="loan-types">

                    <div className="section-heading">
                        <div>
                            <h2>Loan Types</h2>
                            <p>Select a loan that suits your needs</p>
                        </div>
                    </div>

                    <div className="loan-grid">

                        {loanTypes.map((loan) => (
                            <button
                                type="button"
                                key={loan.type}
                                className={`loan-item ${
                                    selectedLoan === loan.type
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setSelectedLoan(loan.type)
                                }
                            >

                                <div className="loan-icon">
                                    {loan.icon}
                                </div>

                                <div className="loan-item-content">
                                    <h3>{loan.title}</h3>
                                    <p>{loan.description}</p>
                                </div>

                                <span className="loan-rate">
                                    {loan.rate} p.a.
                                </span>

                            </button>
                        ))}

                    </div>

                </section>

                {/* Loan Calculator */}

                <section className="loan-calculator">

                    <div className="section-heading">
                        <div>
                            <h2>Loan Calculator</h2>
                            <p>Estimate your loan and monthly EMI</p>
                        </div>

                        <div className="calculator-icon">
                            ₹
                        </div>
                    </div>

                    <div className="loan-form">

                        <div className="form-group">

                            <label htmlFor="loan-type">
                                Loan Type
                            </label>

                            <input
                                id="loan-type"
                                type="text"
                                value={selectedLoan}
                                readOnly
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="loan-amount">
                                Loan Amount (₹)
                            </label>

                            <input
                                id="loan-amount"
                                type="number"
                                min="1"
                                placeholder="Enter Amount"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value)
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="loan-tenure">
                                Tenure (Months)
                            </label>

                            <input
                                id="loan-tenure"
                                type="number"
                                min="1"
                                placeholder="60"
                                value={tenure}
                                onChange={(e) =>
                                    setTenure(e.target.value)
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="interest-rate">
                                Interest Rate
                            </label>

                            <input
                                id="interest-rate"
                                type="text"
                                value={`${interestRate}% p.a.`}
                                readOnly
                            />

                        </div>

                        <button
                            type="button"
                            className="loan-btn"
                            onClick={handleApplyLoan}
                            disabled={
                                loading ||
                                hasActiveLoan
                            }
                        >

                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Applying...
                                </>
                            ) : hasActiveLoan ? (
                                "Loan Already Applied"
                            ) : (
                                "Apply Loan"
                            )}

                        </button>

                    </div>

                    {/* EMI Summary */}

                    {emiData && (
                        <div className="emi-card">

                            <div className="emi-header">
                                <div>
                                    <h3>Loan Summary</h3>
                                    <p>
                                        Estimated repayment details
                                    </p>
                                </div>

                                <span className="emi-icon">
                                    ₹
                                </span>
                            </div>

                            <div className="emi-main">

                                <span>Monthly EMI</span>

                                <strong>
                                    ₹ {emiData.monthlyEmi}
                                </strong>

                            </div>

                            <div className="emi-details">

                                <div className="emi-row">

                                    <span>
                                        Total Interest
                                    </span>

                                    <strong>
                                        ₹ {emiData.totalInterest}
                                    </strong>

                                </div>

                                <div className="emi-row">

                                    <span>
                                        Total Payment
                                    </span>

                                    <strong>
                                        ₹ {emiData.totalPayment}
                                    </strong>

                                </div>

                            </div>

                        </div>
                    )}

                </section>

            </div>

            {/* ================================
                LOAN HISTORY
            ================================= */}

            <section className="loan-history">

                <div className="history-heading">

                    <div>
                        <h2>My Loan Applications</h2>
                        <p>
                            Track your current and previous loan applications
                        </p>
                    </div>

                    <span className="application-count">
                        {loans.length}{" "}
                        {loans.length === 1
                            ? "Application"
                            : "Applications"}
                    </span>

                </div>

                {loans.length === 0 ? (
                    <div className="empty-loans">

                        <div className="empty-icon">
                            📄
                        </div>

                        <h3>
                            No Loan Applications
                        </h3>

                        <p>
                            Apply for your first loan to get started.
                        </p>

                    </div>
                ) : (
                    <div className="loan-history-list">

                        {loans.map((loan) => (
                            <div
                                key={loan.id}
                                className="loan-history-card"
                            >

                                <div className="loan-card-header">

                                    <div>
                                        <span className="loan-card-label">
                                            Loan Type
                                        </span>

                                        <h3>
                                            {loan.loanType}
                                        </h3>
                                    </div>

                                    <span
                                        className={`loan-status ${loan.status.toLowerCase()}`}
                                    >
                                        {loan.status}
                                    </span>

                                </div>

                                <div className="loan-details-grid">

                                    <div className="loan-detail">
                                        <span>Amount</span>
                                        <strong>
                                            ₹ {loan.amount}
                                        </strong>
                                    </div>

                                    <div className="loan-detail">
                                        <span>EMI</span>
                                        <strong>
                                            ₹ {loan.emi}
                                        </strong>
                                    </div>

                                    <div className="loan-detail">
                                        <span>Remaining Amount</span>
                                        <strong>
                                            ₹ {loan.remainingAmount}
                                        </strong>
                                    </div>

                                    <div className="loan-detail">
                                        <span>Remaining EMI</span>
                                        <strong>
                                            {loan.remainingInstallments}
                                        </strong>
                                    </div>

                                    <div className="loan-detail">
                                        <span>Next EMI</span>
                                        <strong>
                                            {loan.nextEmiDate
                                                ? loan.nextEmiDate.substring(0, 10)
                                                : "--"}
                                        </strong>
                                    </div>

                                    <div className="loan-detail">
                                        <span>Applied On</span>
                                        <strong>
                                            {loan.appliedDate
                                                ? loan.appliedDate.substring(0, 10)
                                                : "--"}
                                        </strong>
                                    </div>

                                </div>

                                {loan.status === "REJECTED" && (
                                    <div className="loan-rejection-reason">
                                        <div className="loan-rejection-reason-header">
                                            <span className="loan-rejection-reason-icon">!</span>
                                            <span>Rejection Reason</span>
                                        </div>

                                        <p>
                                            {getRejectionReason(loan) ||
                                                "No rejection reason was provided."}
                                        </p>
                                    </div>
                                )}

                            </div>
                        ))}

                    </div>
                )}

            </section>

            {/* ==========================================
                SUCCESS CONFIRMATION MODAL
                Replaces browser alert only.
                Loan application functionality is unchanged.
            ========================================== */}
            {showSuccessModal && (
                <div
                    className="loan-success-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="loan-success-title"
                >
                    <div className="loan-success-modal">
                        <div className="loan-success-icon">
                            ✓
                        </div>

                        <h2 id="loan-success-title">
                            Loan Application Submitted
                        </h2>

                        <p>
                            Your loan application has been submitted successfully.
                        </p>

                        <button
                            type="button"
                            className="loan-success-btn"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Loan;