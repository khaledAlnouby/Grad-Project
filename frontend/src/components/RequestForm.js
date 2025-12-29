// frontend/src/components/RequestForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../assets/styles/RequestForm.css';

const RequestForm = ({ user }) => {
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        try {
            const response = await axios.post('/api/requests/send', {
                receiverId: user._id,
                message
            }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            if (response.status === 201) {
                setSuccess(true);
                setMessage('');
            }
        } catch (error) {
            console.error('Error sending request:', error);
            if (error.response && error.response.status === 400) {
                setError(error.response.data.message);
            } else {
                setError('Error sending request. Please try again.');
            }
        }
    };

    return (
        <form className="request-form" onSubmit={handleSubmit}>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your request message..."
                required
            />
            <button type="submit">Send Request</button>
            {success && <p>Request sent successfully!</p>}
            {error && <p className="error">{error}</p>}
        </form>
    );
};

export default RequestForm;
