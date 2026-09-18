import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { resetAdminPassword } from "../../api/adminApi";

import "../../assets/styles/auth.css";

function AdminResetPassword() {

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);

    const email = queryParams.get("email") || "";
    const otp = queryParams.get("otp") || "";


    // =====================================================
    // RESET ADMIN PASSWORD
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!email) {

            toast.error(
                "Admin email is missing."
            );

            return;
        }

        if (!otp) {

            toast.error(
                "OTP is missing. Please verify OTP again."
            );

            navigate(
                `/admin/forgot-password`
            );

            return;
        }

        if (!newPassword) {

            toast.error(
                "New password is required."
            );

            return;
        }

        if (!confirmPassword) {

            toast.error(
                "Confirm password is required."
            );

            return;
        }

        if (newPassword.length < 6) {

            toast.error(
                "Password must be at least 6 characters."
            );

            return;
        }

        if (newPassword !== confirmPassword) {

            toast.error(
                "New password and confirm password do not match."
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await resetAdminPassword({
                    email,
                    otp,
                    newPassword,
                    confirmPassword,
                });

            toast.success(
                response.data?.message ||
                "Admin password reset successfully."
            );

            // Go back to Admin Login
            setTimeout(() => {

                navigate("/admin/login");

            }, 1000);

        } catch (error) {

            console.error(
                "Admin password reset error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Unable to reset admin password."
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
                   LEFT SECTION
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
                            Create a new secure password for your
                            administrator account.
                        </p>


                        <div className="auth-features">

                            <div className="auth-feature">

                                <div className="auth-feature-icon">
                                    <i className="bi bi-shield-check"></i>
                                </div>

                                <div>

                                    <h3>
                                        Secure Password
                                    </h3>

                                    <p>
                                        Your new password is securely
                                        encrypted before storage.
                                    </p>

                                </div>

                            </div>


                            <div className="auth-feature">

                                <div className="auth-feature-icon">
                                    <i className="bi bi-key-fill"></i>
                                </div>

                                <div>

                                    <h3>
                                        Minimum 6 Characters
                                    </h3>

                                    <p>
                                        Choose a strong password with
                                        at least six characters.
                                    </p>

                                </div>

                            </div>


                            <div className="auth-feature">

                                <div className="auth-feature-icon">
                                    <i className="bi bi-check-circle-fill"></i>
                                </div>

                                <div>

                                    <h3>
                                        Secure Recovery
                                    </h3>

                                    <p>
                                        Once completed, you can log in
                                        using your new password.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                   RESET PASSWORD CARD
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
                                <i className="bi bi-lock-fill"></i>
                            </div>

                            <h2>
                                Reset Password
                            </h2>

                            <p className="text-muted">

                                Create a new password for

                                <br />

                                <strong>
                                    {email || "your admin account"}
                                </strong>

                            </p>

                        </div>


                        <form onSubmit={handleSubmit}>

                            {/* =================================================
                               NEW PASSWORD
                            ================================================= */}

                            <div className="mb-3">

                                <label
                                    htmlFor="newPassword"
                                    className="form-label fw-semibold"
                                >
                                    New Password
                                </label>

                                <div className="input-group">

                                    <span className="input-group-text">
                                        <i className="bi bi-lock-fill"></i>
                                    </span>

                                    <input
                                        id="newPassword"
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className="form-control"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(event) =>
                                            setNewPassword(
                                                event.target.value
                                            )
                                        }
                                        autoComplete="new-password"
                                        disabled={loading}
                                    />

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                            setShowNewPassword(
                                                !showNewPassword
                                            )
                                        }
                                        disabled={loading}
                                    >
                                        <i
                                            className={
                                                showNewPassword
                                                    ? "bi bi-eye-slash-fill"
                                                    : "bi bi-eye-fill"
                                            }
                                        ></i>
                                    </button>

                                </div>

                            </div>


                            {/* =================================================
                               CONFIRM PASSWORD
                            ================================================= */}

                            <div className="mb-4">

                                <label
                                    htmlFor="confirmPassword"
                                    className="form-label fw-semibold"
                                >
                                    Confirm Password
                                </label>

                                <div className="input-group">

                                    <span className="input-group-text">
                                        <i className="bi bi-lock-fill"></i>
                                    </span>

                                    <input
                                        id="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className="form-control"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(event) =>
                                            setConfirmPassword(
                                                event.target.value
                                            )
                                        }
                                        autoComplete="new-password"
                                        disabled={loading}
                                    />

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        disabled={loading}
                                    >
                                        <i
                                            className={
                                                showConfirmPassword
                                                    ? "bi bi-eye-slash-fill"
                                                    : "bi bi-eye-fill"
                                            }
                                        ></i>
                                    </button>

                                </div>

                            </div>


                            {/* =================================================
                               RESET BUTTON
                            ================================================= */}

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

                                        Resetting Password...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-key-fill me-2"></i>

                                        Reset Password
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

export default AdminResetPassword;