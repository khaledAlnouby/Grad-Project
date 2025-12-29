// frontend/src/pages/SkillSearchPage.js
import React, { useState } from 'react';
import axios from 'axios';
import SkillSearchInput from '../components/SkillSearchInput';
import SkillSearchResults from '../components/SkillSearchResults';
import '../assets/styles/SkillSearchPage.css';

const SkillSearchPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async (skillName, gender, ageOrder) => {
        try {
            const token = sessionStorage.getItem('token');

            const response = await axios.get(`/api/skills/search/${skillName}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: { gender, ageOrder }
            });
            setUsers(response.data);
            setError('');
        } catch (err) {
            setError('Skill not found or server error');
            setUsers([]);
        }
    };

    return (
        <div className="skill-search-page">
            <h2>Learn a New Skill Now</h2>
            <SkillSearchInput onSearch={handleSearch} />
            <SkillSearchResults users={users} error={error} />
        </div>
    );
};

export default SkillSearchPage;
