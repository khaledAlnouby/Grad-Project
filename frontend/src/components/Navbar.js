// frontend/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/ProfileCard.css';
import PeerLearnLogo from '../assets/images/PeerLearnLogo.png';
import { useNotifications } from '../context/NotificationContext';
import { FiBell } from 'react-icons/fi';

const Navbar = () => {
    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();
    const { unreadCount, resetNotifications } = useNotifications();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.ok) {
                sessionStorage.removeItem('token');
                navigate('/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Server error during logout:', error);
        }
    };

    return (
        <nav>
            <div className="logo">
                <Link to="/">
                    <img src={PeerLearnLogo} alt="logo" className="small-logo" />
                </Link>
            </div>
            <div className="nav-items">
                <Link to="/search-skill">Learn a Skill</Link>
                {!token ? (
                    <>
                        <Link to="/login">Login</Link>
                    </>
                ) : (
                    <>
                        <Link to="/profile">Profile</Link>
                        <Link to="/notifications" onClick={resetNotifications}>
                            <FiBell />
                            {unreadCount > 0 && (
                                <span className="notification-count">{unreadCount}</span>
                            )}
                        </Link>
                        <Link to="/collaborators">Collaborators</Link>
                        <Link to="/chats">Chats</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;