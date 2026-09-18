import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCity,
    FaFlag,
    FaMapPin,
    FaGlobe,
} from "react-icons/fa";

function PersonalInfo({ profile }) {

    const InfoCard = ({ icon, label, value }) => (

        <div className="info-card">

            <div className="info-icon">

                {icon}

            </div>

            <div className="info-content">

                <span>{label}</span>

                <h4>{value || "-"}</h4>

            </div>

        </div>

    );

    return (

        <div className="card">

            <h2>Personal Information</h2>

            <div className="info-grid">

                <InfoCard
                    icon={<FaUser />}
                    label="Full Name"
                    value={profile.fullName}
                />

                <InfoCard
                    icon={<FaEnvelope />}
                    label="Email"
                    value={profile.email}
                />

                <InfoCard
                    icon={<FaPhone />}
                    label="Mobile"
                    value={profile.mobile}
                />

                <InfoCard
                    icon={<FaMapMarkerAlt />}
                    label="Address"
                    value={profile.address}
                />

                <InfoCard
                    icon={<FaCity />}
                    label="City"
                    value={profile.city}
                />

                <InfoCard
                    icon={<FaFlag />}
                    label="State"
                    value={profile.state}
                />

                <InfoCard
                    icon={<FaMapPin />}
                    label="Postal Code"
                    value={profile.postalCode}
                />

                <InfoCard
                    icon={<FaGlobe />}
                    label="Country"
                    value={profile.country}
                />

            </div>

        </div>

    );

}

export default PersonalInfo;