// frontend/src/components/UserRatings.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserRatings = ({ userId }) => {
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/ratings/${userId}`);
                setRatings(response.data);
            } catch (error) {
                console.error('Error fetching ratings', error);
            }
        };

        fetchRatings();
    }, [userId]);

    return (
        <div>
            <h3>User Ratings</h3>
            {ratings.length > 0 ? (
                <ul>
                    {ratings.map((rating) => (
                        <li key={rating._id}>
                            <p>Score: {rating.score}</p>
                            <p>Comment: {rating.comment}</p>
                            <p>From: {rating.fromUser.firstName}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No ratings yet.</p>
            )}
        </div>
    );
};

export default UserRatings;
