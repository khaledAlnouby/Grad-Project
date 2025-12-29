// frontend/src/components/SkillSearchInput.js
import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import '../assets/styles/SkillSearchInput.css';

const SkillSearchInput = ({ onSearch }) => {
    const [skillName, setSkillName] = useState('');
    const [gender, setGender] = useState('');
    const [ageOrder, setAgeOrder] = useState('');

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSkillName(term);
        onSearch(term, gender, ageOrder);
    };

    const handleButtonClick = () => {
        onSearch(skillName, gender, ageOrder);
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
        onSearch(skillName, e.target.value, ageOrder);
    };

    const handleAgeOrderChange = (e) => {
        setAgeOrder(e.target.value);
        onSearch(skillName, gender, e.target.value);
    };

    return (
        <div className="search-bar">
            <BsSearch className="search-icon" />
            <input
                type="text"
                value={skillName}
                onChange={handleSearchChange}
                placeholder="Search by skills..."
            />
            <select value={gender} onChange={handleGenderChange}>
                <option value="">All</option>
                <option value="male">Gender: male</option>
                <option value="female">Gender: female</option>
                <option value="other">Gender: other</option>
            </select>
            <select value={ageOrder} onChange={handleAgeOrderChange}>
                <option value="">Sort by Age</option>
                <option value="asc">Age: ascending</option>
                <option value="desc">Age: descending</option>
            </select>
            <button onClick={handleButtonClick}>Search</button>
        </div>
    );
};

export default SkillSearchInput;
