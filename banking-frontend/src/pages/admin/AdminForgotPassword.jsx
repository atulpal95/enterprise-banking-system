import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { forgotAdminPassword } from "../../api/adminApi";

import "../../assets/styles/auth.css";

function AdminForgotPassword() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault();

        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail) {
            toast.error("Email address is required.");
            return;
        }

        const emailPattern = /^\S+@\S+\.\S+$/;

        if (!emailPattern.test(trimmedEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        try {

            setLoading(true);

            const response =
                await forgotAdminPassword(trimmedEmail);

            toast.success(
                response.data?.message ||
                "OTP sent successfully to your registered email."
            );

            // Keep email for the next OTP step
            navigate(
                `/admin/verify-otp?email=${encodeURIComponent(trimmedEmail)}`
            );

        } catch (error) {

            console.error(
                "Admin forgot password error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Unable to send OTP."
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
                    to="/admin/login"
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

            <main className="auth-main">

                {/* =================================================
                   LEFT / ABOUT SECTION
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
                            Secure administrator password recovery
                            with OTP-based verification.
                        </p>


                        <div className="auth-features">

                            <div className="auth-feature">

                                <div className="auth-feature-icon">
                                    <i className="bi bi-shield-check"></i>
                                </div>

                                <div>

                                    <h3>
                                        Secure Recovery
                                    </h3>

                                    <p>
                                        Your administrator account
                                        is protected with secure
                                        password recovery.
                                    </p>

                                </div>

                            </div>


                            <div className="auth-feature">

                                <div className="auth-feature-icon">
                                    <i className="bi bi-envelope-check"></i>
                                </div>

                                <div>

                                    <h3>
                                        Email Verification
                                    </h3>

                                    <p>
                                        A verification OTP will be
                                        sent to your registered email.
                                    </p>

                                </div>

                            </div>


                            <div className="auth-feature">

                                <div className="auth-feature-icon">
                                    <i className="bi bi-clock-history"></i>
                                </div>

                                <div>

                                    <h3>
                                        5 Minute OTP
                                    </h3>

                                    <p>
                                        Your OTP remains valid for
                                        a limited time.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                   FORGOT PASSWORD CARD
                ================================================= */}

                <section className="auth-form-section">

                    <div className="auth-form-card">

                        <div className="text-center mb-4">

                            <div
                                className="auth-form-icon"
                                style={{
                                    fontSize: "42px",
                                    marginBottom: "15px",
                                }}
                            >
                                <i className="bi bi-key-fill"></i>
                            </div>

                            <h2>
                                Forgot Password?
                            </h2>

                            <p className="text-muted">
                                Enter your registered administrator
                                email address to receive an OTP.
                            </p>

                        </div>


                        <form onSubmit={handleSubmit}>

                            {/* EMAIL */}

                            <div className="mb-4">

                                <label
                                    htmlFor="adminEmail"
                                    className="form-label fw-semibold"
                                >
                                    Email Address
                                </label>

                                <div className="input-group">

                                    <span className="input-group-text">
                                        <i className="bi bi-envelope-fill"></i>
                                    </span>

                                    <input
                                        id="adminEmail"
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter registered admin email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        autoComplete="email"
                                        disabled={loading}
                                    />

                                </div>

                            </div>


                            {/* SUBMIT */}

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>

                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-send-fill me-2"></i>

                                        Send OTP
                                    </>
                                )}

                            </button>

                        </form>


                        {/* BACK TO LOGIN */}

                        <div className="text-center mt-4">

                            <Link
                                to="/admin/login"
                                className="text-decoration-none"
                            >
                                <i className="bi bi-arrow-left me-1"></i>
                                Back to Admin Login
                            </Link>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminForgotPassword;