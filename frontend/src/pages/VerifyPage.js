// frontend/src/pages/VerifyPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const VerifyPage = () => {
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();
    console.log(`Token received in VerifyPage.js: ${token}`);
    
    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
                setMessage(response.data.message);
                if (response.data.message === 'Email verified successfully') {
                    navigate('/first-login');
                }
            } catch (error) {
                setMessage('Verification failed');
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
};

export default VerifyPage;
