// frontend/src/components/RatingForm.js
import React, { useState } from 'react';
import axios from 'axios';

const RatingForm = ({ toUser, fromUser, onRatingSubmit }) => {
    const [score, setScore] = useState(1);
    const [comment, setComment] = useState('');
    
    // Retrieve the token from session storage
    const token = sessionStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/ratings/rate', 
            {
                toUser,
                fromUser,
                score,
                comment,
            }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onRatingSubmit();
        } catch (error) {
            console.error('Error submitting rating', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Score:
                <input 
                    type="number" 
                    value={score} 
                    onChange={(e) => setScore(e.target.value)} 
                    min="1" 
                    max="5" 
                />
            </label>
            <label>
                Comment:
                <textarea 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                />
            </label>
            <button type="submit">Submit Rating</button>
        </form>
    );
};

export default RatingForm;
