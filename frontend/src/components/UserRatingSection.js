// frontend/src/components/UserRatingSection.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import StarRating from './StarRating';
import '../assets/styles/UserRatingSection.css';

const UserRatingSection = ({ toUser, fromUser }) => {
    const [score, setScore] = useState(1);
    const [comment, setComment] = useState('');
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const token = sessionStorage.getItem('token');
    const carouselRef = useRef(null);

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
            fetchRatings();
            fetchAverageRating();
            setScore(1);
            setComment('');
        } catch (error) {
            console.error('Error submitting rating', error);
        }
    };

    const fetchRatings = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/ratings/${toUser}`);
            setRatings(response.data);
        } catch (error) {
            console.error('Error fetching ratings', error);
        }
    };

    const fetchAverageRating = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/ratings/average/${toUser}`);
            setAverageRating(response.data.averageRating);
        } catch (error) {
            console.error('Error fetching average rating', error);
        }
    };

    useEffect(() => {
        fetchRatings();
        fetchAverageRating();
    }, [toUser]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused) {
                setCurrentIndex(prevIndex => (prevIndex + 1) % ratings.length);
            }
        }, 3000); // Change slide every 3 seconds
        return () => clearInterval(interval);
    }, [ratings, isPaused]);

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + ratings.length) % ratings.length);
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ratings.length);
    };

    const renderRatings = () => {
        return ratings.length > 0 ? (
            ratings.map((rating, index) => (
                <li
                    key={rating._id}
                    className={`rating-item ${index === currentIndex ? 'active' : ''}`}
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="rating-detail rating-score">Score: <StarRating rating={rating.score} onRatingChange={() => {}} /></div>
                    <div className="rating-detail rating-comment">Comment: {rating.comment}</div>
                    <div className="rating-detail rating-from">From: {rating.fromUser.firstName} {rating.fromUser.lastName}</div>
                </li>
            ))
        ) : (
            <p className="rating-no-ratings">No ratings yet.</p>
        );
    };

    return (
        <div className="user-rating-section">
            <section className="rating-form-section">
                <div className="rating-container">
                    <div className="rating-content">
                        <div className="rating-form-container">
                            <h2 className="rating-form-title">Rate User</h2>
                            <form onSubmit={handleSubmit} className="rating-form">
                                <div className="rating-form-group">
                                    <h3>Score:</h3>
                                    <StarRating rating={score} onRatingChange={setScore} />
                                </div>
                                <div className="rating-form-group">
                                    <h3>Comment:</h3>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="rating-textarea rating-textarea-comment"
                                    />
                                </div>
                                <button type="submit" className="rating-button rating-button-submit">Submit Rating</button>
                            </form>
                        </div>

                        <div className="ratings-list-container">
                            <h3 className="ratings-title">User Ratings</h3>
                            <div className="carousel-frame">
                                <div className="carousel" ref={carouselRef}>
                                    <ul className="ratings-list">
                                        {renderRatings()}
                                    </ul>
                                </div>
                                <button className="carousel-button left" onClick={handlePrevClick}>‹</button>
                                <button className="carousel-button right" onClick={handleNextClick}>›</button>
                            </div>
                            <h3 className="average-rating-title">Average Rating: <StarRating rating={averageRating} onRatingChange={() => {}} /></h3>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UserRatingSection;
