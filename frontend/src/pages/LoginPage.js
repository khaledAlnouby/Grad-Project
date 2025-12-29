// frontend/src/pages/LoginPage.js
import React from 'react';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { connectSocket } = useNotifications();

    const handleLogin = async (formData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            const { token } = response.data;
            sessionStorage.setItem('token', token);
            console.log({token});
            // Establish socket connection
            connectSocket(token);

            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div>
            <AuthForm onSubmit={handleLogin} buttonText="Log in" />
        </div>
    );
};

export default LoginPage;