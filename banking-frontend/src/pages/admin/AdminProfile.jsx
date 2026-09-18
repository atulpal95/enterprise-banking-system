import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    getAdminProfile,
    updateAdminProfile,
    uploadAdminProfilePicture,
    changeAdminPassword,
} from "../../api/adminApi";

import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/admin-profile.css";

function AdminProfile() {
    const { updateUser } = useAuth();

    const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "",
    profilePictureUrl: "",
});

    const [profileLoading, setProfileLoading] = useState(true);
    const [profileSaving, setProfileSaving] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [mode, setMode] = useState("VIEW");

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const loadProfile = async () => {
        try {
            setProfileLoading(true);
            const response = await getAdminProfile();

            setProfile({
    fullName: response.data?.fullName || "",
    email: response.data?.email || "",
    role: response.data?.role || "ROLE_ADMIN",
    profilePictureUrl: response.data?.profilePictureUrl || "",
});
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to load admin profile."
            );
        } finally {
            setProfileLoading(false);
        }
    };

    const handleProfilePictureChange = async (event) => {

    const file = event.target.files?.[0];

    if (!file) {
        return;
    }

    // Basic validation
    if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        event.target.value = "";
        return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
        toast.error("Profile picture must be smaller than 5 MB.");
        event.target.value = "";
        return;
    }

    try {

        const formData = new FormData();

        formData.append("file", file);

        const response =
            await uploadAdminProfilePicture(formData);

        const updatedPictureUrl =
            response.data?.profilePictureUrl;

        if (updatedPictureUrl) {

            setProfile((previous) => ({
                ...previous,
                profilePictureUrl: updatedPictureUrl,
            }));

            updateUser({
                profilePictureUrl: updatedPictureUrl,
            });
        }

        toast.success(
            "Profile picture updated successfully."
        );

    } catch (error) {

        toast.error(
            error.response?.data?.message ||
            "Unable to update profile picture."
        );

    } finally {

        event.target.value = "";
    }
};

    useEffect(() => {
        loadProfile();
    }, []);

    const handleProfileChange = (event) => {
        const { name, value } = event.target;
        setProfile((previous) => ({ ...previous, [name]: value }));
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setPasswordData((previous) => ({ ...previous, [name]: value }));
    };

    const handleProfileSubmit = async (event) => {
        event.preventDefault();

        if (!profile.fullName.trim()) {
            toast.error("Full name is required.");
            return;
        }

        if (!profile.email.trim()) {
            toast.error("Email is required.");
            return;
        }

        try {
            setProfileSaving(true);

            const response = await updateAdminProfile({
                fullName: profile.fullName.trim(),
                email: profile.email.trim(),
            });

            const updatedProfile = response.data;

            setProfile({
                fullName: updatedProfile.fullName || "",
                email: updatedProfile.email || "",
                role: updatedProfile.role || "ROLE_ADMIN",
            });

            updateUser({
                fullName: updatedProfile.fullName,
                email: updatedProfile.email,
                role: updatedProfile.role,
            });

            toast.success("Admin profile updated successfully.");
            setMode("VIEW");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to update admin profile."
            );
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();

        if (!passwordData.currentPassword) {
            toast.error("Current password is required.");
            return;
        }

        if (!passwordData.newPassword) {
            toast.error("New password is required.");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters.");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        try {
            setPasswordSaving(true);
            await changeAdminPassword(passwordData);

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            toast.success("Password changed successfully.");
            setMode("VIEW");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to change password."
            );
        } finally {
            setPasswordSaving(false);
        }
    };

    const openEditProfile = () => setMode("EDIT_PROFILE");

    const openChangePassword = () => {
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setMode("CHANGE_PASSWORD");
    };

    const cancelAction = () => {
        setMode("VIEW");
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        loadProfile();
    };

    if (profileLoading) {
        return (
            <div className="admin-profile-loading">
                <div className="spinner-border text-primary" role="status"></div>
                <span>Loading admin profile...</span>
            </div>
        );
    }

    return (
        <div className="admin-profile-page">
            <section className="admin-profile-hero">
                <div className="admin-profile-hero-content">
                    <span className="admin-profile-eyebrow">ADMINISTRATION</span>
                    <h1>Admin Profile</h1>
                    <p>Manage your administrator account, profile information and security.</p>
                </div>

                <div className="admin-profile-avatar">

    {profile.profilePictureUrl ? (
        <img
            src={profile.profilePictureUrl}
            alt="Admin Profile"
        />
    ) : (
        <i className="bi bi-shield-lock-fill"></i>
    )}

</div>
            </section>

            {mode === "VIEW" && (
                <section className="admin-profile-overview-card">
                    <div className="admin-profile-overview-header">
                        <div className="admin-profile-overview-avatar">

    {profile.profilePictureUrl ? (
        <img
            src={profile.profilePictureUrl}
            alt="Admin Profile"
        />
    ) : (
        <i className="bi bi-person-fill"></i>
    )}

</div>
                        <div className="admin-profile-overview-title">
                            <span className="admin-profile-overview-label">ADMINISTRATOR ACCOUNT</span>
                            <h2>{profile.fullName || "Administrator"}</h2>
                            <p>{profile.email || "--"}</p>
                        </div>

                        <span className="admin-profile-role-badge">
                            <i className="bi bi-shield-check"></i>
                            {profile.role || "ROLE_ADMIN"}
                        </span>
                    </div>

                    <div className="admin-profile-overview-details">
                        <div className="admin-profile-detail">
                            <span><i className="bi bi-person"></i> Full Name</span>
                            <strong>{profile.fullName || "--"}</strong>
                        </div>

                        <div className="admin-profile-detail">
                            <span><i className="bi bi-envelope"></i> Email Address</span>
                            <strong>{profile.email || "--"}</strong>
                        </div>

                        <div className="admin-profile-detail">
                            <span><i className="bi bi-shield-check"></i> Role</span>
                            <strong>{profile.role || "ROLE_ADMIN"}</strong>
                        </div>
                    </div>

                    <div className="admin-profile-overview-actions">
                        <button
                            type="button"
                            className="admin-profile-primary-button"
                            onClick={openEditProfile}
                        >
                            <i className="bi bi-pencil-square"></i>
                            Edit Profile
                        </button>

                        <button
                            type="button"
                            className="admin-profile-secondary-button"
                            onClick={openChangePassword}
                        >
                            <i className="bi bi-key-fill"></i>
                            Change Password
                        </button>
                    </div>
                </section>
            )}

            {mode === "EDIT_PROFILE" && (
                <section className="admin-profile-card admin-profile-action-card">
                    <div className="admin-profile-card-header">
                        <div className="admin-profile-card-icon">
                            <i className="bi bi-person-fill"></i>
                        </div>
                        <div>
                            <h2>Edit Profile</h2>
                            <p>Update your administrator details.</p>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="admin-profile-form">

                        {/* =========================================
                            PROFILE PICTURE
                        ========================================== */}
                        <div className="admin-profile-picture-section">

                            <div className="admin-profile-picture-preview">

                                {profile.profilePictureUrl ? (
                                    <img
                                        src={profile.profilePictureUrl}
                                        alt="Admin Profile"
                                    />
                                ) : (
                                    <i className="bi bi-person-fill"></i>
                                )}

                            </div>

                            <div className="admin-profile-picture-info">

                                <strong>Profile Picture</strong>

                                <span>
                                    Upload a professional profile picture.
                                </span>

                                <label
                                    htmlFor="adminProfilePicture"
                                    className="admin-profile-upload-button"
                                >
                                    <i className="bi bi-camera-fill"></i>
                                    Change Picture
                                </label>

                                <input
                                    id="adminProfilePicture"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleProfilePictureChange}
                                    hidden
                                />

                            </div>

                        </div>

                        {/* =========================================
                            FULL NAME
                        ========================================== */}
                        <div className="admin-profile-field">
                            <label htmlFor="fullName">Full Name</label>
                            <div className="admin-profile-input">
                                <i className="bi bi-person"></i>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={profile.fullName}
                                    onChange={handleProfileChange}
                                    placeholder="Full name"
                                    autoComplete="name"
                                />
                            </div>
                        </div>

                        <div className="admin-profile-field">
                            <label htmlFor="email">Email Address</label>
                            <div className="admin-profile-input">
                                <i className="bi bi-envelope"></i>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={profile.email}
                                    onChange={handleProfileChange}
                                    placeholder="Admin email"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="admin-profile-field">
                            <label>Role</label>
                            <div className="admin-profile-readonly">
                                <i className="bi bi-shield-check"></i>
                                <span>{profile.role || "ROLE_ADMIN"}</span>
                            </div>
                        </div>

                        <div className="admin-profile-form-actions">
                            <button
                                type="button"
                                className="admin-profile-secondary-button"
                                onClick={cancelAction}
                                disabled={profileSaving}
                            >
                                <i className="bi bi-x-lg"></i>
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="admin-profile-primary-button"
                                disabled={profileSaving}
                            >
                                {profileSaving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check2-circle"></i>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {mode === "CHANGE_PASSWORD" && (
                <section className="admin-profile-card admin-profile-action-card">
                    <div className="admin-profile-card-header">
                        <div className="admin-profile-card-icon security">
                            <i className="bi bi-lock-fill"></i>
                        </div>
                        <div>
                            <h2>Change Password</h2>
                            <p>Keep your administrator account secure.</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="admin-profile-form">
                        <div className="admin-profile-field">
                            <label htmlFor="currentPassword">Current Password</label>
                            <div className="admin-profile-input">
                                <i className="bi bi-lock"></i>
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Current password"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <div className="admin-profile-field">
                            <label htmlFor="newPassword">New Password</label>
                            <div className="admin-profile-input">
                                <i className="bi bi-key"></i>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Minimum 6 characters"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div className="admin-profile-field">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <div className="admin-profile-input">
                                <i className="bi bi-shield-check"></i>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div className="admin-profile-form-actions">
                            <button
                                type="button"
                                className="admin-profile-secondary-button"
                                onClick={cancelAction}
                                disabled={passwordSaving}
                            >
                                <i className="bi bi-x-lg"></i>
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="admin-profile-primary-button"
                                disabled={passwordSaving}
                            >
                                {passwordSaving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-key-fill"></i>
                                        Change Password
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="admin-security-card">
                <div className="admin-security-icon">
                    <i className="bi bi-shield-check"></i>
                </div>

                <div>
                    <h3>Account Security</h3>
                    <p>
                        Your administrator account is protected using JWT authentication and role-based access control.
                    </p>
                </div>

                <div className="admin-security-badge">
                    <i className="bi bi-check-circle-fill"></i>
                    Protected
                </div>
            </section>
        </div>
    );
}

export default AdminProfile;