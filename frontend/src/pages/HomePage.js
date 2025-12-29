// frontend/src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/HomePage.css';
import PeerLearnLogo from '../assets/images/PeerLearnLogo.png'; // Ensure the path to the image is correct

const HomePage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/register');
    };

    return (
        <div>
            <section className="hero">
                <div className="hero-container">
                    <div className="column-left">
                        <h1>Welcome to PeerLearn</h1>
                        <p className="hip">
                            Join us to learn together and grow together. No hidden fees, only knowledge.
                        </p>
                        <button onClick={handleGetStarted}>Get Started</button>
                    </div>
                    <div className="column-right">
                        <img src={PeerLearnLogo} alt="illustration" className="hero-image" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
