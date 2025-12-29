// frontend/src/components/ConfirmDialog.js
import React from 'react';
import '../assets/styles/ConfirmDialog.css';

const CustomConfirmDialog = ({ title, message, onConfirm, onCancel }) => (
    <div className="custom-confirm-dialog">
        <h1 className="dialog-title">{title}</h1>
        <p className="dialog-message">{message}</p>
        <div className="dialog-buttons">
            <button className="dialog-button confirm-dialog-button" onClick={onConfirm}>Yes</button>
            <button className="dialog-button cancel-dialog-button" onClick={onCancel}>No</button>
        </div>
    </div>
);

export default CustomConfirmDialog;
