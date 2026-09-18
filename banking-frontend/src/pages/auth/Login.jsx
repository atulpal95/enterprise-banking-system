import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { login as loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

import InputField from "../../components/common/InputField";
import PrimaryButton from "../../components/common/PrimaryButton";

import "../../assets/styles/auth.css";

function Login() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);

    /*
     * Mobile:
     * false = bank welcome screen
     * true  = login screen
     */
    const [mobileLoginMode, setMobileLoginMode] = useState(false);

    const navigate = useNavigate();

    const { login } = useAuth();


    const onSubmit = async (data) => {

        try {

            setLoading(true);

            const response = await loginApi(data);

            login(response.data);

            toast.success(response.data.message);

            navigate("/customer/dashboard");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }
    };


    const openMobileLogin = () => {
        setMobileLoginMode(true);
    };


    const closeMobileLogin = () => {
        setMobileLoginMode(false);
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
                        to="/admin/login"
                        className="auth-nav-button"
                    >

                        <i className="bi bi-shield-lock-fill me-1"></i>

                        Admin Login

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
                    BANK WELCOME / ABOUT
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
                            Experience modern digital banking designed
                            to make your everyday financial life simpler,
                            safer and more convenient.
                        </p>


                        {/* =================================================
                            FEATURES
                        ================================================= */}

                        <div className="auth-features">

                            <div className="auth-feature">

                                <div className="auth-feature-icon">
                                    <i className="bi bi-shield-check"></i>
                                </div>

                                <div>

                                    <h3>
                                        Secure Banking
                                    </h3>

                                    <p>
                                        Protection designed
                                        around your account.
                                    </p>

                                </div>

                            </div>


                            <div className="auth-feature">

                                <div className="auth-feature-icon">
                                    <i className="bi bi-lightning-charge-fill"></i>
                                </div>

                                <div>

                                    <h3>
                                        Smart Banking
                                    </h3>

                                    <p>
                                        Convenient digital
                                        banking solutions.
                                    </p>

                                </div>

                            </div>


                            <div className="auth-feature">

                                <div className="auth-feature-icon">
                                    <i className="bi bi-people-fill"></i>
                                </div>

                                <div>

                                    <h3>
                                        Trusted Partner
                                    </h3>

                                    <p>
                                        Banking built around
                                        your financial needs.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            MOBILE LOGIN BUTTON
                        ================================================= */}

                        <button
                            type="button"
                            className="mobile-login-button"
                            onClick={openMobileLogin}
                        >

                            <i className="bi bi-box-arrow-in-right"></i>

                            <span>
                                Customer Login
                            </span>

                            <i className="bi bi-arrow-right"></i>

                        </button>

                    </div>

                </section>


                {/* =================================================
                    LOGIN MODULE
                ================================================= */}

                <section className="auth-card">

                    {/* MOBILE BACK BUTTON */}

                    <button
                        type="button"
                        className="mobile-back-button"
                        onClick={closeMobileLogin}
                    >

                        <i className="bi bi-arrow-left"></i>

                        <span>
                            Back to Bank
                        </span>

                    </button>


                    <div className="auth-card-header">

                        <div className="mobile-login-icon">
                            <i className="bi bi-person-lock"></i>
                        </div>

                        <h2>
                            Welcome Back 👋
                        </h2>

                        <p>
                            Sign in to continue to your secure
                            banking account.
                        </p>

                    </div>


                    {/* =================================================
                        LOGIN FORM
                    ================================================= */}

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        {/* EMAIL */}

                        <InputField
                            label="Email Address"
                            type="email"
                            placeholder="Enter your email"
                            icon="bi-envelope-fill"
                            {...register("email", {

                                required:
                                    "Email is required",

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


                        {/* PASSWORD */}

                        <InputField
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
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


                        {/* OPTIONS */}

                        <div className="auth-options">

                            <label className="auth-remember">

                                <input
                                    type="checkbox"
                                    id="rememberCustomer"
                                />

                                <span>
                                    Remember Me
                                </span>

                            </label>


                            <Link
                                to="/forgot-password"
                                className="auth-forgot"
                            >
                                Forgot Password?
                            </Link>

                        </div>


                        {/* LOGIN */}

                        <PrimaryButton
                            type="submit"
                            text="Login"
                            loading={loading}
                        />

                    </form>


                    {/* =================================================
                        DIVIDER
                    ================================================= */}

                    <div className="auth-divider">

                        <span>
                            OR
                        </span>

                    </div>


                    {/* =================================================
                        REGISTER
                    ================================================= */}

                    <div className="auth-secondary">

                        <span>
                            New to PAL Enterprise Bank?
                        </span>

                        <div className="auth-secondary-row">

                            <Link to="/register">
                                Create Account
                            </Link>

                        </div>

                    </div>

                </section>

            </main>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="auth-footer">

                <span>
                    © 2026 PAL Enterprise Bank.
                </span>

                <span>
                    All rights reserved.
                </span>

            </footer>

        </div>
    );
}

export default Login;