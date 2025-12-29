// frontend/src/components/Collaborators.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaUserCircle, FaEllipsisH, FaTimes, FaBan } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ChatRoom from './ChatRoom';
import CustomConfirmDialog from './ConfirmDialog';
import '../assets/styles/Collaborators.css';

const Collaborators = () => {
    const [collaborators, setCollaborators] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/collaborators', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                setCollaborators(response.data);
            } catch (error) {
                console.error('Error fetching collaborators:', error);
            }
        };

        fetchCollaborators();
    }, []);

    const handleChatRedirect = async (collaboratorId) => {
        try {
            const response = await axios.post('http://localhost:5000/api/chat/start', {
                receiverId: collaboratorId
            }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            const chatId = response.data._id;
            console.log('Chat ID:', chatId);
            setActiveChatId(chatId);
            navigate(`/chats?chatId=${chatId}`);
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    };

    const handleProfileRedirect = (collaboratorId) => {
        navigate(`/profile/${collaboratorId}`);
    };

    const confirmEndCollaboration = (collaboratorId, firstName, lastName) => {
        confirmAlert({
            customUI: ({ onClose }) => (
                <CustomConfirmDialog
                    title="Confirm to End Collaboration"
                    message={`Are you sure you want to end this collaboration with ${firstName} ${lastName}?`}
                    onConfirm={() => {
                        handleEndCollaboration(collaboratorId);
                        onClose();
                    }}
                    onCancel={onClose}
                />
            )
        });
    };

    const handleEndCollaboration = async (collaboratorId) => {
        try {
            await axios.post('http://localhost:5000/api/requests/end-collaboration', {
                collaboratorId
            }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setCollaborators(collaborators.filter(c => c._id !== collaboratorId));
        } catch (error) {
            console.error('Error ending collaboration:', error);
        }
    };

    const confirmBlockUser = (collaboratorId, firstName, lastName) => {
        confirmAlert({
            customUI: ({ onClose }) => (
                <CustomConfirmDialog
                    title="Confirm to Block User"
                    message={`Are you sure you want to block ${firstName} ${lastName}?`}
                    onConfirm={() => {
                        handleBlockUser(collaboratorId);
                        onClose();
                    }}
                    onCancel={onClose}
                />
            )
        });
    };

    const handleBlockUser = async (collaboratorId) => {
        try {
            await axios.post('http://localhost:5000/api/requests/block', {
                userId: collaboratorId
            }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setCollaborators(collaborators.filter(c => c._id !== collaboratorId));
        } catch (error) {
            console.error('Error blocking user:', error);
        }
    };

    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (index) => {
        if (activeDropdown === index) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(index);
        }
    };

    return (
        <div className="collaborators-page">
            <ul className="collaborators-list">
                {collaborators.map((collaborator, index) => (
                    <React.Fragment key={collaborator._id}>
                        {index > 0 && <hr className="separator" />}
                        <li className="collaborator-item">
                            <img src={collaborator.profilePhoto} alt={`${collaborator.firstName} ${collaborator.lastName}`} className="profile-photo" />
                            <div className="collaborator-info">
                                <div className="collaborator-name">{collaborator.firstName} {collaborator.lastName}</div>
                                <div className="icon-container">
                                    <FaEnvelope 
                                        className="send-message-icon" 
                                        onClick={() => handleChatRedirect(collaborator._id)} 
                                        title="Send Message"
                                    />
                                    <FaUserCircle 
                                        className="collaborator-profile-icon" 
                                        onClick={() => handleProfileRedirect(collaborator._id)} 
                                        title="View Profile"
                                    />
                                    <div className="dropdown">
                                        <FaEllipsisH 
                                            className="dropdown-icon" 
                                            onClick={() => toggleDropdown(index)} 
                                            title="More Options"
                                        />
                                        {activeDropdown === index && (
                                            <div className="dropdown-menu">
                                                <div className="dropdown-item" onClick={() => confirmEndCollaboration(collaborator._id, collaborator.firstName, collaborator.lastName)}>
                                                    <FaTimes className="dropdown-icon" /> End Collaboration
                                                </div>
                                                <div className="dropdown-item" onClick={() => confirmBlockUser(collaborator._id, collaborator.firstName, collaborator.lastName)}>
                                                    <FaBan className="dropdown-icon" /> Block Collaborator
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </li>
                    </React.Fragment>
                ))}
            </ul>
            {activeChatId && <ChatRoom chatId={activeChatId} />}
        </div>
    );
};

export default Collaborators;
