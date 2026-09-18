import {
    FaWallet,
    FaArrowDown,
    FaArrowUp,
    FaExchangeAlt
} from "react-icons/fa";

import StatCard from "./StatCard";

function AccountSummary({ account, transactions }) {

    const balance = account?.balance || 0;

    const totalTransactions = transactions?.length || 0;

    const totalDeposit =
        transactions
            ?.filter(t => t.type === "DEPOSIT")
            .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    const totalWithdraw =
        transactions
            ?.filter(t => t.type === "WITHDRAW")
            .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    return (

        <div className="summary-grid">

            <StatCard
                title="Available Balance"
                value={`₹${balance.toLocaleString()}`}
                icon={FaWallet}
                color="#2563eb"
            />

            <StatCard
                title="Total Deposits"
                value={`₹${totalDeposit.toLocaleString()}`}
                icon={FaArrowDown}
                color="#16a34a"
            />

            <StatCard
                title="Total Withdrawals"
                value={`₹${totalWithdraw.toLocaleString()}`}
                icon={FaArrowUp}
                color="#dc2626"
            />

            <StatCard
                title="Transactions"
                value={totalTransactions}
                icon={FaExchangeAlt}
                color="#7c3aed"
            />

        </div>

    );

}

export default AccountSummary;