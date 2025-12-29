// frontend/src/components/CollaborationRequests.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/CollaborationRequests.css';
import { useNavigate } from 'react-router-dom';

const CollaborationRequests = () => {
    const [requests, setRequests] = useState([]);
    const [message, setMessage] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/requests', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
                const sortedRequests = response.data.requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRequests(sortedRequests);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, []);

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            const response = await axios.put('http://localhost:5000/api/requests/status', {
                requestId,
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            // Update status in the state to reflect the change immediately on the page
            setRequests(prevRequests =>
                prevRequests.map(request =>
                    request._id === requestId ? { ...request, status: response.data.request.status } : request
                )
            );

            // Optionally, display a status message
            setMessage(prevMessage => ({
                ...prevMessage,
                [requestId]: newStatus === 'confirmed' ? 'You are now collaborators' : 'Request removed'
            }));
        } catch (error) {
            console.error('Error updating request status:', error);
        }
    };

    return (
        <div className="requests-page">
            <ul className="requests-list">
                {requests.map(request => (
                    <li key={request._id} className="request-item">
                        <div className="sender-photo">
                            <img src={request.sender.profilePhoto} alt={`${request.sender.firstName} ${request.sender.lastName}`} />
                        </div>
                        <div className="request-info">
                            <div className="sender-details">
                                <div className="sender-name">{request.sender.firstName} {request.sender.lastName}</div>
                                <div className="sender-message">
                                    <span className="message-icon">💬</span>
                                    <span className="message-text">{request.message}</span>
                                </div>
                            </div>
                            <div className="action-buttons">
                                <button
                                    onClick={() => handleStatusChange(request._id, 'confirmed')}
                                    className="confirm-button"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => handleStatusChange(request._id, 'deleted')}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        {message[request._id] && 
                            <div className={`status-message ${message[request._id] === 'Request removed' ? 'delete-message' : ''}`}>
                                {message[request._id]}
                            </div>
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CollaborationRequests;

