// frontend/src/components/SkillSearchResults.js
import React from 'react';
import ProfileCard from './ProfileCard';

const SkillSearchResults = ({ users, error }) => {
    return (
        <div>
            {error && <p>{error}</p>}
            {users.length > 0 && (
                <div>
                    {users.map(user => (
                        <ProfileCard key={user._id} user={user} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SkillSearchResults;