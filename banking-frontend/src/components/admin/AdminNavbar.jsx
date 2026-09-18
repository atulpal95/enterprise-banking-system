import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    FaBell,
    FaCog,
    FaSearch,
    FaBars,
    FaUserShield,
    FaSignOutAlt,
    FaUser
} from "react-icons/fa";

import { getAdminProfile } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/admin-navbar.css"

const pageInfo = {

    "/admin/dashboard": {
        title: "Admin Dashboard",
        subtitle: "Overview of your banking operations"
    },

    "/admin/customers": {
        title: "Customer Management",
        subtitle: "Manage and monitor bank customers"
    },

    "/admin/kyc": {
        title: "KYC Management",
        subtitle: "Review and manage customer KYC applications"
    },

    "/admin/atm-cards": {
        title: "ATM Card Management",
        subtitle: "Manage ATM card requests and services"
    },

    "/admin/cheque-book": {
        title: "Cheque Book Management",
        subtitle: "Manage cheque book requests"
    },

    "/admin/loans": {
        title: "Loan Management",
        subtitle: "Manage customer loan applications"
    },

    "/admin/fixed-deposits": {
        title: "Fixed Deposit Management",
        subtitle: "Manage fixed deposit services"
    },

    "/admin/recurring-deposits": {
        title: "Recurring Deposit Management",
        subtitle: "Manage recurring deposit services"
    },

    "/admin/analytics": {
        title: "Analytics",
        subtitle: "Analyze banking performance"
    },

    "/admin/reports": {
        title: "Reports",
        subtitle: "Generate and download banking reports"
    },

    "/admin/profile": {
        title: "Admin Profile",
        subtitle: "Manage your administrator profile and security"
    }

};

