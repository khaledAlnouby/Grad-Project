import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsPerson } from 'react-icons/bs';
import '../assets/styles/NotificationCard.css';

const NotificationCard = ({ notification }) => {
    const navigate = useNavigate();

    const handleProfileClick = (event) => {
        event.stopPropagation();
        navigate(`/profile/${notification.sender._id}`);
    };

    const handleManageRequestClick = (event) => {
        event.stopPropagation();
        navigate('/user-requests');
    };

    const handleChatClick = (event) => {
        event.stopPropagation();
        navigate(`/chat/${notification.chatId}`);
    };

    // Split the notification message
    const messageParts = notification.message.split('###');

    // Determine notification type
    const isSendRequestNotification = messageParts[2] === 'has requested to learn';
    const isUpdateRequestNotification = messageParts[0] === 'Your request to learn';
    const isChatNotification = messageParts[0] === 'You have a new message from';

    let firstName, lastName, textBeforeName, normalText, textBeforeSkill, skillName, status;

    if (isSendRequestNotification) {
        [firstName, lastName, textBeforeSkill, skillName, normalText] = messageParts;
    } else if (isUpdateRequestNotification) {
        [textBeforeSkill, skillName, , firstName, lastName, normalText, status] = messageParts;
    } else if (isChatNotification) {
        [textBeforeName, firstName, lastName, normalText] = messageParts;
    } else {
        // Handle unexpected notification format
        [firstName, lastName, textBeforeSkill, skillName, normalText, status] = ['Unknown', 'Unknown', '', '', '', ''];
    }

    return (
        <li className="notification-card" onClick={isChatNotification ? handleChatClick : undefined}>
            <div className="notification-header">
                <img src={notification.sender.profilePhoto} alt="Profile" className="notification-card-small-profile-img" />
                <button className="notification-profile-button" onClick={handleProfileClick}>
                    <BsPerson className="profile-icon" />
                </button>
            </div>
            <div className="notification-details">
                <p className="notification-message">
                    {isUpdateRequestNotification ? (
                        <>
                            <span className="text-before-skill bold-text">{textBeforeSkill}</span> <span className="skill-name bold-text">{skillName}</span> <span className="from bold-text">from</span> <span className="sender-name bold-text">{firstName} {lastName}</span> <span className="normalText bold-text">{normalText}</span> <span className="status bold-text">{status}</span>
                        </>
                    ) : isChatNotification ? (
                        <>
                            <span className="text-before-name bold-text">{textBeforeName}</span> <span className="sender-name bold-text">{firstName} {lastName}</span>
                            <br />
                            <span>{normalText}</span>
                        </>
                    ) : (
                        <>
                            <span className="sender-name bold-text">{firstName} {lastName}</span> <span className="text-before-skill bold-text">{textBeforeSkill}</span> <span className="skill-name bold-text">{skillName}</span>
                            <br />
                            <span>{normalText}</span>
                        </>
                    )}
                </p>
                <p className="notification-date">{new Date(notification.createdAt).toLocaleString()}</p>
                {isSendRequestNotification && (
                    <button className="manage-request-button" onClick={handleManageRequestClick}>
                        Manage Request
                    </button>
                )}
            </div>
        </li>
    );
};

export default NotificationCard;



/*
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsPerson } from 'react-icons/bs';
import '../assets/styles/NotificationCard.css'; // Import the CSS file for the NotificationCard

const NotificationCard = ({ notification }) => {
    const navigate = useNavigate();

    const handleProfileClick = (event) => {
        event.stopPropagation();
        navigate(`/profile/${notification.sender._id}`);
    };

    const handleManageRequestClick = (event) => {
        event.stopPropagation();
        navigate('/user-requests');
    };

    const [firstName, lastName, textBeforeSkill, skillName, normalText] = notification.message.split('###');

    return (
        <li className="notification-card">
            <div className="notification-header">
                <img src={notification.sender.profilePhoto} alt="Profile" className="small-profile-img" />
                <button className="notification-profile-button" onClick={handleProfileClick}>
                    <BsPerson className="profile-icon" />
                </button>
            </div>
            <div className="notification-details">
                <p className="notification-message">
                    <span className="sender-name bold-text">{firstName} {lastName}</span> <span className="text-before-skill bold-text">{textBeforeSkill}</span>  <span className="skill-name bold-text">{skillName}</span>
                    <br />
                    <span>{normalText}</span>
                </p>
                <p className="notification-date">{new Date(notification.createdAt).toLocaleString()}</p>
                {notification.message.includes("has requested to learn") && (
                    <button className="manage-request-button" onClick={handleManageRequestClick}>
                        Manage Request
                    </button>
                )}
            </div>
        </li>
    );
};

export default NotificationCard;
*/