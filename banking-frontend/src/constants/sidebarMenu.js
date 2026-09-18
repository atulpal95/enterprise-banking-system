import {
    FaHome,
    FaExchangeAlt,
    FaMoneyBillWave,
    FaHandHoldingUsd,
    FaUsers,
    FaCreditCard,
    FaBook,
    FaUniversity,
    FaPiggyBank,
    FaHistory,
    FaFileInvoice,
    FaUserCircle,
    FaSignOutAlt
} from "react-icons/fa";

const sidebarMenu = [
    {
        title: "Dashboard",
        icon: FaHome,
        path: "/customer/dashboard"
    },

    {
        section: "BANKING"
    },

    {
        title: "Transfer",
        icon: FaExchangeAlt,
        path: "/customer/transfer"
    },

    {
        title: "Deposit",
        icon: FaMoneyBillWave,
        path: "/customer/deposit"
    },

    {
        title: "Withdraw",
        icon: FaHandHoldingUsd,
        path: "/customer/withdraw"
    },

    {
        title: "Beneficiary",
        icon: FaUsers,
        path: "/customer/beneficiary"
    },

    {
        section: "SERVICES"
    },

    {
        title: "ATM Card",
        icon: FaCreditCard,
        path: "/customer/atm-card"
    },

    {
        title: "Cheque Book",
        icon: FaBook,
        path: "/customer/cheque-book"
    },

    {
        title: "Loan",
        icon: FaUniversity,
        path: "/customer/loan"
    },

    {
        title: "EMI",
        icon: FaMoneyBillWave,
        path: "/customer/emi"
    },


    {
        title: "Fixed Deposit",
        icon: FaPiggyBank,
        path: "/customer/fixed-deposit"
    },

    {
        title: "Recurring Deposit",
        icon: FaPiggyBank,
        path: "/customer/recurring-deposit"
    },

    {
        section: "RECORDS"
    },

    {
        title: "Transactions",
        icon: FaHistory,
        path: "/customer/transactions"
    },

    {
        title: "Statement",
        icon: FaFileInvoice,
        path: "/customer/statement"
    },

    {
        section: "ACCOUNT"
    },

    {
        title: "Profile",
        icon: FaUserCircle,
        path: "/customer/profile"
    },

    {
        section: "SYSTEM"
    },

    {
        title: "Logout",
        icon: FaSignOutAlt,
        path: "/logout",
        logout: true
    }
];

export default sidebarMenu;