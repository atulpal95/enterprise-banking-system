import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import customerService from "../../services/customerService";
import PrimaryButton from "../../components/common/PrimaryButton";

function VerifyOtp() {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);

    const inputs = useRef([]);

    // Redirect if email missing
    useEffect(() => {

        if (!email) {

            navigate("/", { replace: true });

        }

    }, [email, navigate]);

    // Focus first input only once
    useEffect(() => {

        const timeout = setTimeout(() => {

            inputs.current[0]?.focus();

        }, 100);

        return () => clearTimeout(timeout);

    }, []);

    // Countdown timer
    useEffect(() => {

        if (timer <= 0) return;

        const interval = setInterval(() => {

            setTimer((prev) => prev - 1);

        }, 1000);

        return () => clearInterval(interval);

    }, [timer]);

    // OTP Change
    const handleChange = (value, index) => {

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];

        // Paste support
        if (value.length > 1) {

            const pasted = value.slice(0, 6).split("");

            pasted.forEach((digit, i) => {

                newOtp[i] = digit;

            });

            setOtp(newOtp);

            inputs.current[Math.min(pasted.length, 5)]?.focus();

            return;

        }

        newOtp[index] = value;

        setOtp(newOtp);

        if (value && index < 5) {

            inputs.current[index + 1]?.focus();

        }

    };

    // Keyboard navigation
    const handleKeyDown = (e, index) => {

        if (e.key === "Backspace") {

            if (otp[index]) {

                const newOtp = [...otp];
                newOtp[index] = "";

                setOtp(newOtp);

            } else if (index > 0) {

                inputs.current[index - 1]?.focus();

            }

        }

        if (e.key === "ArrowLeft" && index > 0) {

            inputs.current[index - 1]?.focus();

        }

        if (e.key === "ArrowRight" && index < 5) {

            inputs.current[index + 1]?.focus();

        }

    };

    // Verify OTP
    const handleSubmit = async () => {

        const otpValue = otp.join("");

        if (otpValue.length !== 6) {

            toast.error("Please enter the complete OTP.");

            return;

        }

        try {

            setLoading(true);

            const response = await customerService.verifyOtp({

                email,
                otp: otpValue,

            });

            toast.success(response.data.message);

            navigate("/reset-password", {

                state: {

                    email,
                    otp: otpValue,

                },

            });

        } catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Invalid OTP."

            );

        } finally {

            setLoading(false);

        }

    };

    // Resend OTP
    const resendOtp = async () => {

        try {

            await customerService.forgotPassword({

                email,

            });

            toast.success("OTP sent successfully.");

            setTimer(60);

            setOtp(["", "", "", "", "", ""]);

            inputs.current[0]?.focus();

        } catch {

            toast.error("Unable to resend OTP.");

        }

    };

    return (

        <div className="auth-card">

            <div className="login-header">

                <h2>

                    OTP Verification

                </h2>

                <p>

                    Enter the 6-digit OTP sent to

                    <br />

                    <strong>{email}</strong>

                </p>

            </div>

            <div className="otp-container">

                {

                    otp.map((digit, index) => (

                        <input

                            key={index}

                            ref={(el) => (inputs.current[index] = el)}

                            className="otp-input"

                            type="text"

                            inputMode="numeric"

                            autoComplete="one-time-code"

                            maxLength={1}

                            value={digit}

                            onFocus={(e) => e.target.select()}

                            onChange={(e) =>

                                handleChange(

                                    e.target.value,

                                    index

                                )

                            }

                            onKeyDown={(e) =>

                                handleKeyDown(

                                    e,

                                    index

                                )

                            }

                        />

                    ))

                }

            </div>

            <PrimaryButton

                text="Verify OTP"

                loading={loading}

                onClick={handleSubmit}

            />

            <div className="otp-footer">

                {

                    timer > 0 ?

                        <span>

                            Resend OTP in 00:{timer.toString().padStart(2, "0")}

                        </span>

                        :

                        <button

                            className="resend-btn"

                            onClick={resendOtp}

                        >

                            Resend OTP

                        </button>

                }

            </div>

            <div className="register-link">

                <Link to="/">

                    Back to Login

                </Link>

            </div>

        </div>

    );

}

export default VerifyOtp;