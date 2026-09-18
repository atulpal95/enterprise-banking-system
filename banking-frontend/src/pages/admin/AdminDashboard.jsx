import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
    getAdminDashboard,
    getAdminAnalytics,
} from "../../api/adminApi";

import { useAuth } from "../../context/AuthContext";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

import "../../assets/styles/admin-dashboard.css";


function AdminDashboard() {

    const { user } = useAuth();

    const [dashboard, setDashboard] = useState(null);

    const [analytics, setAnalytics] = useState(null);

    const [loading, setLoading] = useState(true);

    const [analyticsLoading, setAnalyticsLoading] =
        useState(true);


    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    useEffect(() => {

        loadDashboard();

    }, []);


    // =====================================================
    // LOAD DASHBOARD + ANALYTICS
    // =====================================================

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setAnalyticsLoading(true);


            // =============================================
            // MAIN DASHBOARD
            // =============================================

            const dashboardResponse =
                await getAdminDashboard();

            setDashboard(
                dashboardResponse.data
            );


            // =============================================
            // ANALYTICS
            // =============================================

            const analyticsResponse =
                await getAdminAnalytics();

            setAnalytics(
                analyticsResponse.data
            );


        } catch (error) {

            console.error(
                "Admin dashboard error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to load admin dashboard."
            );


        } finally {

            setLoading(false);
            setAnalyticsLoading(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="admin-dashboard-page">

                <div className="admin-dashboard-loading">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <p>
                        Loading Admin Dashboard...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="admin-dashboard-page">


            {/* =================================================
               TOOLBAR
            ================================================= */}

            <div className="admin-dashboard-toolbar">

                <div>

                    <span className="admin-dashboard-label">
                        BANKING OVERVIEW
                    </span>

                    <h2>

                        Welcome back,{" "}

                        {user?.fullName ||
                            user?.name ||
                            "Administrator"}

                    </h2>

                    <p>
                        Here is what's happening across PAL Bank today.
                    </p>

                </div>


                <button
                    type="button"
                    className="admin-refresh-button"
                    onClick={loadDashboard}
                >

                    <i className="bi bi-arrow-clockwise"></i>

                    Refresh

                </button>

            </div>


            {/* =================================================
               CUSTOMER OVERVIEW
            ================================================= */}

            <DashboardSection
                title="Customer Overview"
                subtitle="Customer accounts and balances"
            >

                <div className="admin-stat-grid">

                    <StatCard
                     title="Total Customers"
                     value={dashboard?.totalCustomers ?? 0}
                     icon="bi-people-fill"
                     path="/admin/customers?status=ALL"
                    />

                    <StatCard
                      title="Active Customers"
                      value={dashboard?.activeCustomers ?? 0}
                      icon="bi-person-check-fill"
                       path="/admin/customers?status=ACTIVE"
                    />

                    <StatCard
                      title="Blocked Customers"
                      value={dashboard?.blockedCustomers ?? 0}
                      icon="bi-person-x-fill"
                      path="/admin/customers?status=BLOCKED"
                    />

                    <StatCard
                        title="Total Balance"
                        value={
                            `₹ ${formatAmount(
                                dashboard?.totalBalance
                            )}`
                        }
                        icon="bi-wallet2"
                    />

                </div>

            </DashboardSection>


            {/* =================================================
               TRANSACTION OVERVIEW
            ================================================= */}

            <DashboardSection
                title="Transaction Overview"
                subtitle="Overall banking transaction activity"
            >

                <div className="admin-stat-grid">

                    <StatCard
                       title="Total Transactions"
                       value={
                       dashboard?.totalTransactions ?? 0
                       }
                       icon="bi-arrow-left-right"
                       path="/admin/transactions"
                    />

                    <StatCard
                      title="Total Deposits"
                      value={
                       dashboard?.totalDeposits ?? 0
                      }
                     icon="bi-arrow-down-circle-fill"
                     path="/admin/transactions?type=DEPOSIT"
                    />
                 <StatCard
                   title="Total Withdrawals"
                   value={
                   dashboard?.totalWithdrawals ?? 0
                    }
                   icon="bi-arrow-up-circle-fill"
                   path="/admin/transactions?type=WITHDRAW"
                  />

                </div>

            </DashboardSection>


            {/* =================================================
               LOAN OVERVIEW
            ================================================= */}

            <DashboardSection
                title="Loan Overview"
                subtitle="Customer loan application status"
            >

                <div className="admin-stat-grid">

                    <StatCard
                        title="Total Loans"
                        value={
                            dashboard?.totalLoans ?? 0
                        }
                        icon="bi-bank"
                        path="/admin/loans"
                    />

                    <StatCard
                        title="Pending Loans"
                        value={
                            dashboard?.pendingLoans ?? 0
                        }
                        icon="bi-hourglass-split"
                        path="/admin/loans"
                    />

                    <StatCard
                        title="Approved Loans"
                        value={
                            dashboard?.approvedLoans ?? 0
                        }
                        icon="bi-check-circle-fill"
                        path="/admin/loans"
                    />

                    <StatCard
                        title="Rejected Loans"
                        value={
                            dashboard?.rejectedLoans ?? 0
                        }
                        icon="bi-x-circle-fill"
                        path="/admin/loans"
                    />

                </div>

            </DashboardSection>


            {/* =================================================
               DEPOSIT SERVICES
            ================================================= */}

            <DashboardSection
                title="Deposit Services"
                subtitle="Fixed and recurring deposit activity"
            >

                <div className="admin-stat-grid">

                    <StatCard
                        title="Fixed Deposits"
                        value={
                            dashboard?.totalFixedDeposits ?? 0
                        }
                        icon="bi-safe-fill"
                        path="/admin/fixed-deposits"
                    />

                    <StatCard
                        title="Pending Fixed Deposits"
                        value={
                            dashboard?.pendingFixedDeposits ?? 0
                        }
                        icon="bi-clock-fill"
                        path="/admin/fixed-deposits"
                    />

                    <StatCard
                        title="Recurring Deposits"
                        value={
                            dashboard?.totalRecurringDeposits ?? 0
                        }
                        icon="bi-piggy-bank-fill"
                        path="/admin/recurring-deposits"
                    />

                    <StatCard
                        title="Pending Recurring Deposits"
                        value={
                            dashboard?.pendingRecurringDeposits ?? 0
                        }
                        icon="bi-calendar-check"
                        path="/admin/recurring-deposits"
                    />

                </div>

            </DashboardSection>


            {/* =================================================
               BANKING SERVICES
            ================================================= */}

            <DashboardSection
                title="Banking Services"
                subtitle="Cards, cheque books and administration"
            >

                <div className="admin-stat-grid">

                    <StatCard
                        title="ATM Cards"
                        value={
                            dashboard?.totalATMCards ?? 0
                        }
                        icon="bi-credit-card-fill"
                        path="/admin/atm-cards"
                    />

                    <StatCard
                        title="Cheque Book Requests"
                        value={
                            dashboard?.totalChequeBookRequests ?? 0
                        }
                        icon="bi-journal-text"
                        path="/admin/cheque-book"
                    />

                    <StatCard
                        title="Total Admins"
                        value={
                            dashboard?.totalAdmins ?? 0
                        }
                        icon="bi-shield-lock-fill"
                    />

                </div>

            </DashboardSection>


            {/* =================================================
               ANALYTICS
            ================================================= */}

            <section className="admin-dashboard-section">

                <div className="admin-dashboard-section-header">

                    <div>

                        <h3>
                            Banking Analytics
                        </h3>

                        <span>
                            Real-time banking performance and insights
                        </span>

                    </div>

                </div>


                {analyticsLoading ? (

                    <div className="admin-analytics-loading-card">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <span>
                            Loading analytics...
                        </span>

                    </div>

                ) : analytics ? (

                    <>

                        {/* =================================================
                           TRANSACTION ACTIVITY + TRANSACTION TYPES
                        ================================================= */}

                        <div className="analytics-grid analytics-grid-large">


                            {/* MONTHLY TRANSACTIONS */}

                            <AnalyticsCard
                                title="Transaction Activity"
                                subtitle="Monthly transaction volume"
                                icon="bi-graph-up-arrow"
                                wide
                            >

                                <div className="analytics-chart">

                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >

                                        <AreaChart
                                            data={
                                                analytics.monthlyTransactions ||
                                                []
                                            }
                                        >

                                            <defs>

                                                <linearGradient
                                                    id="transactionGradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >

                                                    <stop
                                                        offset="0%"
                                                        stopColor="#2563eb"
                                                        stopOpacity={0.30}
                                                    />

                                                    <stop
                                                        offset="100%"
                                                        stopColor="#2563eb"
                                                        stopOpacity={0.02}
                                                    />

                                                </linearGradient>

                                            </defs>


                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                                stroke="#e8edf5"
                                            />


                                            <XAxis
                                                dataKey="month"
                                                tick={{
                                                    fill: "#64748b",
                                                    fontSize: 12
                                                }}
                                                axisLine={false}
                                                tickLine={false}
                                            />


                                            <YAxis
                                                allowDecimals={false}
                                                tick={{
                                                    fill: "#64748b",
                                                    fontSize: 12
                                                }}
                                                axisLine={false}
                                                tickLine={false}
                                            />


                                            <Tooltip
                                                contentStyle={{
                                                    border: "1px solid #e2e8f0",
                                                    borderRadius: "12px",
                                                    boxShadow:
                                                        "0 10px 30px rgba(15,23,42,0.10)"
                                                }}
                                            />


                                            <Area
                                                type="monotone"
                                                dataKey="totalTransactions"
                                                stroke="#2563eb"
                                                strokeWidth={3}
                                                fill="url(#transactionGradient)"
                                                activeDot={{
                                                    r: 6
                                                }}
                                            />

                                        </AreaChart>

                                    </ResponsiveContainer>

                                </div>

                            </AnalyticsCard>


                            {/* TRANSACTION TYPES */}

                            <AnalyticsCard
                                title="Transaction Types"
                                subtitle="Transaction distribution"
                                icon="bi-pie-chart-fill"
                            >

                                <div className="analytics-chart">

                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >

                                        <PieChart>

                                            <Pie
                                                data={
                                                    analytics.transactionTypes ||
                                                    []
                                                }
                                                dataKey="count"
                                                nameKey="type"
                                                cx="50%"
                                                cy="45%"
                                                outerRadius={95}
                                                innerRadius={55}
                                                paddingAngle={4}
                                            >

                                                {(
                                                    analytics.transactionTypes ||
                                                    []
                                                ).map(
                                                    (_, index) => (

                                                        <Cell
                                                            key={`transaction-${index}`}
                                                            fill={
                                                                PIE_COLORS[
                                                                    index %
                                                                    PIE_COLORS.length
                                                                ]
                                                            }
                                                        />

                                                    )
                                                )}

                                            </Pie>


                                            <Tooltip
                                                contentStyle={{
                                                    border: "1px solid #e2e8f0",
                                                    borderRadius: "12px",
                                                    boxShadow:
                                                        "0 10px 30px rgba(15,23,42,0.10)"
                                                }}
                                            />


                                            <Legend
                                                verticalAlign="bottom"
                                                height={36}
                                                iconType="circle"
                                            />

                                        </PieChart>

                                    </ResponsiveContainer>

                                </div>

                            </AnalyticsCard>

                        </div>


                        {/* =================================================
                           LOANS + DEPOSITS
                        ================================================= */}

                        <div className="analytics-grid">


                            {/* LOAN STATUS */}

                            <AnalyticsCard
                                title="Loan Portfolio"
                                subtitle="Loan application status"
                                icon="bi-bank"
                            >

                                <div className="analytics-chart">

                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >

                                        <BarChart
                                            data={
                                                analytics.loanStatus ||
                                                []
                                            }
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: -20,
                                                bottom: 5
                                            }}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                                stroke="#e8edf5"
                                            />


                                            <XAxis
                                                dataKey="status"
                                                tick={{
                                                    fill: "#64748b",
                                                    fontSize: 11
                                                }}
                                                axisLine={false}
                                                tickLine={false}
                                            />


                                            <YAxis
                                                allowDecimals={false}
                                                tick={{
                                                    fill: "#64748b",
                                                    fontSize: 11
                                                }}
                                                axisLine={false}
                                                tickLine={false}
                                            />


                                            <Tooltip
                                                contentStyle={{
                                                    border: "1px solid #e2e8f0",
                                                    borderRadius: "12px"
                                                }}
                                            />


                                            <Bar
                                                dataKey="count"
                                                fill="#2563eb"
                                                radius={[
                                                    6,
                                                    6,
                                                    0,
                                                    0
                                                ]}
                                                barSize={35}
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                </div>

                            </AnalyticsCard>


                            {/* FIXED DEPOSITS */}

                            <AnalyticsCard
                                title="Fixed Deposits"
                                subtitle="Fixed deposit status"
                                icon="bi-safe-fill"
                            >

                                <DepositChart
                                    data={
                                        analytics.fixedDepositStatus ||
                                        []
                                    }
                                />

                            </AnalyticsCard>


                            {/* RECURRING DEPOSITS */}

                            <AnalyticsCard
                                title="Recurring Deposits"
                                subtitle="Recurring deposit status"
                                icon="bi-piggy-bank-fill"
                            >

                                <DepositChart
                                    data={
                                        analytics.recurringDepositStatus ||
                                        []
                                    }
                                />

                            </AnalyticsCard>

                        </div>


                        {/* =================================================
                           TOP CUSTOMERS
                        ================================================= */}

                        <AnalyticsCard
                            title="Top Customers"
                            subtitle="Customers ranked by account balance"
                            icon="bi-trophy-fill"
                        >

                            <div className="top-customers-table-wrapper">

                                <table className="top-customers-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                #
                                            </th>

                                            <th>
                                                Customer
                                            </th>

                                            <th>
                                                Account Number
                                            </th>

                                            <th className="amount-column">
                                                Balance
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {(
                                            analytics.topCustomers ||
                                            []
                                        ).length > 0 ? (

                                            analytics.topCustomers.map(
                                                (
                                                    customer,
                                                    index
                                                ) => (

                                                    <tr
                                                        key={`${customer.accountNumber}-${index}`}
                                                    >

                                                        <td>

                                                            <div className="customer-rank">

                                                                {index + 1}

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <div className="top-customer-name">

                                                                <div className="top-customer-avatar">

                                                                    {
                                                                        getInitials(
                                                                            customer.fullName
                                                                        )
                                                                    }

                                                                </div>


                                                                <div>

                                                                    <strong>
                                                                        {
                                                                            customer.fullName
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                        Premium Customer
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <span className="customer-account-number">

                                                                {
                                                                    customer.accountNumber ||
                                                                    "Not Assigned"
                                                                }

                                                            </span>

                                                        </td>


                                                        <td className="amount-column">

                                                            <strong className="customer-balance">

                                                                ₹{" "}

                                                                {
                                                                    formatAmount(
                                                                        customer.balance
                                                                    )
                                                                }

                                                            </strong>

                                                        </td>

                                                    </tr>

                                                )
                                            )

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan="4"
                                                    className="empty-analytics"
                                                >

                                                    No customer analytics available.

                                                </td>

                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </AnalyticsCard>

                    </>

                ) : (

                    <div className="admin-analytics-error-card">

                        <i className="bi bi-exclamation-circle"></i>

                        <div>

                            <strong>
                                Analytics unavailable
                            </strong>

                            <p>
                                Analytics data could not be loaded.
                            </p>

                        </div>

                    </div>

                )}

            </section>


        </div>

    );

}


/* =========================================================
   DASHBOARD SECTION
========================================================= */

function DashboardSection({
    title,
    subtitle,
    children
}) {

    return (

        <section className="admin-dashboard-section">

            <div className="admin-dashboard-section-header">

                <div>

                    <h3>
                        {title}
                    </h3>

                    <span>
                        {subtitle}
                    </span>

                </div>

            </div>


            {children}

        </section>

    );

}


/* =========================================================
   ANALYTICS CARD
========================================================= */

function AnalyticsCard({
    title,
    subtitle,
    icon,
    children,
    wide = false
}) {

    return (

        <div
            className={`analytics-card ${
                wide
                    ? "analytics-card-wide"
                    : ""
            }`}
        >

            <div className="analytics-card-header">

                <div>

                    <div className="analytics-card-title">

                        <div className="analytics-card-icon">

                            <i className={`bi ${icon}`}></i>

                        </div>

                        <h4>
                            {title}
                        </h4>

                    </div>

                    <p>
                        {subtitle}
                    </p>

                </div>

            </div>


            {children}

        </div>

    );

}


/* =========================================================
   DEPOSIT CHART
========================================================= */

function DepositChart({
    data
}) {

    return (

        <div className="analytics-chart">

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{
                        top: 5,
                        right: 20,
                        left: 15,
                        bottom: 5
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="#e8edf5"
                    />


                    <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{
                            fill: "#64748b",
                            fontSize: 11
                        }}
                        axisLine={false}
                        tickLine={false}
                    />


                    <YAxis
                        type="category"
                        dataKey="status"
                        width={75}
                        tick={{
                            fill: "#64748b",
                            fontSize: 11
                        }}
                        axisLine={false}
                        tickLine={false}
                    />


                    <Tooltip
                        contentStyle={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px"
                        }}
                    />


                    <Bar
                        dataKey="count"
                        fill="#2563eb"
                        radius={[
                            0,
                            6,
                            6,
                            0
                        ]}
                        barSize={24}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
    title,
    value,
    icon,
    path
}) {

    const navigate = useNavigate();

    const clickable = Boolean(path);


    const handleClick = () => {

        if (path) {

            navigate(path);

        }

    };


    return (

        <button
            type="button"
            className={`admin-stat-card ${
                clickable
                    ? "admin-stat-card-clickable"
                    : ""
            }`}
            onClick={handleClick}
        >

            <div className="admin-stat-content">

                <span className="admin-stat-title">
                    {title}
                </span>


                <strong className="admin-stat-value">
                    {value}
                </strong>

            </div>


            <div className="admin-stat-icon">

                <i
                    className={`bi ${icon}`}
                ></i>

            </div>

        </button>

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
            maximumFractionDigits: 2,
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


/* =========================================================
   CHART COLORS
========================================================= */

const PIE_COLORS = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
];


export default AdminDashboard;