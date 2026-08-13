import React from 'react';
import './Toast.css';

function Toast({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div className={`toast-notification toast-${type || 'info'}`}>
      <div className="toast-icon">
        {type === 'success' && '✨'}
        {type === 'error' && '⚠️'}
        {type === 'info' && 'ℹ️'}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}

export default Toast;
