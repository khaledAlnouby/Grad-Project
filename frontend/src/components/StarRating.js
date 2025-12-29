import React from 'react';
import PropTypes from 'prop-types';
import '../assets/styles/StarRating.css'; // Import the CSS file for styling

const StarRating = ({ rating, onRatingChange }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="star-rating">
            {stars.map((star) => (
                <span
                    key={star}
                    className={star <= rating ? 'star filled' : 'star'}
                    onClick={() => onRatingChange(star)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
    onRatingChange: PropTypes.func.isRequired,
};

export default StarRating;
