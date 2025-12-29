import React from 'react';
import AuthForm from '../components/AuthForm';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const navigate = useNavigate();

    const handleRegister = async (formData) => {
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <div>
            <AuthForm onSubmit={handleRegister} buttonText="Create account" />
        </div>
    );
};

export default RegisterPage;
