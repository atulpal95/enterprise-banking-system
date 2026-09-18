import {
    FaCheckCircle,
    FaEdit,
    FaUserCircle,
    FaEnvelope,
    FaIdCard,
    FaUniversity,
} from "react-icons/fa";

import "../../assets/styles/ProfileCard.css";

function ProfileCard({ profile, onEdit }) {

    const account =
        profile.accountNumber
            ? `XXXX${profile.accountNumber.slice(-4)}`
            : "N/A";

    const image =
        profile.profilePictureUrl ||
        profile.profilePicture ||
        null;

    return (

        <div className="profile-header-card">

            <div className="profile-left">

               <div className="avatar-wrapper">

    {
        image ? (
            <img
                src={image}
                alt="Profile"
                className="profile-avatar"
                />
                            ) : (
                            <FaUserCircle className="default-avatar" />
                        )
                       }

                </div>

                <div className="profile-details">

                    <h2>{profile.fullName}</h2>

                    <p className="customer-type">
                        Premium Savings Customer
                    </p>

                    <div className="detail-row">

                        <span>
                            <FaIdCard />
                            Customer ID :
                            <strong> #{profile.id}</strong>
                        </span>

                        <span>
                            <FaUniversity />
                            Account :
                            <strong> {account}</strong>
                        </span>

                    </div>

                    <div className="detail-row">

                        <span>
                            <FaEnvelope />
                            {profile.email}
                        </span>

                    </div>

                    <div className="status-group">

                        <span className="badge success">

                            <FaCheckCircle />

                            Active

                        </span>

                        <span className="badge verified">

                            ✔ KYC Verified

                        </span>

                        <span className="badge account">

                            🏦 Savings

                        </span>

                    </div>

                </div>

            </div>

            <button
                className="edit-profile-btn"
                onClick={onEdit}
            >

                <FaEdit />

                Edit Profile

            </button>

        </div>

    );

}

export default ProfileCard;