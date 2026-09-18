import StatCard from "./StatCard";
import {
    FaWallet,
    FaArrowDown,
    FaArrowUp,
    FaExchangeAlt
} from "react-icons/fa";
import "../../assets/styles/StatsGrid.css";


function StatsGrid({
    account,
    stats,
    showBalance
}) {

    const balance = Number(
        account?.balance || 0
    ).toLocaleString("en-IN", {
        minimumFractionDigits: 2
    });

    const deposits = Number(
        stats?.totalDeposits || 0
    ).toLocaleString("en-IN", {
        minimumFractionDigits: 0
    });

    const withdrawals = Number(
        stats?.totalWithdrawals || 0
    ).toLocaleString("en-IN", {
        minimumFractionDigits: 0
    });

    return (
        <div className="stats-grid">

            <StatCard
                title="Available Balance"
                value={
                    showBalance
                        ? `₹${balance}`
                        : "₹ ••••••••"
                }
                icon={FaWallet}
                color="#2563eb"
            />

            <StatCard
                title="Total Deposits"
                value={`₹${deposits}`}
                icon={FaArrowDown}
                color="#16a34a"
            />

            <StatCard
                title="Total Withdrawals"
                value={`₹${withdrawals}`}
                icon={FaArrowUp}
                color="#dc2626"
            />

            <StatCard
                title="Transactions"
                value={stats?.totalTransactions || 0}
                icon={FaExchangeAlt}
                color="#7c3aed"
            />

        </div>
    );
}

export default StatsGrid;