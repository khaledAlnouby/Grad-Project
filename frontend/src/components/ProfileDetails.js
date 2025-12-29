// frontend/src/components/ProfileDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import { Country, State, City } from 'country-state-city';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import '../assets/styles/style.css';

const ProfileDetails = ({ profile }) => {

    // Basic Info State
    const [basicInfo, setBasicInfo] = useState({
        email: profile.email || '',
    });

    // Personal Info State
    const [personalInfo, setPersonalInfo] = useState({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phoneNumber: profile.phoneNumber || '',
        age: profile.age || '',
        country: profile.country || '',
        state: profile.state || '',
        city: profile.city || '',
        gender: profile.gender || '',
        dob: profile.dob || '',
    });

    // Educational Info State
    const [educationalInfo, setEducationalInfo] = useState({
        universityName: profile.universityName || '',
        facultyName: profile.facultyName || '',
        departmentName: profile.departmentName || '',
        academicLevel: profile.academicLevel || '',
        graduatedYear: profile.graduatedYear || '',
        skillsToLearn: profile.skillsToLearn.map(skill => ({ label: skill.name, value: skill._id })) || [],
        skillsToTeach: profile.skillsToTeach.map(skill => ({ label: skill.name, value: skill._id })) || [],
    });

    // Profile Photos State
    const [photos, setPhotos] = useState({
        profilePhoto: profile.profilePhoto || null,
        coverPhoto: profile.coverPhoto || null,
    });

    // Skill Options State
    const [skillOptions, setSkillOptions] = useState([]);
    
    const [isOnline] = useState(profile.isOnline || false);

    // Fetch Skills from Backend
    const fetchSkills = async (query) => {
        try {
            const response = await axios.get('http://localhost:5000/api/skills/suggestions', {
                params: { query }
            });
            setSkillOptions(response.data.map(skill => ({ label: skill.name, value: skill._id })));
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    // Fetch Skills on Component Mount
    useEffect(() => {
        fetchSkills('');
    }, []);

    // Handle Basic Info Change
    const handleBasicInfoChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo(prevBasicInfo => ({ ...prevBasicInfo, [name]: value }));
    };

    // Handle Personal Info Change
    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo(prevPersonalInfo => ({ ...prevPersonalInfo, [name]: value }));
    };

    // Handle Educational Info Change
    const handleEducationalInfoChange = (e) => {
        const { name, value } = e.target;
        setEducationalInfo(prevEducationalInfo => ({ ...prevEducationalInfo, [name]: value }));
    };

    // Handle Skills to Learn Change
    const handleSkillsToLearnChange = (selectedOptions) => {
        setEducationalInfo(prevEducationalInfo => ({ ...prevEducationalInfo, skillsToLearn: selectedOptions }));
    };

    // Handle Skills to Teach Change
    const handleSkillsToTeachChange = (selectedOptions) => {
        setEducationalInfo(prevEducationalInfo => ({ ...prevEducationalInfo, skillsToTeach: selectedOptions }));
    };

    // Handle Skill Create
    const handleSkillCreate = async (inputValue, name) => {
        try {
            const response = await axios.post('http://localhost:5000/api/skills', { name: inputValue });
            const newSkill = { label: response.data.name, value: response.data._id };
            setSkillOptions(prevState => [...prevState, newSkill]);
            setEducationalInfo(prevState => ({
                ...prevState,
                [name]: [...prevState[name], newSkill]
            }));
        } catch (error) {
            console.error('Error creating skill:', error);
        }
    };

    const formatCreateLabel = (inputValue) => `Add "${inputValue}"`;

    // Handle Photo Change and Upload
    const handlePhotoChange = async (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const formData = new FormData();
            formData.append(name, files[0]);

            try {
                const response = await axios.put(`http://localhost:5000/api/user/${name}`, formData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                setPhotos(prevPhotos => ({ ...prevPhotos, [name]: response.data.user[name] }));
                console.log(`${name} updated successfully`);
            } catch (error) {
                console.error(`Error updating ${name}:`, error);
            }
        }
    };

    // Programmatically click the file input
    const handlePhotoClick = (inputId) => {
        document.getElementById(inputId).click();
    };

    // Handle Country Change
    const handleCountryChange = (e) => {
        const country = e.target.value;
        setPersonalInfo(prevPersonalInfo => ({
            ...prevPersonalInfo,
            country,
            state: '',
            city: ''
        }));
    };

    // Handle State Change
    const handleStateChange = (e) => {
        const state = e.target.value;
        setPersonalInfo(prevPersonalInfo => ({
            ...prevPersonalInfo,
            state,
            city: ''
        }));
    };

    // Render States and Cities Based on Country and State
    const countries = Country.getAllCountries();
    const states = personalInfo.country ? State.getStatesOfCountry(personalInfo.country) : [];
    const cities = personalInfo.state ? City.getCitiesOfState(personalInfo.country, personalInfo.state) : [];

    // Handle Combined Submit
    const handleCombinedSubmit = async (e) => {
        e.preventDefault();

        try {
            // Update Basic Info
            await axios.put('http://localhost:5000/api/user/basic', basicInfo, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            // Update Personal Info
            await axios.put('http://localhost:5000/api/user/personal', personalInfo, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            // Update Educational Info
            await axios.put('http://localhost:5000/api/user/educational', {
                ...educationalInfo,
                skillsToLearn: educationalInfo.skillsToLearn.map(skill => ({ name: skill.label })),
                skillsToTeach: educationalInfo.skillsToTeach.map(skill => ({ name: skill.label }))
            }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            console.log('All information updated successfully');
        } catch (error) {
            console.error('Error updating information:', error);
        }
    };

    return (
        <div className="main">
                <section className="signup">
                    <div className="container">
                        <div className="signup-content">
                            <div className="signup-form">
                                {/* Profile Photos */}
                                <div className="cover-photo-container" onClick={() => handlePhotoClick('coverPhoto')}>
                                    {photos.coverPhoto && (
                                        <img src={`http://localhost:5000/${photos.coverPhoto}`} alt="Cover" />
                                    )}
                                    <label htmlFor="coverPhoto" className="photo-upload-label">Upload Cover Photo</label>
                                    <input type="file" name="coverPhoto" id="coverPhoto" className="cover-photo-input" onChange={handlePhotoChange} />
                                </div>
                                <div className="profile-photo-container" onClick={() => handlePhotoClick('profilePhoto')}>
                                    <div className="profile-photo-inner">
                                        {photos.profilePhoto && (
                                            <img src={`http://localhost:5000/${photos.profilePhoto}`} alt="Profile" />
                                        )}
                                    </div>
                                    <input type="file" name="profilePhoto" id="profilePhoto" className="profile-photo-input" onChange={handlePhotoChange} />
                                    <div 
                                        className={`online-status-indicator ${isOnline ? 'online' : 'offline'}`} 
                                    ></div>
                                </div>
                                {/* Basic Information */}
                                <h2 className="form-title">Basic Information</h2>
                                <div className="register-form">
                                    <div className="form-group">
                                        <label htmlFor="email">Email:</label>
                                        <input type="email" name="email" id="email" value={basicInfo.email} onChange={handleBasicInfoChange} required />
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <h2 className="form-title">Personal Information</h2>
                                <div className="register-form">
                                    <div className="form-group">
                                        <label htmlFor="firstName">First Name:</label>
                                        <input type="text" name="firstName" id="firstName" value={personalInfo.firstName} onChange={handlePersonalInfoChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastName">Last Name:</label>
                                        <input type="text" name="lastName" id="lastName" value={personalInfo.lastName} onChange={handlePersonalInfoChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">Phone Number:</label>
                                        <PhoneInput
                                            country={'us'}
                                            value={personalInfo.phoneNumber}
                                            onChange={(value) => setPersonalInfo(prevPersonalInfo => ({ ...prevPersonalInfo, phoneNumber: value }))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="age">Age:</label>
                                        <input type="number" name="age" id="age" value={personalInfo.age} onChange={handlePersonalInfoChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="dob">Date of Birth:</label>
                                        <input type="date" name="dob" id="dob" value={personalInfo.dob} onChange={handlePersonalInfoChange} required />  {/* Added dob input */}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="country">Country:</label>
                                        <select name="country" id="country" value={personalInfo.country} onChange={handleCountryChange}>
                                            <option value="">Select Country</option>
                                            {countries.map(country => (
                                                <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="state">State:</label>
                                        <select name="state" id="state" value={personalInfo.state} onChange={handleStateChange}>
                                            <option value="">Select State</option>
                                            {states.map(state => (
                                                <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="city">City:</label>
                                        <select name="city" id="city" value={personalInfo.city} onChange={(e) => setPersonalInfo(prevPersonalInfo => ({ ...prevPersonalInfo, city: e.target.value }))}>
                                            <option value="">Select City</option>
                                            {cities.map(city => (
                                                <option key={city.name} value={city.name}>{city.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="gender">Gender:</label>
                                        <select name="gender" id="gender" value={personalInfo.gender} onChange={handlePersonalInfoChange}>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Educational Information */}
                                <h2 className="form-title">Educational Information</h2>
                                <div className="register-form">
                                    <div className="form-group">
                                        <label htmlFor="universityName">University Name:</label>
                                        <input type="text" name="universityName" id="universityName" value={educationalInfo.universityName} onChange={handleEducationalInfoChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="facultyName">Faculty Name:</label>
                                        <input type="text" name="facultyName" id="facultyName" value={educationalInfo.facultyName} onChange={handleEducationalInfoChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="departmentName">Department Name:</label>
                                        <input type="text" name="departmentName" id="departmentName" value={educationalInfo.departmentName} onChange={handleEducationalInfoChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="academicLevel">Academic Level:</label>
                                        <select name="academicLevel" id="academicLevel" value={educationalInfo.academicLevel} onChange={handleEducationalInfoChange} required>
                                            <option value="" disabled>Select Academic Level</option>
                                            <option value="firstLevel">First Level</option>
                                            <option value="secondLevel">Second Level</option>
                                            <option value="thirdLevel">Third Level</option>
                                            <option value="fourthLevel">Fourth Level</option>
                                            <option value="fifthLevel">Fifth Level</option>
                                            <option value="sixthLevel">Sixth Level</option>
                                            <option value="seventhLevel">Seventh Level</option>
                                            <option value="graduate">Graduate</option>
                                        </select>
                                    </div>
                                    {educationalInfo.academicLevel === 'graduate' && (
                                        <div className="form-group">
                                            <label htmlFor="graduatedYear">Graduated Year:</label>
                                            <input type="number" name="graduatedYear" id="graduatedYear" value={educationalInfo.graduatedYear} onChange={handleEducationalInfoChange} required />
                                        </div>
                                    )}
                                    <div className="skills-list">
                                        <label htmlFor="skillsToLearn">Skills to Learn:</label>
                                        <CreatableSelect
                                            isMulti
                                            onChange={handleSkillsToLearnChange}
                                            onCreateOption={(inputValue) => handleSkillCreate(inputValue, 'skillsToLearn')}
                                            options={skillOptions}
                                            value={educationalInfo.skillsToLearn}
                                            placeholder="Add skills to learn"
                                            formatCreateLabel={formatCreateLabel}
                                        />
                                    </div>
                                    <div className="form-group">
                                    </div>
                                    <div className="skills-list">
                                        <label htmlFor="skillsToTeach">Skills to Teach:</label>
                                        <CreatableSelect
                                            isMulti
                                            onChange={handleSkillsToTeachChange}
                                            onCreateOption={(inputValue) => handleSkillCreate(inputValue, 'skillsToTeach')}
                                            options={skillOptions}
                                            value={educationalInfo.skillsToTeach}
                                            placeholder="Add skills to teach"
                                            formatCreateLabel={formatCreateLabel}
                                        />
                                    </div>
                                </div>

                                {/* Combined Update Button */}
                                <div className="form-group form-button">
                                    <button onClick={handleCombinedSubmit} className="form-submit d-block mr-0 ml-auto">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
        </div>
    );
};

export default ProfileDetails;
