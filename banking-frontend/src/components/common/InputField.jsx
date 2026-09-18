import { useState } from "react";

function InputField({
    label,
    type = "text",
    placeholder,
    icon,
    ...rest
}) {

    const [showPassword, setShowPassword] = useState(false);

    const inputType =
        type === "password"
            ? showPassword
                ? "text"
                : "password"
            : type;

    return (

        <div className="auth-input-field">

            <label className="auth-input-label">
                {label}
            </label>

            <div
                className={
                    type === "password"
                        ? "auth-input-wrapper auth-password-wrapper"
                        : "auth-input-wrapper"
                }
            >

                {icon && (
                    <span className="auth-input-icon">
                        <i className={`bi ${icon}`}></i>
                    </span>
                )}

                <input
                    type={inputType}
                    className="auth-input"
                    placeholder={placeholder}
                    {...rest}
                />

                {type === "password" && (

                    <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() =>
                            setShowPassword((previous) => !previous)
                        }
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >

                        <i
                            className={
                                showPassword
                                    ? "bi bi-eye-slash-fill"
                                    : "bi bi-eye-fill"
                            }
                        ></i>

                    </button>

                )}

            </div>

        </div>
    );
}

export default InputField;