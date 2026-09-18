import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    FaBell,
    FaCog,
    FaSearch,
    FaSignOutAlt,
    FaUserCircle,
    FaBars,
    FaUniversity
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import pageTitles from "../../constants/pageTitles";
import customerService from "../../services/customerService";

function Navbar({ onMenuClick }) {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        user,
        logout,
        setUser
    } = useAuth();

    const [showMenu, setShowMenu] = useState(false);

    const [search, setSearch] = useState("");

    const currentPage =
        pageTitles[location.pathname] || {
            title: "Dashboard",
            subtitle: "Welcome to PAL Bank"
        };

    const searchablePages = useMemo(() => ({

        dashboard: "/customer/dashboard",

        profile: "/customer/profile",

        transfer: "/customer/transfer",

        deposit: "/customer/deposit",

        withdraw: "/customer/withdraw",

        beneficiary: "/customer/beneficiary",

        atm: "/customer/atm-card",

        "atm card": "/customer/atm-card",

        cheque: "/customer/cheque-book",

        "cheque book": "/customer/cheque-book",

        loan: "/customer/loan",

        fd: "/customer/fixed-deposit",

        "fixed deposit": "/customer/fixed-deposit",

        rd: "/customer/recurring-deposit",

        "recurring deposit":
            "/customer/recurring-deposit",

        transactions:
            "/customer/transactions",

        transaction:
            "/customer/transactions",

        statement:
            "/customer/statement"

    }), []);

    const handleLogout = () => {

        logout();

        navigate("/");

    };

    const loadProfile = async () => {

        try {

            const response =
                await customerService.getProfile();

            setUser(prev => ({
                ...prev,
                ...response.data
            }));

        } catch (error) {

            console.error(
                "Unable to load profile:",
                error
            );

        }

    };

    useEffect(() => {

        loadProfile();

    }, []);

    const handleSearch = (e) => {

        if (e.key !== "Enter") return;

        const keyword =
            search.trim().toLowerCase();

        if (!keyword) return;

        const page =
            searchablePages[keyword];

        if (page) {

            navigate(page);

            setSearch("");

        } else {

            alert("No page found.");

        }

    };

    return (

        <header className="navbar">

            {/* =====================================
                MOBILE TOP BAR
            ====================================== */}

            <div className="mobile-navbar">

                <button
                    className="mobile-menu-btn"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                >
                    <FaBars />
                </button>

                <div className="mobile-bank-logo">

                    <FaUniversity />

                    <span>
                        PAL Bank
                    </span>

                </div>

                <button
                    className="mobile-profile-btn"
                    onClick={() =>
                        navigate("/customer/profile")
                    }
                >

                    {user?.profilePictureUrl ? (

                        <img
                            src={
                                user.profilePictureUrl
                            }
                            alt="Profile"
                        />

                    ) : (

                        <FaUserCircle />

                    )}

                </button>

            </div>


            {/* =====================================
                DESKTOP PAGE TITLE
            ====================================== */}

            <div className="navbar-left desktop-only">

                <div className="page-heading">

                    <h2>
                        {currentPage.title}
                    </h2>

                    <p>
                        {currentPage.subtitle}
                    </p>

                </div>

            </div>


            {/* =====================================
                SEARCH
            ====================================== */}

            <div className="navbar-search">

                <FaSearch className="search-icon" />

                <input
                    type="text"
                    placeholder="Search Dashboard, Deposit, Transfer..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    onKeyDown={handleSearch}
                />

            </div>


            {/* =====================================
                RIGHT SIDE
            ====================================== */}

            <div className="navbar-right">

                {/* Notifications */}

                <button
                    className="icon-btn"
                    title="Notifications"
                >
                    <FaBell />
                </button>


                {/* Settings */}

                <button
                    className="icon-btn"
                    title="Settings"
                    onClick={() =>
                        navigate("/customer/profile")
                    }
                >
                    <FaCog />
                </button>


                {/* Profile */}

                <div className="profile-menu">

                    <div
                        className="profile-trigger"
                        onClick={() =>
                            setShowMenu(!showMenu)
                        }
                    >

                        {user?.profilePictureUrl ? (

                            <img
                                src={
                                    user.profilePictureUrl
                                }
                                alt="Profile"
                                className="navbar-profile-avatar"
                            />

                        ) : (

                            <FaUserCircle
                                className="navbar-profile-avatar-icon"
                            />

                        )}

                        <div className="profile-info">

                            <strong>
                                {
                                    user?.fullName ||
                                    "Customer"
                                }
                            </strong>

                            <small>
                                Customer
                            </small>

                        </div>

                    </div>


                    {/* Profile Dropdown */}

                    {showMenu && (

                        <div className="dropdown-menu">

                            <button
                                onClick={() =>
                                    navigate(
                                        "/customer/profile"
                                    )
                                }
                            >
                                Profile
                            </button>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/customer/settings"
                                    )
                                }
                            >
                                Settings
                            </button>

                            <button
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt />

                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>

    );
}

export default Navbar;