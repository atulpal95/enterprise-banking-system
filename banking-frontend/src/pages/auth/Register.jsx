import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import customerService from "../../services/customerService";

import InputField from "../../components/common/InputField";
import PrimaryButton from "../../components/common/PrimaryButton";

import "../../assets/styles/register.css";

function Register() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    // Same mobile behavior as Customer Login
    const [mobileRegisterMode, setMobileRegisterMode] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch("password");


    const openMobileRegister = () => {
        setMobileRegisterMode(true);
    };


    const closeMobileRegister = () => {
        setMobileRegisterMode(false);
    };


    const onSubmit = async (data) => {

        try {

            setLoading(true);

            const registerData = {
                fullName: data.fullName,
                email: data.email,
                mobile: data.mobile,
                address: data.address,
                city: data.city,
                state: data.state,
                country: data.country,
                postalCode: data.postalCode,
                password: data.password,
            };

            await customerService.register(registerData);

            toast.success("Account created successfully.");

            navigate("/");

        } catch (error) {

            console.log(error);
            console.log(error.response);
            console.log(error.response?.data);

            toast.error(
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Registration failed."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="register-page">


            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <nav className="register-navbar">

                <Link
                    to="/"
                    className="register-brand"
                >

                    <div className="register-brand-logo">
                        PEB
                    </div>

                    <div className="register-brand-text">

                        <span className="register-brand-name">
                            PAL Enterprise Bank
                        </span>

                        <span className="register-brand-tagline">
                            Secure • Smart • Trusted
                        </span>

                    </div>

                </Link>


                <div className="register-navbar-actions">

                    {/* DESKTOP */}
                    <Link
                        to="/admin/login"
                        className="register-admin-button"
                    >
                        <i className="bi bi-shield-lock-fill"></i>
                        Admin Login
                    </Link>


                    {/* MOBILE REGISTER BUTTON */}

                    <button
                        type="button"
                        className="register-mobile-nav-button"
                        onClick={openMobileRegister}
                    >
                        <i className="bi bi-person-plus-fill"></i>
                        Register
                    </button>

                </div>

            </nav>


            {/* =====================================================
                MAIN
            ===================================================== */}

            <main
                className={
                    mobileRegisterMode
                        ? "register-main mobile-register-mode"
                        : "register-main"
                }
            >


                {/* =================================================
                    BANK ABOUT / WELCOME
                ================================================= */}

                <section className="register-about">

                    <div className="register-about-content">

                        <div className="register-logo-large">
                            PEB
                        </div>


                        <h1>
                            PAL
                            <span>
                                Enterprise Bank
                            </span>
                        </h1>


                        <p className="register-about-tagline">
                            Secure • Smart • Trusted
                        </p>


                        <div className="register-about-line"></div>


                        <p className="register-about-description">

                            Experience modern digital banking designed
                            to make your everyday financial life simpler,
                            safer and more convenient.

                        </p>


                        {/* FEATURES */}

                        <div className="register-features">


                            <div className="register-feature">

                                <div className="register-feature-icon">
                                    <i className="bi bi-shield-check"></i>
                                </div>

                                <div>

                                    <h3>
                                        Secure Banking
                                    </h3>

                                    <p>
                                        Protection designed around
                                        your account.
                                    </p>

                                </div>

                            </div>


                            <div className="register-feature">

                                <div className="register-feature-icon">
                                    <i className="bi bi-lightning-fill"></i>
                                </div>

                                <div>

                                    <h3>
                                        Smart Banking
                                    </h3>

                                    <p>
                                        Convenient digital banking
                                        solutions.
                                    </p>

                                </div>

                            </div>


                            <div className="register-feature">

                                <div className="register-feature-icon">
                                    <i className="bi bi-people-fill"></i>
                                </div>

                                <div>

                                    <h3>
                                        Trusted Partner
                                    </h3>

                                    <p>
                                        Banking built around your
                                        financial needs.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            MOBILE REGISTER BUTTON
                        ================================================= */}

                        <button
                            type="button"
                            className="register-mobile-card-button"
                            onClick={openMobileRegister}
                        >

                            <i className="bi bi-person-plus-fill"></i>

                            <span>
                                Register
                            </span>

                            <i className="bi bi-arrow-right"></i>

                        </button>

                    </div>

                </section>


                {/* =================================================
                    REGISTER CARD
                ================================================= */}

                <section className="register-card">


                    {/* MOBILE BACK */}

                    <button
                        type="button"
                        className="register-mobile-back"
                        onClick={closeMobileRegister}
                    >

                        <i className="bi bi-arrow-left"></i>

                        <span>
                            Back to Bank
                        </span>

                    </button>


                    <div className="register-card-header">

                        <h2>
                            Create Account 🏦
                        </h2>

                        <p>
                            Join PAL Enterprise Bank and start
                            banking securely.
                        </p>

                    </div>


                    <form
                        className="register-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >


                        {/* FULL NAME */}

                        <InputField
                            label="Full Name"
                            type="text"
                            placeholder="Enter full name"
                            icon="bi-person-fill"
                            {...register("fullName", {
                                required: "Full name is required",
                            })}
                        />

                        {errors.fullName && (
                            <small className="text-danger">
                                {errors.fullName.message}
                            </small>
                        )}


                        {/* EMAIL */}

                        <InputField
                            label="Email"
                            type="email"
                            placeholder="Enter email"
                            icon="bi-envelope-fill"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Enter a valid email",
                                },
                            })}
                        />

                        {errors.email && (
                            <small className="text-danger">
                                {errors.email.message}
                            </small>
                        )}


                        {/* MOBILE */}

                        <InputField
                            label="Mobile Number"
                            type="text"
                            placeholder="Enter mobile number"
                            icon="bi-phone-fill"
                            {...register("mobile", {
                                required: "Mobile number is required",
                            })}
                        />

                        {errors.mobile && (
                            <small className="text-danger">
                                {errors.mobile.message}
                            </small>
                        )}


                        {/* ADDRESS */}

                        <InputField
                            label="Address"
                            type="text"
                            placeholder="Enter address"
                            icon="bi-geo-alt-fill"
                            {...register("address", {
                                required: "Address is required",
                            })}
                        />

                        {errors.address && (
                            <small className="text-danger">
                                {errors.address.message}
                            </small>
                        )}


                        {/* CITY + STATE */}

                        <div className="register-row">

                            <div className="register-half">

                                <InputField
                                    label="City"
                                    type="text"
                                    placeholder="City"
                                    icon="bi-building"
                                    {...register("city", {
                                        required: "City is required",
                                    })}
                                />

                                {errors.city && (
                                    <small className="text-danger">
                                        {errors.city.message}
                                    </small>
                                )}

                            </div>


                            <div className="register-half">

                                <InputField
                                    label="State"
                                    type="text"
                                    placeholder="State"
                                    icon="bi-map-fill"
                                    {...register("state", {
                                        required: "State is required",
                                    })}
                                />

                                {errors.state && (
                                    <small className="text-danger">
                                        {errors.state.message}
                                    </small>
                                )}

                            </div>

                        </div>


                        {/* COUNTRY + POSTAL */}

                        <div className="register-row">

                            <div className="register-half">

                                <InputField
                                    label="Country"
                                    type="text"
                                    placeholder="Country"
                                    icon="bi-globe"
                                    {...register("country", {
                                        required: "Country is required",
                                    })}
                                />

                                {errors.country && (
                                    <small className="text-danger">
                                        {errors.country.message}
                                    </small>
                                )}

                            </div>


                            <div className="register-half">

                                <InputField
                                    label="Postal Code"
                                    type="text"
                                    placeholder="Postal Code"
                                    icon="bi-mailbox"
                                    {...register("postalCode", {
                                        required: "Postal Code is required",
                                    })}
                                />

                                {errors.postalCode && (
                                    <small className="text-danger">
                                        {errors.postalCode.message}
                                    </small>
                                )}

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <InputField
                            label="Password"
                            type="password"
                            placeholder="Enter password"
                            icon="bi-lock-fill"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Minimum 8 characters",
                                },
                            })}
                        />

                        {errors.password && (
                            <small className="text-danger">
                                {errors.password.message}
                            </small>
                        )}


                        {/* CONFIRM PASSWORD */}

                        <InputField
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm password"
                            icon="bi-shield-lock-fill"
                            {...register("confirmPassword", {
                                required: "Confirm your password",
                                validate: value =>
                                    value === password ||
                                    "Passwords do not match",
                            })}
                        />

                        {errors.confirmPassword && (
                            <small className="text-danger">
                                {errors.confirmPassword.message}
                            </small>
                        )}


                        <PrimaryButton
                            type="submit"
                            text="Create Account"
                            loading={loading}
                        />

                    </form>


                    <div className="register-login-link">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/">
                            Login
                        </Link>

                    </div>

                </section>

            </main>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="register-footer">

                © 2026 PAL Enterprise Bank. All rights reserved.

            </footer>

        </div>
    );
}

export default Register;