function AdminNavbar({ onMenuClick }) {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        user,
        logout,
        updateUser
    } = useAuth();

    const [search, setSearch] = useState("");
    const [showProfile, setShowProfile] = useState(false);


    // =====================================================
    // LOAD ADMIN PROFILE
    // =====================================================

    useEffect(() => {

        const loadAdminProfile = async () => {

            try {

                const response = await getAdminProfile();

                const adminProfile = response.data;

                if (adminProfile) {

                    updateUser({
                        fullName: adminProfile.fullName,
                        email: adminProfile.email,
                        role: adminProfile.role,
                        profilePictureUrl:
                            adminProfile.profilePictureUrl || ""
                    });

                }

            } catch (error) {

                console.error(
                    "Unable to load admin profile:",
                    error
                );

            }

        };

        if (
            user?.token ||
            localStorage.getItem("token")
        ) {
            loadAdminProfile();
        }

    }, []);


    const currentPage =
        pageInfo[location.pathname] ||
        pageInfo["/admin/dashboard"];


    // =====================================================
    // SEARCHABLE PAGES
    // =====================================================

    const searchablePages = {

        dashboard: "/admin/dashboard",

        customers: "/admin/customers",
        customer: "/admin/customers",

        kyc: "/admin/kyc",

        atm: "/admin/atm-cards",
        "atm cards": "/admin/atm-cards",

        cheque: "/admin/cheque-book",
        "cheque book": "/admin/cheque-book",

        loan: "/admin/loans",
        loans: "/admin/loans",

        fd: "/admin/fixed-deposits",
        "fixed deposit": "/admin/fixed-deposits",

        rd: "/admin/recurring-deposits",
        "recurring deposit": "/admin/recurring-deposits",

        analytics: "/admin/analytics",

        reports: "/admin/reports"

    };


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = (event) => {

        if (event.key !== "Enter") {
            return;
        }

        const keyword =
            search.trim().toLowerCase();

        if (!keyword) {
            return;
        }

        const target =
            searchablePages[keyword];

        if (target) {

            navigate(target);
            setSearch("");

        } else {

            setSearch("");

        }

    };


    // =====================================================
    // MY PROFILE
    // =====================================================

    const handleMyProfile = () => {

        setShowProfile(false);

        navigate("/admin/profile");

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        setShowProfile(false);

        logout();

        navigate("/admin/login");

    };


    // =====================================================
    // PROFILE PICTURE
    // =====================================================

    const profilePicture =
        user?.profilePictureUrl || "";


    const adminName =
        user?.fullName ||
        user?.name ||
        "Super Admin";


    return (

        <header className="admin-navbar">


            {/* =================================================
                MOBILE / TABLET HEADER
            ================================================= */}

            <div className="admin-mobile-navbar">

                {/* MENU */}

                <button
                    type="button"
                    className="admin-mobile-menu-button"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                >
                    <FaBars />
                </button>


                {/* BRAND */}

                <div className="admin-mobile-brand">

                    <span className="admin-mobile-bank-icon">
                        🏦
                    </span>

                    <div>

                        <strong>
                            PAL Bank
                        </strong>

                        <small>
                            Admin Panel
                        </small>

                    </div>

                </div>


                {/* MOBILE PROFILE BUTTON */}

                <button
                    type="button"
                    className="admin-mobile-profile"
                    onClick={() =>
                        setShowProfile((previous) => !previous)
                    }
                    aria-label="Admin profile"
                    aria-expanded={showProfile}
                >

                    {profilePicture ? (

                        <img
                            src={profilePicture}
                            alt="Admin Profile"
                            className="admin-navbar-profile-image mobile"
                        />

                    ) : (

                        <FaUserShield />

                    )}

                </button>


                {/* =================================================
                    MOBILE PROFILE DROPDOWN
                ================================================= */}

                {showProfile && (

                    <div className="admin-mobile-profile-dropdown">


                        {/* PROFILE HEADER */}

                        <div className="admin-mobile-dropdown-header">

                            <div className="admin-mobile-dropdown-avatar">

                                {profilePicture ? (

                                    <img
                                        src={profilePicture}
                                        alt="Admin Profile"
                                        className="admin-navbar-profile-image"
                                    />

                                ) : (

                                    <FaUserShield />

                                )}

                            </div>


                            <div className="admin-mobile-dropdown-info">

                                <strong>
                                    {adminName}
                                </strong>

                                <span>
                                    Administrator
                                </span>

                            </div>

                        </div>


                        {/* MY PROFILE */}

                        <button
                            type="button"
                            onClick={handleMyProfile}
                        >

                            <FaUser />

                            <span>
                                My Profile
                            </span>

                        </button>


                        {/* LOGOUT */}

                        <button
                            type="button"
                            onClick={handleLogout}
                        >

                            <FaSignOutAlt />

                            <span>
                                Logout
                            </span>

                        </button>

                    </div>

                )}

            </div>


            {/* =================================================
                DESKTOP PAGE HEADING
            ================================================= */}

            <div className="admin-navbar-heading">

                <h1>
                    {currentPage.title}
                </h1>

                <p>
                    {currentPage.subtitle}
                </p>

            </div>


            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="admin-navbar-search">

                <FaSearch />

                <input
                    type="text"
                    placeholder="Search customers, KYC, loans..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    onKeyDown={handleSearch}
                />

            </div>


            {/* =================================================
                DESKTOP RIGHT SIDE
            ================================================= */}

            <div className="admin-navbar-right">


                {/* NOTIFICATIONS */}

                <button
                    type="button"
                    className="admin-navbar-icon"
                    title="Notifications"
                >

                    <FaBell />

                    <span className="admin-notification-dot" />

                </button>


                {/* SETTINGS */}

                <button
                    type="button"
                    className="admin-navbar-icon"
                    title="Settings"
                >

                    <FaCog />

                </button>


                {/* =================================================
                    DESKTOP PROFILE
                ================================================= */}

                <div className="admin-navbar-profile">

                    <button
                        type="button"
                        className="admin-profile-trigger"
                        onClick={() =>
                            setShowProfile((previous) => !previous)
                        }
                    >

                        <div className="admin-profile-avatar">

                            {profilePicture ? (

                                <img
                                    src={profilePicture}
                                    alt="Admin Profile"
                                    className="admin-navbar-profile-image"
                                />

                            ) : (

                                <FaUserShield />

                            )}

                        </div>


                        <div className="admin-profile-info">

                            <strong>
                                {adminName}
                            </strong>

                            <span>
                                Administrator
                            </span>

                        </div>

                    </button>


                    {/* DESKTOP DROPDOWN */}

                    {showProfile && (

                        <div className="admin-profile-dropdown">

                            <div className="admin-dropdown-heading">

                                <div className="admin-dropdown-profile">

                                    <div className="admin-dropdown-avatar">

                                        {profilePicture ? (

                                            <img
                                                src={profilePicture}
                                                alt="Admin Profile"
                                                className="admin-navbar-profile-image"
                                            />

                                        ) : (

                                            <FaUserShield />

                                        )}

                                    </div>

                                    <div>

                                        <strong>
                                            {adminName}
                                        </strong>

                                        <span>
                                            Administrator
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* MY PROFILE */}

                            <button
                                type="button"
                                onClick={handleMyProfile}
                            >

                                <FaUser />

                                My Profile

                            </button>


                            {/* LOGOUT */}

                            <button
                                type="button"
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

export default AdminNavbar;