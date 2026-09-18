import { useState } from "react";
import customerService from "../../services/customerService";
import { toast } from "react-toastify";
import {
    FaTimes,
    FaLock,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";

function ChangePasswordModal({
    open,
    onClose,
}) {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const passwordRules = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
};
    
    const handleSubmit = async () => {

    if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
    ) {

        toast.error("Please fill all fields.");

        return;

    }

    if (newPassword !== confirmPassword) {

        toast.error("Passwords do not match.");

        return;

    }

    if (passedRules < 5) {

    toast.error(
        "Password does not meet security requirements."
    );

    return;

}

    try {

        setLoading(true);

        const response =
            await customerService.changePassword({

                oldPassword: currentPassword,

                newPassword: newPassword,

            });

        toast.success(response.data.message);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        onClose();

    }

    catch (error) {

        toast.error(

            error.response?.data?.message ||

            "Unable to change password."

        );

    }

    finally {

        setLoading(false);

    }

};

const passedRules = Object.values(passwordRules).filter(Boolean).length;

const getStrength = () => {

    if (passedRules <= 2)
        return "Weak";

    if (passedRules <= 4)
        return "Medium";

    return "Strong";

};
    
    if (!open) return null;

    return (

        <div className="password-overlay">

            <div className="password-modal">

                <div className="password-header">

                    <h2>Change Password</h2>

                    <button
                        onClick={onClose}
                        className="close-btn"
                    >
                        <FaTimes />
                    </button>

                </div>

                <p className="password-note">
                    Your password should be at least 8 characters and contain uppercase, lowercase, numbers and special characters.
                </p>

                {/* Current Password */}

                <div className="password-group">

                    <label>Current Password</label>

                    <div className="password-input">

                        <FaLock />

                        <input
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(e.target.value)
                            }
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowCurrent(!showCurrent)
                            }
                        >
                            {
                                showCurrent
                                    ? <FaEyeSlash />
                                    : <FaEye />
                            }
                        </button>

                    </div>

                </div>

                {/* New */}

                <div className="password-group">

                    <label>New Password</label>

                    <div className="password-input">

                        <FaLock />

                        <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowNew(!showNew)
                            }
                        >
                            {
                                showNew
                                    ? <FaEyeSlash />
                                    : <FaEye />
                            }
                        </button>

                    </div>

                </div>


                <div className="password-strength">

                    <div className={`strength ${getStrength().toLowerCase()}`}>
                           Password Strength : {getStrength()}
                         </div>

                           </div>

                         <div className="password-checklist">

                      <p className={passwordRules.length ? "valid" : ""}>
                          ✓ Minimum 8 characters
                       </p>

                       <p className={passwordRules.uppercase ? "valid" : ""}>
                       ✓ One uppercase letter
                      </p>

                            <p className={passwordRules.lowercase ? "valid" : ""}>
                          ✓ One lowercase letter
                        </p>

                         <p className={passwordRules.number ? "valid" : ""}>
                        ✓ One number
                           </p>

                           <p className={passwordRules.special ? "valid" : ""}>
                         ✓ One special character
                      </p>

                 </div>

                {/* Confirm */}

                <div className="password-group">

                    <label>Confirm Password</label>

                    <div className="password-input">

                        <FaLock />

                        <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirm(!showConfirm)
                            }
                        >
                            {
                                showConfirm
                                    ? <FaEyeSlash />
                                    : <FaEye />
                            }
                        </button>

                    </div>

                </div>

                <div className="password-footer">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
    className="save-btn"
    onClick={handleSubmit}
    disabled={loading}
    
>
    {
        loading
            ? "Updating..."
            : "Update Password"
    }

    
</button>

                </div>

            </div>

        </div>

    );

}

export default ChangePasswordModal;