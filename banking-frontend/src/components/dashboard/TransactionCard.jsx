import {
    FaArrowDown,
    FaArrowUp,
    FaExchangeAlt,
    FaMoneyBillWave,
    FaUniversity,
    FaFileInvoice,
    FaCreditCard
} from "react-icons/fa";

function TransactionCard({
    transaction,
    onClick
}) {

    const type = transaction?.type || "";

    const getTransactionConfig = () => {

        switch (type) {

            case "DEPOSIT":
                return {
                    icon: FaArrowDown,
                    color: "green",
                    title: "Deposit"
                };

            case "WITHDRAW":
                return {
                    icon: FaArrowUp,
                    color: "red",
                    title: "Withdrawal"
                };

            case "TRANSFER_IN":
                return {
                    icon: FaArrowDown,
                    color: "green",
                    title: "Transfer Received"
                };

            case "TRANSFER_OUT":
                return {
                    icon: FaExchangeAlt,
                    color: "blue",
                    title: "Transfer"
                };

            case "LOAN_CREDIT":
                return {
                    icon: FaMoneyBillWave,
                    color: "green",
                    title: "Loan Credit"
                };

            case "LOAN_EMI":
                return {
                    icon: FaMoneyBillWave,
                    color: "red",
                    title: "Loan EMI"
                };

            case "FIXED_DEPOSIT":
            case "FD_OPEN":
            case "FD_MATURITY":
            case "FD_REFUND":
                return {
                    icon: FaUniversity,
                    color: "purple",
                    title: "Fixed Deposit"
                };

            case "RD_OPEN":
            case "RD_MATURITY":
            case "RD_REFUND":
                return {
                    icon: FaUniversity,
                    color: "orange",
                    title: "Recurring Deposit"
                };

            default:
                return {
                    icon: FaFileInvoice,
                    color: "gray",
                    title: type || "Transaction"
                };
        }
    };

    const config = getTransactionConfig();

    const Icon = config.icon;

    const amount = Number(transaction?.amount || 0);

    const isCredit =
        type === "DEPOSIT" ||
        type === "TRANSFER_IN" ||
        type === "LOAN_CREDIT" ||
        type === "FD_MATURITY" ||
        type === "FD_REFUND" ||
        type === "RD_MATURITY" ||
        type === "RD_REFUND";

    const formattedAmount =
        `${isCredit ? "+" : "-"} ₹${amount.toLocaleString("en-IN")}`;

    const transactionDate =
        transaction?.transactionTime
            ? new Date(
                transaction.transactionTime
            ).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
            : "Date unavailable";

    return (

        <div
            className={`transaction-card ${
                onClick ? "transaction-card-clickable" : ""
            }`}
            onClick={onClick}
            onKeyDown={(e) => {

                if (
                    onClick &&
                    (e.key === "Enter" || e.key === " ")
                ) {

                    e.preventDefault();

                    onClick();
                }

            }}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >

            <div
                className={`transaction-icon ${config.color}`}
            >

                <Icon />

            </div>

            <div className="transaction-details">

                <h4>
                    {
                        transaction?.description ||
                        config.title
                    }
                </h4>

                <span>
                    {transactionDate}
                </span>

                {
                    transaction?.reference && (

                        <span className="transaction-reference">

                            Ref: {transaction.reference}

                        </span>

                    )
                }

            </div>

            <div className="transaction-right">

                <h3
                    className={
                        isCredit
                            ? "transaction-credit"
                            : "transaction-debit"
                    }
                >

                    {formattedAmount}

                </h3>

                <span className="success-badge">

                    ✓ Successful

                </span>

            </div>

        </div>

    );
}

export default TransactionCard;