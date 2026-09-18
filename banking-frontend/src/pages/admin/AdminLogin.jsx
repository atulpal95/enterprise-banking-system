import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { adminLogin } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";

import InputField from "../../components/common/InputField";
import PrimaryButton from "../../components/common/PrimaryButton";

import "../../assets/styles/auth.css";

function AdminLogin() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);

    const [mobileLoginMode, setMobileLoginMode] = useState(false);

    const navigate = useNavigate();

    const { login } = useAuth();


    const onSubmit = async (data) => {

        try {

            setLoading(true);

            const response = await adminLogin(data);

            const adminData = {

                token: response.data.token,

                fullName: response.data.fullName,

                role: "ROLE_ADMIN",

                message: response.data.message,

                userType: "ADMIN",

            };

            login(adminData);

            toast.success(
                response.data.message ||
                "Admin login successful."
            );

            navigate("/admin/dashboard");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Admin login failed."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="auth-page">

            {/* =====================================================
               NAVBAR
            ===================================================== */}

            <nav className="auth-navbar">

                <Link
                    to="/"
                    className="auth-brand"
                >

                    <div className="auth-brand-logo">
                        PEB
                    </div>

                    <div className="auth-brand-text">

                        <span className="auth-brand-name">
                            PAL Enterprise Bank
                        </span>

                        <span className="auth-brand-tagline">
                            Secure • Smart • Trusted
                        </span>

                    </div>

                </Link>


                <div className="auth-navbar-actions">

                    <Link
                        to="/"
                        className="auth-nav-button"
                    >
                        <i className="bi bi-person-fill me-1"></i>
                        Customer Login
                    </Link>

                </div>

            </nav>


            {/* =====================================================
               MAIN
            ===================================================== */}

            <main
                className={
                 mobileLoginMode
                 ? "auth-main mobile-login-mode"
                 : "auth-main"
                 }
                >


                {/* =================================================
                   ADMIN ABOUT SECTION
                ================================================= */}

                <section className="auth-about">

                    <div className="auth-about-content">

                        <div className="auth-logo-large">
                            PEB
                        </div>

                        <h1>
                            PAL
                            <span>
                                Enterprise Bank
                            </span>
                        </h1>

                        <p className="auth-about-tagline">
                            Secure • Smart • Trusted
                        </p>

                        <div className="auth-about-line"></div>

                        <p className="auth-about-description">

                            A secure administration platform designed
                            to help authorized banking administrators
                            manage customers, accounts, transactions
                            and banking services efficiently.

                        </p>


                        <div className="auth-features">


                            <div className="auth-feature">

                                <div className="auth-feature-icon">
                                    <i className="bi bi-shield-lock-fill"></i>
                                </div>

                                <div>

                                    <h3>
                                        Secure Access
                                    </h3>

                                    <p>
                                        Protected access for
                                        authorized administrators.
                                    </p>

                                </div>

                            </div>


                            <div className="auth-feature">

                                <div className="auth-feature-icon">
                                    <i className="bi bi-speedometer2"></i>
                                </div>

                                <div>

                                    <h3>
                                        Smart Management
                                    </h3>

                                    <p>
                                        Manage banking operations
                                        from one platform.
                                    </p>

                                </div>

                            </div>


                            <div className="auth-feature">

                                <div className="auth-feature-icon">
                                    <i className="bi bi-graph-up-arrow"></i>
                                </div>

                                <div>

                                    <h3>
                                        Banking Insights
                                    </h3>

                                    <p>
                                        Monitor important banking
                                        information efficiently.
                                    </p>

                                </div>

                            </div>

                                               </div>


                        {/* MOBILE ADMIN LOGIN BUTTON */}
                        <button
                            type="button"
                            className="mobile-login-button"
                            onClick={() => setMobileLoginMode(true)}
                        >
                            <i className="bi bi-shield-lock-fill"></i>

                            <span>
                                Admin Login
                            </span>

                            <i className="bi bi-arrow-right"></i>
                        </button>


                    </div>
                </section>

                {/* =================================================
                   ADMIN LOGIN CARD
                ================================================= */}

                <section className="auth-card">


                    <div className="auth-card-header">

                        <div className="auth-admin-badge">

                            <i className="bi bi-shield-lock-fill"></i>

                            Administrator Access

                        </div>

                        <h2>
                            Admin Login 🔐
                        </h2>

                        <p>
                            Sign in to securely manage
                            PAL Enterprise Bank.
                        </p>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >


                        <InputField
                            label="Admin Email Address"
                            type="email"
                            placeholder="Enter admin email"
                            icon="bi-envelope-fill"
                            {...register("email", {
                                required:
                                    "Admin email is required",

                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message:
                                        "Enter a valid email",
                                },
                            })}
                        />

                        {errors.email && (
                            <small className="text-danger">
                                {errors.email.message}
                            </small>
                        )}


                        <InputField
                            label="Password"
                            type="password"
                            placeholder="Enter admin password"
                            icon="bi-lock-fill"
                            {...register("password", {
                                required:
                                    "Password is required",

                                minLength: {
                                    value: 6,
                                    message:
                                        "Minimum 6 characters",
                                },
                            })}
                        />

                        {errors.password && (
                            <small className="text-danger">
                                {errors.password.message}
                            </small>
                        )}


                        <div className="auth-options">

                            <label className="auth-remember">

                                <input
                                    type="checkbox"
                                    id="rememberAdmin"
                                />

                                <span>
                                    Remember Me
                                </span>

                            </label>

                            <Link
                                to="/admin/forgot-password"
                                className="auth-forgot"
                            >
                                Forgot Password?
                            </Link>

                        </div>


                        <PrimaryButton
                            type="submit"
                            text="Admin Login"
                            loading={loading}
                        />

                    </form>


                    <div className="auth-divider">
                        <span>OR</span>
                    </div>


                    <div className="auth-secondary">


                        <div>
                            Don't have an admin account?
                        </div>

                        <div className="auth-secondary-row">

                            <Link to="/admin/register">
                                Create Admin Account
                            </Link>

                        </div>


                        <div className="auth-secondary-row">

                            <span>
                                Are you a customer?{" "}
                            </span>

                            <Link to="/">
                                Customer Login
                            </Link>

                        </div>

                    </div>

                </section>

            </main>


            {/* =====================================================
               FOOTER
            ===================================================== */}

            <footer className="auth-footer">

                © 2026 PAL Enterprise Bank. All rights reserved.

            </footer>

        </div>

    );
}

export default AdminLogin;