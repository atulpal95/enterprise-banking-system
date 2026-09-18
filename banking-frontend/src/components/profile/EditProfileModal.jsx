import { useEffect, useState } from "react";
import { FaTimes, FaSave, FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import customerService from "../../services/customerService";
import { useAuth } from "../../context/AuthContext";

function EditProfileModal({
    open,
    profile,
    onClose,
    onSuccess,
}) {

    const [formData, setFormData] = useState(profile);

    const [saving, setSaving] = useState(false);

    const [uploading, setUploading] = useState(false);
    const { updateUser } = useAuth();

    const [previewImage, setPreviewImage] =
        useState(profile.profilePictureUrl || "");

    useEffect(() => {

        setFormData(profile);

        setPreviewImage(
            profile.profilePictureUrl || ""
        );

    }, [profile]);

    if (!open) return null;

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleImage = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setPreviewImage(
            URL.createObjectURL(file)
        );

        const data = new FormData();

        data.append("file", file);

        try {

          setUploading(true);

            await customerService.uploadProfilePicture(data);

            const profile =
            await customerService.getProfile();

            updateUser(profile.data);

             toast.success("Profile picture updated.");

            } catch {

             toast.error("Image upload failed.");
    
             } finally {

             setUploading(false);

        }

    };

    
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

           await customerService.updateProfile({
            fullName: formData.fullName,
             email: formData.email,
             mobile: formData.mobile,
             address: formData.address,
                 city: formData.city,
             state: formData.state,
             postalCode: formData.postalCode,
            country: formData.country,
        });

         // Get latest profile from server
           const profile =
           await customerService.getProfile();

           // Update AuthContext
          updateUser(profile.data);

         toast.success(
           "Profile updated successfully."
           );

           onSuccess();

           onClose();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Update failed."
            );

        } finally {

            setSaving(false);

        }

    };
  

    return (

        <div className="modal-overlay">

            <div className="profile-modal">

                <div className="modal-header">

                    <h2>Edit Profile</h2>

                    <button
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="image-upload">

                        <img
                            src={
                                previewImage ||
                                "/default-avatar.png"
                            }
                            alt=""
                            className="modal-avatar"
                        />

                        <label className="upload-label">

                            <FaCamera />

                            {
                                uploading
                                    ? "Uploading..."
                                    : "Change Photo"
                            }

                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                            />

                        </label>

                    </div>
                    <div className="modal-grid">

    <div className="form-group">
        <label>Full Name</label>

        <input
            type="text"
            name="fullName"
            value={formData.fullName || ""}
            onChange={handleChange}
            required
        />
    </div>

    <div className="form-group">
        <label>Email</label>

        <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            required
        />
    </div>

    <div className="form-group">
        <label>Mobile</label>

        <input
            type="text"
            name="mobile"
            value={formData.mobile || ""}
            onChange={handleChange}
            maxLength={10}
            required
        />
    </div>

    <div className="form-group">
        <label>Address</label>

        <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
        />
    </div>

    <div className="form-group">
        <label>City</label>

        <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
        />
    </div>

    <div className="form-group">
        <label>State</label>

        <input
            type="text"
            name="state"
            value={formData.state || ""}
            onChange={handleChange}
        />
    </div>

    <div className="form-group">
        <label>Postal Code</label>

        <input
            type="text"
            name="postalCode"
            value={formData.postalCode || ""}
            onChange={handleChange}
            maxLength={6}
        />
    </div>

    <div className="form-group">
        <label>Country</label>

        <input
            type="text"
            name="country"
            value={formData.country || ""}
            onChange={handleChange}
        />
    </div>

</div>
<div className="modal-footer">

    <button
        type="button"
        className="cancel-btn"
        onClick={onClose}
    >
        Cancel
    </button>

    <button
        type="submit"
        className="save-btn"
        disabled={saving}
    >
        <FaSave />

        {
            saving
                ? "Saving..."
                : "Save Changes"
        }

    </button>

</div>

</form>

</div>

</div>

);

}

export default EditProfileModal;