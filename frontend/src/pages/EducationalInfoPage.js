// frontend/src/pages/EducationalInfoPage.js
import React from 'react';
import EducationalInfoForm from '../components/EducationalInfoForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EducationalInfoPage = () => {
    const navigate = useNavigate();

    const handleEducationalInfoSubmit = async (formData) => {
        try {
            await axios.put('http://localhost:5000/api/user/educational', formData, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            navigate('/profile');
        } catch (error) {
            console.error('Educational info update error:', error);
        }
    };

    return (
        <div>
            <EducationalInfoForm onSubmit={handleEducationalInfoSubmit} />
        </div>
    );
};

export default EducationalInfoPage;
