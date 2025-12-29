// frontend/src/components/Footer.js
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../assets/styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h5>PeerLearn</h5>
                    <p>Your go-to platform for skill learning and peer collaboration.</p>
                </div>
                <div className="footer-section">
                    <h5>Navigation</h5>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/search-skill">Search Skill</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h5>Follow Us</h5>
                    <div className="social-icons">
                        <a href="https://facebook.com" className="social-icon"><FaFacebook size={24} /></a>
                        <a href="https://twitter.com" className="social-icon"><FaTwitter size={24} /></a>
                        <a href="https://instagram.com" className="social-icon"><FaInstagram size={24} /></a>
                        <a href="https://linkedin.com" className="social-icon"><FaLinkedin size={24} /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 PeerLearn. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;