// frontend/src/components/PersonalInfoForm.js
import React, { useState } from 'react';
import { Country, State, City } from 'country-state-city';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import '../assets/styles/style.css';

const PersonalInfoForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        phoneNumber: '',
        country: '',
        state: '',
        gender: ''
    });

    const handleChange = (value) => {
        setFormData(prevState => ({
            ...prevState,
            phoneNumber: value
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCountryChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            country: e.target.value,
            state: '',
            city: ''
        }));
    };

    const handleStateChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            state: e.target.value,
            city: ''
        }));
    };

    const handleCityChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            city: e.target.value
        }));
    };

    const handleGenderChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            gender: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const countries = Country.getAllCountries();
    const states = formData.country ? State.getStatesOfCountry(formData.country) : [];
    const cities = formData.state ? City.getCitiesOfState(formData.country, formData.state) : [];

    return (
        <div className="main">
            <section className="signup">
                <div className="container">
                    <div className="signup-content">
                        <div className="signup-form">
                            <h2 className="form-title">1. Personal Information</h2>
                            <form method="POST" className="register-form" id="register-form" onSubmit={handleSubmit}>
                                <div className="form-group try">
                                    <label htmlFor="phone_number">Phone Number</label>
                                    <PhoneInput
                                        country={'us'} // Default country
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        inputProps={{
                                            name: 'phoneNumber',
                                            id: 'phone_number',
                                            placeholder: 'Phone Number'
                                        }}
                                        containerClass="phone-input-container"
                                        dropdownClass="phone-dropdown"
                                        buttonClass="phone-button"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="country">Country</label>
                                    <select
                                        name="country"
                                        id="country"
                                        value={formData.country}
                                        onChange={handleCountryChange}
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((country) => (
                                            <option key={country.isoCode} value={country.isoCode}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <select
                                        name="state"
                                        id="state"
                                        value={formData.state}
                                        onChange={handleStateChange}
                                    >
                                        <option value="">Select State</option>
                                        {states.map((state) => (
                                            <option key={state.isoCode} value={state.isoCode}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="gender">Gender <span style={{ color: 'red' }}>*</span></label>
                                    <select
                                        name="gender"
                                        id="gender"
                                        value={formData.gender}
                                        onChange={handleGenderChange}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group form-button">
                                    <button 
                                        type="submit"
                                        name="signup"
                                        id="signup"
                                        className="form-submit d-block mr-0 ml-auto"
                                    >
                                        Next
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PersonalInfoForm;

