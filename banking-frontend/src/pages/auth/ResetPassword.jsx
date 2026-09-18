import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import customerService from "../../services/customerService";
import PrimaryButton from "../../components/common/PrimaryButton";

function ResetPassword() {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";
    const otp = location.state?.otp || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);

    if (!email || !otp) {

        navigate("/forgot-password");

        return null;

    }

    const handleSubmit = async () => {

        if (!newPassword || !confirmPassword) {

            toast.error("Please fill all fields.");

            return;

        }

        if (newPassword !== confirmPassword) {

            toast.error("Passwords do not match.");

            return;

        }

        try {

            setLoading(true);

            const response =
                await customerService.resetPassword({

                    email,
                    otp,
                    newPassword,

                });

            toast.success(response.data.message);

            setTimeout(() => {

                navigate("/");

            },1500);

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Unable to reset password."

            );

        }

        finally{

            setLoading(false);

        }

    };

    return (

        <div className="auth-card">

            <div className="login-header">

                <h2>

                    Create New Password 🔒

                </h2>

                <p>

                    Your new password must be different
                    from your previous password.

                </p>

            </div>

            <div className="password-group">

                <label>

                    New Password

                </label>

                <div className="password-input">

                    <input

                        type={
                            showPassword
                            ? "text"
                            : "password"
                        }

                        value={newPassword}

                        onChange={(e)=>

                            setNewPassword(
                                e.target.value
                            )

                        }

                    />

                    <button

                        type="button"

                        onClick={()=>

                            setShowPassword(

                                !showPassword

                            )

                        }

                    >

                        {

                            showPassword

                            ?

                            "🙈"

                            :

                            "👁"

                        }

                    </button>

                </div>

            </div>

            <div className="password-group">

                <label>

                    Confirm Password

                </label>

                <div className="password-input">

                    <input

                        type={
                            showConfirm
                            ? "text"
                            : "password"
                        }

                        value={confirmPassword}

                        onChange={(e)=>

                            setConfirmPassword(
                                e.target.value
                            )

                        }

                    />

                    <button

                        type="button"

                        onClick={()=>

                            setShowConfirm(

                                !showConfirm

                            )

                        }

                    >

                        {

                            showConfirm

                            ?

                            "🙈"

                            :

                            "👁"

                        }

                    </button>

                </div>

            </div>

            <PrimaryButton

                text="Reset Password"

                loading={loading}

                onClick={handleSubmit}

            />

            <div className="register-link mt-4">

                <Link to="/">

                    Back to Login

                </Link>

            </div>

        </div>

    );

}

export default ResetPassword;