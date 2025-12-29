// frontend/src/components/ProfileCard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaUserCircle } from 'react-icons/fa';
import RequestForm from './RequestForm';
import StarRating from './StarRating';
import '../assets/styles/ProfileCard.css';

const ProfileCard = ({ user }) => {
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isOnline] = useState(user.isOnline || false);

    const handleChatRedirect = (event) => {
        event.stopPropagation();
        setIsFormOpen(!isFormOpen);
    };

    const handleProfileRedirect = (event) => {
        event.stopPropagation();
        navigate(`/profile/${user._id}`);
    };

    return (
        <div className="profile-card">
            <div className="profile-card-icon-container">
                <FaEnvelope 
                    className="profile-card-request-icon" 
                    onClick={handleChatRedirect}
                    title="Send Message"
                />
                <FaUserCircle 
                    className="profile-card-user-icon" 
                    onClick={handleProfileRedirect}
                    title="View Profile"
                />
            </div>
            <div className="profile-card-header">
                <div className="profile-card-photo-container">
                    <img src={user.profilePhoto} alt="Profile" className="profile-card-small-img" />
                    <div className={`profile-card-online-status-indicator ${isOnline ? 'profile-card-online' : 'profile-card-offline'}`}></div>
                </div>
            </div>
            <div className="profile-card-details">
                <h3>{user.firstName} {user.lastName}</h3>
                <p className="profile-card-age"><strong>Age:</strong> {user.age}</p>
                <p className="profile-card-gender"><strong>Gender:</strong> {user.gender}</p>
                <div className="profile-card-average-rating">
                    <strong>Average Rating:</strong> <StarRating rating={user.averageRating} onRatingChange={() => {}} />
                </div>
                <div className="profile-card-skills">
                    {user.skillsToTeach.map(skill => (
                        <span key={skill._id} className="profile-card-skill">{skill.name}</span>
                    ))}
                </div>
                
                {isFormOpen && <RequestForm user={user} />}
            </div>
        </div>
    );
};

export default ProfileCard;
