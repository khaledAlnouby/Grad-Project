// frontend/src/pages/PersonalInfoPage.js
import React from 'react';
import PersonalInfoForm from '../components/PersonalInfoForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PersonalInfoPage = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    console.log(`Token from localStorage in PersonalInfoPage.js: ${token}`);

    const handlePersonalInfoSubmit = async (formData) => {
        try {
            await axios.put('http://localhost:5000/api/user/personal', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/educational-info');
        } catch (error) {
            console.error('Personal info update error:', error);
        }
    };

    return (
        <div>
            <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
        </div>
    );
};

export default PersonalInfoPage;


