import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import customerService from "../../services/customerService";
import InputField from "../../components/common/InputField";
import PrimaryButton from "../../components/common/PrimaryButton";

function ForgotPassword() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {

        try {

            setLoading(true);

            const response =
                await customerService.forgotPassword(data);

            toast.success(response.data.message);

            navigate(
                "/verify-otp",
                {
                    state: {
                        email: data.email
                    }
                }
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to send OTP."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="auth-card">

            <div className="login-header">

                <h2>
                    Forgot Password 🔐
                </h2>

                <p>

                    Enter your registered email address.
                    We'll send a verification OTP.

                </p>

            </div>

            <form onSubmit={handleSubmit(onSubmit)}>

                <InputField
                    label="Email Address"
                    type="email"
                    placeholder="Enter your registered email"
                    icon="bi-envelope-fill"
                    {...register("email", {
                        required: "Email is required"
                    })}
                />

                {errors.email && (

                    <small className="text-danger">

                        {errors.email.message}

                    </small>

                )}

                <PrimaryButton
                    type="submit"
                    text="Send OTP"
                    loading={loading}
                />

            </form>

            <div className="register-link mt-4">

                <span>

                    Remember your password?

                </span>

                <Link to="/login">

                    Back to Login

                </Link>

            </div>

        </div>

    );

}

export default ForgotPassword;