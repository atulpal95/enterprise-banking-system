import { useEffect, useState } from "react";
import "../../assets/styles/Profile.css";
import "../../assets/styles/EditProfileModal.css";

import customerService from "../../services/customerService";
import ProfileCard from "../../components/profile/ProfileCard";
import PersonalInfo from "../../components/profile/PersonalInfo";
import BankingInfo from "../../components/profile/BankingInfo";
import EditProfileModal from "../../components/profile/EditProfileModal";
import ChangePasswordModal from "../../components/profile/ChangePasswordModal";
import SecurityCenter from "../../components/profile/SecurityCenter";

function Profile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);

    const loadProfile = async () => {
        try {
            const response = await customerService.getProfile();
            setProfile(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="profile-loading">
                Loading...
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="profile-loading">
                Unable to load profile.
            </div>
        );
    }

    return (
        <div className="profile-page">

            <ProfileCard
                profile={profile}
                onEdit={() => setEditOpen(true)}
            />

        

            <PersonalInfo profile={profile} />

            <BankingInfo profile={profile} />

            <SecurityCenter
                     onChangePassword={() => setPasswordOpen(true)}
                     onChangePhoto={() => {
                     setEditOpen(true);
                  }}
            />

            <EditProfileModal
                open={editOpen}
                profile={profile}
                onClose={() => setEditOpen(false)}
                onSuccess={loadProfile}
            />

            <ChangePasswordModal
              open={passwordOpen}
              onClose={() => setPasswordOpen(false)}
            />

        </div>
    );
}

export default Profile;