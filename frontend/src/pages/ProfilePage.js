// frontend/src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileDetails from '../components/ProfileDetails';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ProfileDetails profile={profile} />
        </div>
    );
};

export default ProfilePage;


