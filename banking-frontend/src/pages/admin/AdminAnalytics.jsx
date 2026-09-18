import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
    getAdminDashboard,
    getAdminAnalytics,
} from "../../api/adminApi";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import "../../assets/styles/admin-analytics.css";


function AdminAnalytics() {

    const [dashboard, setDashboard] = useState(null);
    const [analytics, setAnalytics] = useState(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        loadAnalytics();
    }, []);


    const loadAnalytics = async () => {

        try {

            setRefreshing(true);

            const [
                dashboardResponse,
                analyticsResponse
            ] = await Promise.all([
                getAdminDashboard(),
                getAdminAnalytics()
            ]);

            setDashboard(dashboardResponse.data);
            setAnalytics(analyticsResponse.data);

        } catch (error) {

            console.error(
                "Admin analytics error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to load analytics."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    const totalCustomers =
        dashboard?.totalCustomers ?? 0;

    const activeCustomers =
        dashboard?.activeCustomers ?? 0;

    const activePercentage =
        totalCustomers > 0
            ? Math.round(
                (activeCustomers / totalCustomers) * 100
            )
            : 0;


    const blockedCustomers =
        dashboard?.blockedCustomers ?? 0;


    const monthlyTransactions =
        analytics?.monthlyTransactions || [];

    const transactionTypes =
        analytics?.transactionTypes || [];

    const loanStatus =
        analytics?.loanStatus || [];

    const fixedDepositStatus =
        analytics?.fixedDepositStatus || [];

    const recurringDepositStatus =
        analytics?.recurringDepositStatus || [];

    const topCustomers =
        analytics?.topCustomers || [];


    const maxTransactionType = useMemo(() => {

        return Math.max(
            ...transactionTypes.map(
                item => Number(item.count || 0)
            ),
            1
        );

    }, [transactionTypes]);


    const maxLoanStatus = useMemo(() => {

        return Math.max(
            ...loanStatus.map(
                item => Number(item.count || 0)
            ),
            1
        );

    }, [loanStatus]);


    if (loading) {

        return (
            <div className="admin-analytics-page">

                <div className="admin-analytics-loading">

                    <div className="analytics-spinner"></div>

                    <p>
                        Loading banking analytics...
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="admin-analytics-page">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="analytics-page-header">

                <div>

                    <span className="analytics-eyebrow">
                        ANALYTICS
                    </span>

                    <h1>
                        Banking Analytics
                    </h1>

                    <p>
                        Real-time banking performance based on
                        data stored in the system.
                    </p>

                </div>


                <button
                    type="button"
                    className="analytics-refresh-button"
                    onClick={loadAnalytics}
                    disabled={refreshing}
                >

                    <i
                        className={`bi ${
                            refreshing
                                ? "bi-arrow-repeat analytics-spin"
                                : "bi-arrow-clockwise"
                        }`}
                    ></i>

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"
                    }

                </button>

            </div>


            {/* =====================================================
                MAIN KPI CARDS
            ===================================================== */}

            <div className="analytics-kpi-grid">

                <KpiCard
                    title="Total Customers"
                    value={
                        dashboard?.totalCustomers ?? 0
                    }
                    subtitle="Registered customers"
                    icon="bi-people-fill"
                    type="blue"
                />


                <KpiCard
                    title="Active Customers"
                    value={
                        dashboard?.activeCustomers ?? 0
                    }
                    subtitle={`${activePercentage}% of customers`}
                    icon="bi-check-lg"
                    type="green"
                />


                <KpiCard
                    title="Total Balance"
                    value={`₹${formatAmount(
                        dashboard?.totalBalance
                    )}`}
                    subtitle="Current account balance"
                    icon="bi-currency-rupee"
                    type="orange"
                />


                <KpiCard
                    title="Transactions"
                    value={
                        dashboard?.totalTransactions ?? 0
                    }
                    subtitle="Total processed transactions"
                    icon="bi-arrow-left-right"
                    type="purple"
                />

            </div>


            {/* =====================================================
                FINANCIAL OVERVIEW
            ===================================================== */}

            <section className="analytics-section">

                <div className="analytics-section-heading">

                    <div>

                        <h2>
                            Financial Overview
                        </h2>

                        <p>
                            Money movement and financial products
                            across the banking system.
                        </p>

                    </div>

                </div>


                <div className="financial-grid">

                    <OverviewCard
                        title="Total Deposits"
                        value={
                            dashboard?.totalDeposits ?? 0
                        }
                        subtitle="Deposit transactions"
                        type="green"
                    />


                    <OverviewCard
                        title="Total Withdrawals"
                        value={
                            dashboard?.totalWithdrawals ?? 0
                        }
                        subtitle="Withdrawal transactions"
                        type="red"
                    />


                    <OverviewCard
                        title="Total Loans"
                        value={
                            dashboard?.totalLoans ?? 0
                        }
                        subtitle="Loan accounts"
                        type="purple"
                    />


                    <OverviewCard
                        title="Fixed Deposits"
                        value={
                            dashboard?.totalFixedDeposits ?? 0
                        }
                        subtitle="Total FD accounts"
                        type="blue"
                    />


                    <OverviewCard
                        title="Recurring Deposits"
                        value={
                            dashboard?.totalRecurringDeposits ?? 0
                        }
                        subtitle="Total RD accounts"
                        type="green"
                    />


                    <OverviewCard
                        title="ATM Cards"
                        value={
                            dashboard?.totalATMCards ?? 0
                        }
                        subtitle="Total ATM records"
                        type="orange"
                    />

                </div>

            </section>


            {/* =====================================================
                MONTHLY TRANSACTIONS
            ===================================================== */}

            <AnalyticsCard
                title="Monthly Transactions"
                subtitle="Transaction activity for the current year."
                badge="LIVE DATA"
            >

                <div className="monthly-chart">

                    <ResponsiveContainer
                        width="100%"
                        height={360}
                    >

                        <BarChart
                            data={monthlyTransactions}
                            margin={{
                                top: 20,
                                right: 10,
                                left: 0,
                                bottom: 5
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e8edf5"
                            />

                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "#64748b",
                                    fontSize: 12
                                }}
                            />

                            <YAxis
                                allowDecimals={false}
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "#64748b",
                                    fontSize: 12
                                }}
                            />

                            <Tooltip
                                cursor={{
                                    fill: "#f1f5f9"
                                }}
                                contentStyle={{
                                    border:
                                        "1px solid #e2e8f0",
                                    borderRadius:
                                        "12px",
                                    boxShadow:
                                        "0 10px 30px rgba(15,23,42,.10)"
                                }}
                            />

                            <Bar
                                dataKey="totalTransactions"
                                fill="#2563eb"
                                radius={[
                                    7,
                                    7,
                                    0,
                                    0
                                ]}
                                barSize={38}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </AnalyticsCard>


            {/* =====================================================
                TRANSACTION TYPES + LOAN STATUS
            ===================================================== */}

            <div className="analytics-two-column">

                <AnalyticsCard
                    title="Transaction Types"
                    subtitle="Distribution of transactions by type."
                >

                    <div className="status-list">

                        {transactionTypes.length > 0 ? (

                            transactionTypes.map(
                                (item, index) => {

                                    const count =
                                        Number(
                                            item.count || 0
                                        );

                                    const percentage =
                                        Math.round(
                                            (count /
                                                maxTransactionType) *
                                            100
                                        );

                                    return (

                                        <div
                                            className="status-item"
                                            key={`${item.type}-${index}`}
                                        >

                                            <div className="status-item-top">

                                                <span>
                                                    {item.type}
                                                </span>

                                                <strong>
                                                    {count}
                                                </strong>

                                            </div>

                                            <div className="progress-track">

                                                <div
                                                    className="progress-fill blue"
                                                    style={{
                                                        width:
                                                            `${percentage}%`
                                                    }}
                                                ></div>

                                            </div>

                                        </div>
                                    );
                                }
                            )

                        ) : (

                            <EmptyState
                                message="No transaction type data available."
                            />

                        )}

                    </div>

                </AnalyticsCard>


                <AnalyticsCard
                    title="Loan Status"
                    subtitle="Current loan distribution."
                >

                    <div className="status-list">

                        {loanStatus.length > 0 ? (

                            loanStatus.map(
                                (item, index) => {

                                    const count =
                                        Number(
                                            item.count || 0
                                        );

                                    const percentage =
                                        Math.round(
                                            (count /
                                                maxLoanStatus) *
                                            100
                                        );

                                    return (

                                        <div
                                            className="status-item"
                                            key={`${item.status}-${index}`}
                                        >

                                            <div className="status-item-top">

                                                <span>
                                                    {item.status}
                                                </span>

                                                <strong>
                                                    {count}
                                                </strong>

                                            </div>

                                            <div className="progress-track">

                                                <div
                                                    className="progress-fill purple"
                                                    style={{
                                                        width:
                                                            `${percentage}%`
                                                    }}
                                                ></div>

                                            </div>

                                        </div>
                                    );
                                }
                            )

                        ) : (

                            <EmptyState
                                message="No loan status data available."
                            />

                        )}

                    </div>

                </AnalyticsCard>

            </div>


            {/* =====================================================
                DEPOSIT STATUS
            ===================================================== */}

            <div className="analytics-two-column">

                <DepositStatusCard
                    title="Fixed Deposit Status"
                    subtitle="Current FD portfolio distribution."
                    data={fixedDepositStatus}
                />


                <DepositStatusCard
                    title="Recurring Deposit Status"
                    subtitle="Current RD portfolio distribution."
                    data={recurringDepositStatus}
                />

            </div>


            {/* =====================================================
                TOP CUSTOMERS
            ===================================================== */}

            <AnalyticsCard
                title="Top 5 Customers"
                subtitle="Customers ranked by account balance."
                badge="DATABASE"
            >

                <div className="top-customers-wrapper">

                    <table className="top-customers-table">

                        <thead>

                            <tr>

                                <th>
                                    RANK
                                </th>

                                <th>
                                    CUSTOMER
                                </th>

                                <th>
                                    ACCOUNT NUMBER
                                </th>

                                <th>
                                    BALANCE
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {topCustomers.length > 0 ? (

                                topCustomers
                                    .slice(0, 5)
                                    .map(
                                        (customer, index) => (

                                            <tr
                                                key={`${customer.accountNumber}-${index}`}
                                            >

                                                <td>

                                                    <span className="rank-circle">
                                                        {index + 1}
                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="customer-name">

                                                        <div className="customer-avatar">
                                                            {getInitials(
                                                                customer.fullName
                                                            )}
                                                        </div>

                                                        <strong>
                                                            {
                                                                customer.fullName
                                                            }
                                                        </strong>

                                                    </div>

                                                </td>


                                                <td>

                                                    <span className="account-number">
                                                        {
                                                            customer.accountNumber ||
                                                            "Not Assigned"
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <strong className="customer-balance">
                                                        ₹
                                                        {formatAmount(
                                                            customer.balance
                                                        )}
                                                    </strong>

                                                </td>

                                            </tr>

                                        )
                                    )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="empty-table"
                                    >
                                        No customer analytics available.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </AnalyticsCard>


            {/* =====================================================
                PENDING OPERATIONS
            ===================================================== */}

            <AnalyticsCard
                title="Pending Operations"
                subtitle="Items currently requiring administrator attention."
            >

                <div className="pending-grid">

                    <PendingCard
                        title="Pending Loans"
                        value={
                            dashboard?.pendingLoans ?? 0
                        }
                    />

                    <PendingCard
                        title="Pending Fixed Deposits"
                        value={
                            dashboard?.pendingFixedDeposits ?? 0
                        }
                    />

                    <PendingCard
                        title="Pending Recurring Deposits"
                        value={
                            dashboard?.pendingRecurringDeposits ?? 0
                        }
                    />

                </div>

            </AnalyticsCard>


            {/* =====================================================
                CUSTOMER STATUS
            ===================================================== */}

            <AnalyticsCard
                title="Customer Status"
                subtitle="Current customer account distribution."
            >

                <div className="customer-status">

                    <CustomerStatusRow
                        label="Active"
                        value={activeCustomers}
                        total={totalCustomers}
                        type="green"
                    />

                    <CustomerStatusRow
                        label="Blocked"
                        value={blockedCustomers}
                        total={totalCustomers}
                        type="red"
                    />

                </div>


                <div className="customer-total">

                    <span>
                        Total Customers
                    </span>

                    <strong>
                        {totalCustomers}
                    </strong>

                </div>

            </AnalyticsCard>


            {/* =====================================================
                INFORMATION
            ===================================================== */}

            <div className="analytics-information">

                <div className="information-icon">
                    <i className="bi bi-info-lg"></i>
                </div>

                <div>

                    <strong>
                        Analytics Information
                    </strong>

                    <p>
                        All figures shown on this page are
                        retrieved from the Enterprise Bank backend
                        and calculated from the current database
                        records.
                    </p>

                </div>

            </div>

        </div>
    );
}


/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({
    title,
    value,
    subtitle,
    icon,
    type
}) {

    return (

        <div className="analytics-kpi-card">

            <div className={`kpi-icon ${type}`}>
                <i className={`bi ${icon}`}></i>
            </div>

            <div className="kpi-content">

                <span>
                    {title}
                </span>

                <strong>
                    {value}
                </strong>

                <small>
                    {subtitle}
                </small>

            </div>

        </div>
    );
}


/* =========================================================
   OVERVIEW CARD
========================================================= */

function OverviewCard({
    title,
    value,
    subtitle,
    type
}) {

    return (

        <div className={`overview-card ${type}`}>

            <span>
                {title}
            </span>

            <strong>
                {value}
            </strong>

            <small>
                {subtitle}
            </small>

        </div>
    );
}


/* =========================================================
   ANALYTICS CARD
========================================================= */

function AnalyticsCard({
    title,
    subtitle,
    badge,
    children
}) {

    return (

        <section className="analytics-card">

            <div className="analytics-card-header">

                <div>

                    <h2>
                        {title}
                    </h2>

                    <p>
                        {subtitle}
                    </p>

                </div>

                {badge && (

                    <span className="analytics-badge">
                        {badge}
                    </span>

                )}

            </div>

            {children}

        </section>
    );
}


/* =========================================================
   DEPOSIT STATUS
========================================================= */

function DepositStatusCard({
    title,
    subtitle,
    data
}) {

    const maxCount = Math.max(
        ...data.map(
            item => Number(item.count || 0)
        ),
        1
    );


    return (

        <AnalyticsCard
            title={title}
            subtitle={subtitle}
        >

            <div className="deposit-status-list">

                {data.length > 0 ? (

                    data.map((item, index) => {

                        const count =
                            Number(item.count || 0);

                        const percentage =
                            Math.round(
                                (count / maxCount) * 100
                            );

                        return (

                            <div
                                className="deposit-status-item"
                                key={`${item.status}-${index}`}
                            >

                                <div className="deposit-status-top">

                                    <span>
                                        {item.status}
                                    </span>

                                    <strong>
                                        {count}
                                    </strong>

                                </div>

                                <div className="progress-track">

                                    <div
                                        className="progress-fill green"
                                        style={{
                                            width:
                                                `${percentage}%`
                                        }}
                                    ></div>

                                </div>

                            </div>
                        );
                    })

                ) : (

                    <EmptyState
                        message="No deposit status data available."
                    />

                )}

            </div>

        </AnalyticsCard>
    );
}


/* =========================================================
   PENDING CARD
========================================================= */

function PendingCard({
    title,
    value
}) {

    return (

        <div className="pending-card">

            <span>
                {title}
            </span>

            <strong>
                {value}
            </strong>

        </div>
    );
}


/* =========================================================
   CUSTOMER STATUS
========================================================= */

function CustomerStatusRow({
    label,
    value,
    total,
    type
}) {

    const percentage =
        total > 0
            ? Math.round((value / total) * 100)
            : 0;


    return (

        <div className="customer-status-row">

            <div className="customer-status-header">

                <div>

                    <span
                        className={`status-dot ${type}`}
                    ></span>

                    <span>
                        {label}
                    </span>

                </div>

                <strong>
                    {value}
                </strong>

            </div>


            <div className="progress-track">

                <div
                    className={`progress-fill ${type}`}
                    style={{
                        width:
                            `${percentage}%`
                    }}
                ></div>

            </div>

        </div>
    );
}


/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
    message
}) {

    return (

        <div className="analytics-empty">
            {message}
        </div>

    );
}


/* =========================================================
   HELPERS
========================================================= */

function formatAmount(amount) {

    if (
        amount === null ||
        amount === undefined
    ) {
        return "0.00";
    }

    return Number(amount).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


function getInitials(name) {

    if (!name) {
        return "C";
    }

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(
            word =>
                word.charAt(0).toUpperCase()
        )
        .join("");
}


export default AdminAnalytics;