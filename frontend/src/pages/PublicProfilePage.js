// frontend/src/pages/PublicProfilePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PublicProfileDetails from '../components/PublicProfileDetails';
import UserRatingSection from '../components/UserRatingSection';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PublicProfilePage = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Retrieve and decode the JWT token from session storage
    const token = sessionStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const fromUser = decodedToken.userId;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/profile/${id}`);
                setProfile(response.data);
            } catch (error) {
                setError('Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            {profile && <PublicProfileDetails profile={profile} />}
            {profile && <UserRatingSection toUser={profile._id} fromUser={fromUser} />}
        </div>
    );
};

export default PublicProfilePage;

/*
// frontend/src/pages/PublicProfilePage.js
import axios from 'axios';
import PublicProfileDetails from '../components/PublicProfileDetails';
import { useParams } from 'react-router-dom';

const PublicProfilePage = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/profile/${id}`);
                setProfile(response.data);
            } catch (error) {
                setError('Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            {profile && <PublicProfileDetails profile={profile} />}
        </div>
    );
};

export default PublicProfilePage;
*/