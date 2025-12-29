// Sidebar.js

import React from 'react';
import './Sidebar.css'; // Import your CSS file

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <img src="./PeerLearnLogo.png" alt="PeerLearn Logo" />
                <h2>PeerLearn</h2>
            </div>
            <ul className="sidebar-links">
                <li>
                    <a href="#">
                        <span className="material-symbols-outlined">home</span>
                        Home
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span className="material-symbols-outlined">account_circle</span>
                        Profile
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span className="material-symbols-outlined">message</span>
                        Messages
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span className="material-symbols-outlined">settings</span>
                        Settings
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span className="material-symbols-outlined">notifications</span>
                        Notifications
                    </a>
                </li>
                <li>
                    <a href="#">
                        <span className="material-symbols-outlined">logout</span>
                        Logout
                    </a>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
