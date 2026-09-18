import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { verifyAdminOtp } from "../../api/adminApi";

import "../../assets/styles/auth.css";

function AdminVerifyOtp() {

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);

    const inputRefs = useRef([]);

    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email") || "";


    // =====================================================
    // AUTO FOCUS FIRST OTP BOX
    // =====================================================

    useEffect(() => {

        inputRefs.current[0]?.focus();

    }, []);


    // =====================================================
    // OTP INPUT
    // =====================================================

    const handleOtpChange = (index, value) => {

        // Only allow one digit
        const digit = value.replace(/\D/g, "").slice(-1);

        const updatedOtp = [...otp];

        updatedOtp[index] = digit;

        setOtp(updatedOtp);

        // Move to next box immediately
        if (digit && index < 5) {

            inputRefs.current[index + 1]?.focus();

        }
    };


    // =====================================================
    // BACKSPACE
    // =====================================================

    const handleKeyDown = (index, event) => {

        if (event.key === "Backspace") {

            if (otp[index]) {

                const updatedOtp = [...otp];

                updatedOtp[index] = "";

                setOtp(updatedOtp);

                return;
            }

            if (index > 0) {

                inputRefs.current[index - 1]?.focus();

            }
        }


        // Allow moving with arrow keys

        if (
            event.key === "ArrowLeft" &&
            index > 0
        ) {

            inputRefs.current[index - 1]?.focus();

        }

        if (
            event.key === "ArrowRight" &&
            index < 5
        ) {

            inputRefs.current[index + 1]?.focus();

        }
    };


    // =====================================================
    // PASTE OTP
    // =====================================================

    const handlePaste = (event) => {

        event.preventDefault();

        const pastedValue =
            event.clipboardData
                .getData("text")
                .replace(/\D/g, "")
                .slice(0, 6);

        if (!pastedValue) {
            return;
        }

        const updatedOtp = [
            "", "", "", "", "", ""
        ];

        pastedValue
            .split("")
            .forEach((digit, index) => {
                updatedOtp[index] = digit;
            });

        setOtp(updatedOtp);

        const nextIndex =
            Math.min(pastedValue.length, 5);

        inputRefs.current[nextIndex]?.focus();
    };


    // =====================================================
    // VERIFY OTP
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        const otpValue = otp.join("");

        if (otpValue.length !== 6) {

            toast.error(
                "Please enter the complete 6-digit OTP."
            );

            return;
        }

        if (!email) {

            toast.error(
                "Admin email is missing."
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await verifyAdminOtp(
                    email,
                    otpValue
                );

            toast.success(
                response.data?.message ||
                "OTP verified successfully."
            );

            navigate(
                `/admin/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otpValue)}`
            );

        } catch (error) {

            console.error(
                "Admin OTP verification error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Invalid or expired OTP."
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
                                        Secure Verification
                                    </h3>

                                    <p>
                                        Verify your identity using
                                        the OTP sent to your email.
                                    </p>

                                </div>

                            </div>


                            <div className="auth-feature">

                                <div className="auth-feature-icon">
                                    <i className="bi bi-envelope-check"></i>
                                </div>

                                <div>

                                    <h3>
                                        Email OTP
                                    </h3>

                                    <p>
                                        A six-digit verification code
                                        has been sent to your email.
                                    </p>

                                </div>

                            </div>


                            <div className="auth-feature">

                                <div className="auth-feature-icon">
                                    <i className="bi bi-clock-history"></i>
                                </div>

                                <div>

                                    <h3>
                                        Limited Validity
                                    </h3>

                                    <p>
                                        Your OTP is valid for
                                        five minutes.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                   OTP CARD
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
                                <i className="bi bi-shield-lock-fill"></i>
                            </div>

                            <h2>
                                Verify OTP
                            </h2>

                            <p className="text-muted">

                                Enter the 6-digit OTP sent to

                                <br />

                                <strong>
                                    {email || "your registered email"}
                                </strong>

                            </p>

                        </div>


                        <form onSubmit={handleSubmit}>

                            {/* OTP BOXES */}

                            <div
                                className="d-flex justify-content-center gap-2 mb-4"
                                onPaste={handlePaste}
                            >

                                {otp.map((digit, index) => (

                                    <input
                                        key={index}
                                        ref={(element) => {
                                            inputRefs.current[index] =
                                                element;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(event) =>
                                            handleOtpChange(
                                                index,
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={(event) =>
                                            handleKeyDown(
                                                index,
                                                event
                                            )
                                        }
                                        autoComplete={
                                            index === 0
                                                ? "one-time-code"
                                                : "off"
                                        }
                                        disabled={loading}
                                        className="form-control text-center fw-bold"
                                        style={{
                                            width: "48px",
                                            height: "52px",
                                            fontSize: "22px",
                                        }}
                                        aria-label={`OTP digit ${index + 1}`}
                                    />

                                ))}

                            </div>


                            {/* VERIFY BUTTON */}

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

                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle-fill me-2"></i>

                                        Verify OTP
                                    </>
                                )}

                            </button>

                        </form>


                        {/* BACK */}

                        <div className="text-center mt-4">

                            <Link
                                to="/admin/forgot-password"
                                className="text-decoration-none"
                            >
                                <i className="bi bi-arrow-left me-1"></i>
                                Change Email
                            </Link>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminVerifyOtp;