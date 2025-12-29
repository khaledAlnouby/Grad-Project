// frontend/src/components/EducationalInfoForm.js
import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import '../assets/styles/style.css';

const EducationalInfoForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        universityName: '',
        facultyName: '',
        departmentName: '',
        graduatedYear: '',
        academicLevel: '',
        skillsToLearn: [],
        skillsToTeach: []
    });

    const [skillOptions, setSkillOptions] = useState([]);

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

    const handleInputChange = (inputValue) => {
        if (inputValue) {
            fetchSkills(inputValue);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'academicLevel' && value !== 'graduate') {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
                graduatedYear: ''
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSkillsChange = (name) => (selectedOptions) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: selectedOptions
        }));
    };

    const handleSkillCreate = async (inputValue, name) => {
        try {
            const response = await axios.post('http://localhost:5000/api/skills', { name: inputValue });
            const newSkill = { label: response.data.name, value: response.data._id };
            setSkillOptions(prevState => [...prevState, newSkill]);
            setFormData(prevState => ({
                ...prevState,
                [name]: [...prevState[name], newSkill]
            }));
        } catch (error) {
            console.error('Error creating skill:', error);
        }
    };

    const formatCreateLabel = (inputValue) => `Add "${inputValue}"`;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            skillsToLearn: formData.skillsToLearn.map(skill => ({ name: skill.label })),
            skillsToTeach: formData.skillsToTeach.map(skill => ({ name: skill.label }))
        });
    };

    return (
        <div className="main">
            <section className="signup">
                <div className="container">
                    <div className="signup-content">
                        <div className="signup-form">
                            <h2 className="form-title">2. Educational Information</h2>
                            <form method="POST" className="register-form" id="register-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="universityName"></label>
                                    <input
                                        type="text"
                                        name="universityName"
                                        id="universityName"
                                        placeholder="Enter your university name"
                                        value={formData.universityName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="facultyName"></label>
                                    <input
                                        type="text"
                                        name="facultyName"
                                        id="facultyName"
                                        placeholder="Enter your faculty name"
                                        value={formData.facultyName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="departmentName"></label>
                                    <input
                                        type="text"
                                        name="departmentName"
                                        id="departmentName"
                                        placeholder="Enter your department name"
                                        value={formData.departmentName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="academicLevel"></label>
                                    <select
                                        name="academicLevel"
                                        id="academicLevel"
                                        value={formData.academicLevel}
                                        onChange={handleChange}
                                    >
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
                                <div className="form-group">
                                    <label htmlFor="graduatedYear"></label>
                                    {formData.academicLevel === 'graduate' && (
                                        <input
                                            type="text"
                                            name="graduatedYear"
                                            id="graduatedYear"
                                            placeholder="Enter your graduated year"
                                            value={formData.graduatedYear}
                                            onChange={handleChange}
                                            required
                                        />
                                    )}
                                </div>
                                <div className="skills-list">
                                    <label htmlFor="skillsToLearn">Skills to Learn</label>
                                    <CreatableSelect
                                        isMulti
                                        onChange={handleSkillsChange('skillsToLearn')}
                                        onInputChange={handleInputChange}
                                        onCreateOption={(inputValue) => handleSkillCreate(inputValue, 'skillsToLearn')}
                                        options={skillOptions}
                                        value={formData.skillsToLearn}
                                        placeholder="Add skills to learn"
                                        formatCreateLabel={formatCreateLabel}
                                    />
                                </div>
                                <div className="form-group">
                                </div>
                                <div className="skills-list">
                                    <label htmlFor="skillsToTeach">Skills to Teach</label>
                                    <CreatableSelect
                                        isMulti
                                        onChange={handleSkillsChange('skillsToTeach')}
                                        onInputChange={handleInputChange}
                                        onCreateOption={(inputValue) => handleSkillCreate(inputValue, 'skillsToTeach')}
                                        options={skillOptions}
                                        value={formData.skillsToTeach}
                                        placeholder="Add skills to teach"
                                        formatCreateLabel={formatCreateLabel}
                                    />
                                </div>
                                <div className="form-group form-button">
                                    <button 
                                        type="submit"
                                        name="signup"
                                        id="signup"
                                        className="form-submit d-block mr-0 ml-auto"
                                    >
                                        Create Account
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

export default EducationalInfoForm;
