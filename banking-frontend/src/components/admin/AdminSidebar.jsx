import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
    FaHome,
    FaUsers,
    FaIdCard,
    FaCreditCard,
    FaBook,
    FaMoneyCheckAlt,
    FaUniversity,
    FaPiggyBank,
    FaChartBar,
    FaFileAlt,
    FaSignOutAlt
} from "react-icons/fa";

import Logo from "../layout/Logo";

const menuSections = [
    {
        title: null,
        items: [
            {
                label: "Dashboard",
                icon: FaHome,
                path: "/admin/dashboard"
            }
        ]
    },

    {
        title: "MANAGEMENT",
        items: [
            {
                label: "Customers",
                icon: FaUsers,
                path: "/admin/customers"
            },
            {
                label: "KYC Management",
                icon: FaIdCard,
                path: "/admin/kyc"
            },
            {
                label: "ATM Cards",
                icon: FaCreditCard,
                path: "/admin/atm-cards"
            },
            {
                label: "Cheque Book",
                icon: FaBook,
                path: "/admin/cheque-book"
            }
        ]
    },

    {
        title: "FINANCE",
        items: [
            {
                label: "Loans",
                icon: FaMoneyCheckAlt,
                path: "/admin/loans"
            },
            {
                label: "Fixed Deposits",
                icon: FaUniversity,
                path: "/admin/fixed-deposits"
            },
            {
                label: "Recurring Deposits",
                icon: FaPiggyBank,
                path: "/admin/recurring-deposits"
            }
        ]
    },

    {
        title: "REPORTS",
        items: [
            {
                label: "Analytics",
                icon: FaChartBar,
                path: "/admin/analytics"
            },
            {
                label: "Reports",
                icon: FaFileAlt,
                path: "/admin/reports"
            }
        ]
    }
];

function AdminSidebar({ mobileOpen, onClose }) {

    const navigate = useNavigate();
    const location = useLocation();

    const { logout } = useAuth();

    const handleNavigation = (path) => {
        navigate(path);

        if (onClose) {
            onClose();
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    return (
        <>
            {mobileOpen && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <aside
                className={`admin-sidebar ${
                    mobileOpen
                        ? "admin-sidebar-mobile-open"
                        : ""
                }`}
            >

                {/* ==============================
                    BRAND
                ============================== */}

                <div className="admin-sidebar-brand">
                    <Logo />

                    <button
                        type="button"
                        className="admin-sidebar-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>


                {/* ==============================
                    NAVIGATION
                ============================== */}

                <nav className="admin-sidebar-menu">

                    {menuSections.map((section, index) => (

                        <div
                            className="admin-sidebar-section"
                            key={index}
                        >

                            {section.title && (
                                <div className="admin-sidebar-section-title">
                                    {section.title}
                                </div>
                            )}

                            {section.items.map((item) => {

                                const Icon = item.icon;

                                const active =
                                    location.pathname === item.path;

                                return (
                                    <button
                                        key={item.path}
                                        type="button"
                                        className={`admin-sidebar-item ${
                                            active
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleNavigation(
                                                item.path
                                            )
                                        }
                                    >

                                        <Icon />

                                        <span>
                                            {item.label}
                                        </span>

                                    </button>
                                );

                            })}

                        </div>

                    ))}

                </nav>


                {/* ==============================
                    LOGOUT
                ============================== */}

                <div className="admin-sidebar-footer">

                    <button
                        type="button"
                        className="admin-sidebar-logout"
                        onClick={handleLogout}
                    >

                        <FaSignOutAlt />

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </aside>
        </>
    );
}

export default AdminSidebar;