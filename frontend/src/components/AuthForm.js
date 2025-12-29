// frontend/src/components/AuthForm.js
import React, { useState } from 'react';
import '../assets/styles/style.css';
import logo from '../assets/images/PeerLearnLogo.png';

const AuthForm = ({ onSubmit, buttonText }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        dob: '',
        password: '',
        confirmPassword: '',
        terms: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (buttonText === 'Create account') {
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match");
                return;
            }
            if (!formData.terms) {
                alert("You must agree to the terms of service");
                return;
            }
        }
        onSubmit(formData);
    };

    return (
        <div className="main">
            <section className={buttonText === 'Create account' ? "signup" : "sign-in"}>
                <div className="container">
                    <div className="signup-content">
                        <div className="signup-image">
                            <figure><img src={logo} alt="sign up" /></figure>
                            <a href={buttonText === 'Create account' ? "/login" : "/register"} className="signup-image-link">
                                {buttonText === 'Create account' ? "I am already a member" : "Create an account"}
                            </a>
                        </div>
                        <div className="signup-form">
                            <h3 className="form-title">{buttonText}</h3>
                            <form onSubmit={handleSubmit} className="register-form" id="register-form">
                                {buttonText === 'Create account' && (
                                    <>
                                        <div className="form-group name-group">
                                            <div className="form-group-half">
                                                <label htmlFor="firstName"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    id="firstName"
                                                    placeholder="First Name"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group-half">
                                                <label htmlFor="lastName"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    id="lastName"
                                                    placeholder="Last Name"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email"><i className="zmdi zmdi-email"></i></label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                placeholder="Your Email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="dateOfBirth"><i className="zmdi zmdi-calendar"></i></label>
                                            <input
                                                type="date"
                                                name="dob"
                                                id="dateOfBirth"
                                                placeholder="Date of Birth"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="form-group">
                                    <label htmlFor="username"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="pass"><i className="zmdi zmdi-lock"></i></label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="pass"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {buttonText === 'Create account' && (
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="re_pass"><i className="zmdi zmdi-lock-outline"></i></label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                id="re_pass"
                                                placeholder="Repeat your password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="checkbox"
                                                name="terms"
                                                id="agree_term"
                                                className="agree-term"
                                                checked={formData.terms}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="agree_term" className="label-agree-term">
                                                <span><span></span></span>
                                                I agree all statements in <a href="/term-service" className="term-service">Terms of service</a>
                                            </label>
                                        </div>
                                    </>
                                )}
                                <div className="form-group form-button">
                                    <input
                                        type="submit"
                                        name={buttonText === 'Create account' ? "signup" : "signin"}
                                        id={buttonText === 'Create account' ? "signup" : "signin"}
                                        className="form-submit"
                                        value={buttonText}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AuthForm;
