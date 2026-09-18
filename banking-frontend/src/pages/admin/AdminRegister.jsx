import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axiosInstance from "../../api/axiosInstance";
import "../../assets/styles/admin-register.css";

function AdminRegister() {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const password = watch("password");

    const onSubmit = async (data) => {

        try {

            setLoading(true);

            const response = await axiosInstance.post(
                "/admin/register",
                {
                    fullName: data.fullName.trim(),
                    email: data.email.trim().toLowerCase(),
                    password: data.password,
                }
            );

            toast.success(
                response.data?.message ||
                "Admin account created successfully."
            );

            navigate("/admin/login");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to create admin account."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="admin-register-page">

            {/* =====================================================
               NAVBAR
            ===================================================== */}

            <nav className="admin-register-navbar">

                <Link
                    to="/"
                    className="admin-register-brand"
                >

                    <div className="admin-register-brand-logo">
                        PEB
                    </div>

                    <div className="admin-register-brand-text">

                        <span className="admin-register-brand-name">
                            PAL Enterprise Bank
                        </span>

                        <span className="admin-register-brand-tagline">
                            Secure • Smart • Trusted
                        </span>

                    </div>

                </Link>


                <div className="admin-register-navbar-actions">

                    <Link
                        to="/admin/login"
                        className="admin-register-nav-button"
                    >
                        <i className="bi bi-shield-lock-fill"></i>
                        Admin Login
                    </Link>

                </div>

            </nav>


            {/* =====================================================
               MAIN
            ===================================================== */}

            <main className="admin-register-main">


                {/* =================================================
                   ADMIN ABOUT SECTION
                ================================================= */}

                <section className="admin-register-about">

                    <div className="admin-register-about-content">

                        <div className="admin-register-logo-large">
                            PEB
                        </div>


                        <h1>
                            PAL
                            <span>
                                Enterprise Bank
                            </span>
                        </h1>


                        <p className="admin-register-about-tagline">
                            Secure • Smart • Trusted
                        </p>


                        <div className="admin-register-about-line"></div>


                        <p className="admin-register-about-description">
                            A secure administration platform designed
                            to help authorized banking administrators
                            manage customers, accounts, transactions
                            and banking services efficiently.
                        </p>


                        {/* FEATURES */}

                        <div className="admin-register-features">


                            <div className="admin-register-feature">

                                <div className="admin-register-feature-icon">
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


                            <div className="admin-register-feature">

                                <div className="admin-register-feature-icon">
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


                            <div className="admin-register-feature">

                                <div className="admin-register-feature-icon">
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

                    </div>

                </section>


                {/* =================================================
                   REGISTER CARD
                ================================================= */}

                <section className="admin-register-card">


                    <div className="admin-register-header">

                        <div className="admin-register-icon">
                            <i className="bi bi-shield-lock-fill"></i>
                        </div>

                        <span className="admin-register-eyebrow">
                            ADMINISTRATION
                        </span>

                        <h2>
                            Create Admin Account
                        </h2>

                        <p>
                            Register an administrator for secure
                            banking system management.
                        </p>

                    </div>


                    <form
                        className="admin-register-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >


                        {/* FULL NAME */}

                        <div className="admin-form-group">

                            <label htmlFor="fullName">
                                Full Name
                            </label>

                            <div className="admin-input-wrapper">

                                <i className="bi bi-person-fill"></i>

                                <input
                                    id="fullName"
                                    type="text"
                                    placeholder="Enter full name"
                                    autoComplete="name"
                                    {...register("fullName", {
                                        required:
                                            "Full name is required",
                                        minLength: {
                                            value: 3,
                                            message:
                                                "Minimum 3 characters",
                                        },
                                    })}
                                />

                            </div>

                            {errors.fullName && (
                                <span className="admin-form-error">
                                    {errors.fullName.message}
                                </span>
                            )}

                        </div>


                        {/* EMAIL */}

                        <div className="admin-form-group">

                            <label htmlFor="email">
                                Admin Email
                            </label>

                            <div className="admin-input-wrapper">

                                <i className="bi bi-envelope-fill"></i>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter admin email"
                                    autoComplete="email"
                                    {...register("email", {
                                        required:
                                            "Email is required",
                                        pattern: {
                                            value:
                                                /^\S+@\S+$/i,
                                            message:
                                                "Enter a valid email",
                                        },
                                    })}
                                />

                            </div>

                            {errors.email && (
                                <span className="admin-form-error">
                                    {errors.email.message}
                                </span>
                            )}

                        </div>


                        {/* PASSWORD */}

                        <div className="admin-form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="admin-input-wrapper">

                                <i className="bi bi-lock-fill"></i>

                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Create password"
                                    autoComplete="new-password"
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

                            </div>

                            {errors.password && (
                                <span className="admin-form-error">
                                    {errors.password.message}
                                </span>
                            )}

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="admin-form-group">

                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <div className="admin-input-wrapper">

                                <i className="bi bi-shield-check"></i>

                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm password"
                                    autoComplete="new-password"
                                    {...register("confirmPassword", {
                                        required:
                                            "Please confirm your password",
                                        validate: (value) =>
                                            value === password ||
                                            "Passwords do not match",
                                    })}
                                />

                            </div>

                            {errors.confirmPassword && (
                                <span className="admin-form-error">
                                    {errors.confirmPassword.message}
                                </span>
                            )}

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="admin-register-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>

                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-person-plus-fill"></i>

                                    Create Admin Account
                                </>
                            )}

                        </button>

                    </form>


                    {/* FOOTER */}

                    <div className="admin-register-footer">

                        <span>
                            Already have an admin account?
                        </span>

                        <Link to="/admin/login">
                            Admin Login
                        </Link>

                    </div>


                </section>

            </main>


            {/* =====================================================
               FOOTER
            ===================================================== */}

            <footer className="admin-register-page-footer">

                © 2026 PAL Enterprise Bank. All rights reserved.

            </footer>

        </div>
    );
}

export default AdminRegister;