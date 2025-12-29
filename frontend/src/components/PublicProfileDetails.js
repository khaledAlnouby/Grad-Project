// frontend/src/components/PublicProfileDetails.js
import React from 'react';
import { Country, State, City } from 'country-state-city';
import '../assets/styles/style.css';

const PublicProfileDetails = ({ profile }) => {
    // Extract profile information
    const {
        email,
        firstName,
        lastName,
        phoneNumber,
        age,
        country,
        state,
        city,
        gender,
        universityName,
        facultyName,
        departmentName,
        academicLevel,
        graduatedYear,
        skillsToLearn,
        skillsToTeach,
        profilePhoto,
        coverPhoto,
        isOnline,
    } = profile;

    // Get country, state, and city names
    const countryName = country ? Country.getCountryByCode(country)?.name : '';
    const stateName = state ? State.getStateByCodeAndCountry(state, country)?.name : '';
    const cityName = city ? City.getCitiesOfState(country, state).find(c => c.name === city)?.name : '';

    return (
        <div className="main">
            <section className="signup">
                <div className="container">
                    <div className="signup-content">
                        <div className="signup-form">
                            {/* Profile Photos */}
                            <div className="cover-photo-container">
                                {coverPhoto && (
                                    <img src={`http://localhost:5000/${coverPhoto}`} alt="Cover" />
                                )}
                            </div>
                            <div className="profile-photo-container">
                                <div className="profile-photo-inner">
                                    {profilePhoto && (
                                        <img src={`http://localhost:5000/${profilePhoto}`} alt="Profile" />
                                    )}
                                </div>
                                <div
                                    className={`online-status-indicator ${isOnline ? 'online' : 'offline'}`}
                                ></div>
                            </div>

                            {/* Basic Information */}
                            <h2 className="form-title">Basic Information</h2>
                            <div className="register-form">
                                <div className="form-group">
                                    <label>Email:</label>
                                    <p>{email}</p>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <h2 className="form-title">Personal Information</h2>
                            <div className="register-form">
                                <div className="form-group">
                                    <label>First Name:</label>
                                    <p>{firstName}</p>
                                </div>
                                <div className="form-group">
                                    <label>Last Name:</label>
                                    <p>{lastName}</p>
                                </div>
                                <div className="form-group">
                                    <label>Phone Number:</label>
                                    <p>{phoneNumber}</p>
                                </div>
                                <div className="form-group">
                                    <label>Age:</label>
                                    <p>{age}</p>
                                </div>
                                <div className="form-group">
                                    <label>Country:</label>
                                    <p>{countryName}</p>
                                </div>
                                <div className="form-group">
                                    <label>State:</label>
                                    <p>{stateName}</p>
                                </div>
                                <div className="form-group">
                                    <label>City:</label>
                                    <p>{cityName}</p>
                                </div>
                                <div className="form-group">
                                    <label>Gender:</label>
                                    <p>{gender}</p>
                                </div>
                            </div>

                            {/* Educational Information */}
                            <h2 className="form-title">Educational Information</h2>
                            <div className="register-form">
                                <div className="form-group">
                                    <label>University Name:</label>
                                    <p>{universityName}</p>
                                </div>
                                <div className="form-group">
                                    <label>Faculty Name:</label>
                                    <p>{facultyName}</p>
                                </div>
                                <div className="form-group">
                                    <label>Department Name:</label>
                                    <p>{departmentName}</p>
                                </div>
                                <div className="form-group">
                                    <label>Academic Level:</label>
                                    <p>{academicLevel}</p>
                                </div>
                                {academicLevel === 'graduate' && (
                                    <div className="form-group">
                                        <label>Graduated Year:</label>
                                        <p>{graduatedYear}</p>
                                    </div>
                                )}
                                <div className="skills-list">
                                    <label>Skills to Learn:</label>
                                    <ul>
                                        {skillsToLearn.map(skill => (
                                            <li key={skill._id}>{skill.name}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="skills-list">
                                    <label>Skills to Teach:</label>
                                    <ul>
                                        {skillsToTeach.map(skill => (
                                            <li key={skill._id}>{skill.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PublicProfileDetails;
