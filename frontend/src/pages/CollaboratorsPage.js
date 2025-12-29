// frontend/src/pages/CollaboratorsPage.js
import React, { useState } from 'react';
import Collaborators from '../components/Collaborators';
import CollaborationRequests from '../components/CollaborationRequests';
import '../assets/styles/CollaboratorsPage.css';

const CollaboratorsPage = () => {
    const [activeTab, setActiveTab] = useState('collaborators');

    return (
        <div className="collaborators-page">
            <div className="tab-buttons">
                <button
                    className={`tab-button ${activeTab === 'collaborators' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collaborators')}
                >
                    Your collaborators
                </button>
                <button
                    className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    Collaboration requests
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'collaborators' && <Collaborators />}
                {activeTab === 'requests' && <CollaborationRequests />}
            </div>
        </div>
    );
};

export default CollaboratorsPage;
