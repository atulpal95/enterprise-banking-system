import WelcomeCard from "../../components/dashboard/WelcomeCard";
import StatsGrid from "../../components/dashboard/StatsGrid";
import QuickActions from "../../components/dashboard/QuickActions/QuickActions";
import SpendingChart from "../../components/dashboard/SpendingChart";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import AccountOverview from "../../components/dashboard/AccountOverview";

import { useState } from "react";

import useDashboard from "../../hooks/useDashboard";


function CustomerDashboard() {

    const [showBalance, setShowBalance] = useState(false);


    const {
        profile,
        account,
        transactions,
        chartData,
        stats,
        loading,
        error
    } = useDashboard();


    if (loading) {

        return (
            <div className="dashboard-loading">
                Loading Dashboard...
            </div>
        );

    }


    if (error) {

        return (
            <div className="dashboard-error">
                {error}
            </div>
        );

    }


    return (

        <div className="customer-dashboard">


            {/* =====================================
                Welcome Card
            ===================================== */}

            <WelcomeCard
                profile={profile}
                account={account}
                showBalance={showBalance}
                onToggleBalance={() =>
                    setShowBalance(
                        (prev) => !prev
                    )
                }
            />


            {/* =====================================
                Statistics Cards
            ===================================== */}

            <StatsGrid
                account={account}
                stats={stats}
                showBalance={showBalance}
            />


            {/* =====================================
                Quick Actions
            ===================================== */}

            <QuickActions />


            {/* =====================================
                Charts + Account Overview
            ===================================== */}

            <div className="dashboard-grid">

                <SpendingChart
                    chartData={chartData}
                />

                <AccountOverview
                    account={account}
                />

            </div>


            {/* =====================================
                Recent Transactions
            ===================================== */}

            <RecentTransactions
                transactions={transactions}
            />


        </div>

    );

}


export default CustomerDashboard;