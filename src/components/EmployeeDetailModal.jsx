import React from 'react';
import './EmployeeDetailModal.css';

function EmployeeDetailModal({ employee, onClose, onEdit, onDelete }) {
  if (!employee) return null;

  const photoUrl = employee.photo
    ? (employee.photo.startsWith('http') ? employee.photo : employee.photo)
    : null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <div className="detail-header">
          <div className="detail-avatar-wrapper">
            {photoUrl ? (
              <img src={photoUrl} alt={employee.name} className="detail-avatar-img" />
            ) : (
              <div className="detail-avatar-placeholder">
                {employee.name ? employee.name.charAt(0).toUpperCase() : '👤'}
              </div>
            )}
            <span className="online-indicator"></span>
          </div>

          <div className="detail-header-info">
            <h2 className="detail-name">{employee.name}</h2>
            <p className="detail-position">{employee.position}</p>
            <span className="badge-dept">{employee.department}</span>
          </div>
        </div>

        <div className="detail-body">
          <div className="info-grid">
            <div className="info-card">
              <span className="info-icon">✉️</span>
              <div className="info-text">
                <label>Email Address</label>
                <a href={`mailto:${employee.email}`}>{employee.email}</a>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon">📞</span>
              <div className="info-text">
                <label>Phone Number</label>
                <a href={`tel:${employee.phone}`}>{employee.phone}</a>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon">💰</span>
              <div className="info-text">
                <label>Annual Compensation</label>
                <span className="salary-highlight">₹{Number(employee.salary).toLocaleString()}</span>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon">📅</span>
              <div className="info-text">
                <label>Joining Date</label>
                <span>{new Date(employee.joinDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => { onClose(); onEdit(employee); }}>
            ✏️ Edit Profile
          </button>
          <button className="btn-danger-outline" onClick={() => { onClose(); onDelete(employee._id); }}>
            🗑️ Delete Employee
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetailModal;
