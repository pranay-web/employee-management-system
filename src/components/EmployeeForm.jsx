import React, { useState, useEffect } from 'react';
import './EmployeeForm.css';

function EmployeeForm({ employee, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    joinDate: new Date().toISOString().split('T')[0],
  });
  
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        position: employee.position || '',
        salary: employee.salary || '',
        joinDate: employee.joinDate ? employee.joinDate.split('T')[0] : new Date().toISOString().split('T')[0],
      });
      if (employee.photo) {
        setPhotoPreview(employee.photo);
      }
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const selectDepartment = (dept) => {
    setFormData(prev => ({ ...prev, department: dept }));
    if (errors.department) setErrors(prev => ({ ...prev, department: '' }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.department.trim()) newErrors.department = 'Please select a department';
    if (!formData.position.trim()) newErrors.position = 'Position title is required';
    if (!formData.salary || Number(formData.salary) <= 0) newErrors.salary = 'Enter a valid salary';
    if (!formData.joinDate) newErrors.joinDate = 'Join date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      position: formData.position,
      salary: Number(formData.salary),
      joinDate: formData.joinDate,
      photo: photoPreview || null
    };

    onSubmit(payload);
  };

  const departments = ['Engineering', 'Product & Design', 'Marketing', 'Sales', 'Human Resources', 'Finance'];
  const positions = ['Software Engineer', 'Senior Developer', 'Product Designer', 'Marketing Lead', 'Sales Executive', 'HR Specialist', 'Financial Analyst', 'Engineering Manager'];

  return (
    <div className="form-modal-overlay" onClick={onCancel}>
      <div className="form-modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="form-modal-header">
          <div className="header-title-box">
            <h2>{employee ? 'Edit Team Member' : 'Add New Team Member'}</h2>
            <p>{employee ? 'Update profile information & role details' : 'Fill in the information to onboard a new employee'}</p>
          </div>
          <button className="close-icon-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="sleek-form">
          {/* Section 1: Photo & Quick Select */}
          <div className="form-grid-top">
            <div className="photo-dropzone-box">
              <label htmlFor="photo" className="dropzone-label">
                {photoPreview ? (
                  <div className="preview-container">
                    <img src={photoPreview} alt="Preview" />
                    <div className="overlay-hover-text">Change Photo</div>
                  </div>
                ) : (
                  <div className="dropzone-prompt">
                    <span className="upload-icon">📸</span>
                    <span className="upload-title">Upload Profile Photo</span>
                    <span className="upload-sub">PNG, JPG or GIF (max 5MB)</span>
                  </div>
                )}
              </label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden-file-input"
              />
            </div>

            <div className="department-select-section">
              <label className="section-label">Department *</label>
              <div className="dept-pills-grid">
                {departments.map((dept) => (
                  <button
                    type="button"
                    key={dept}
                    className={`dept-pill ${formData.department === dept ? 'active' : ''}`}
                    onClick={() => selectDepartment(dept)}
                  >
                    {dept}
                  </button>
                ))}
              </div>
              {errors.department && <span className="field-error">{errors.department}</span>}
            </div>
          </div>

          {/* Section 2: Form Inputs */}
          <div className="form-fields-grid">
            <div className="input-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Sarah Connor"
                className={errors.name ? 'error-border' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="email">Work Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="sarah@company.com"
                className={errors.email ? 'error-border' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 019-2834"
                className={errors.phone ? 'error-border' : ''}
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="position">Position / Title *</label>
              <input
                type="text"
                id="position"
                name="position"
                list="positions-list"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                className={errors.position ? 'error-border' : ''}
              />
              <datalist id="positions-list">
                {positions.map(p => <option key={p} value={p} />)}
              </datalist>
              {errors.position && <span className="field-error">{errors.position}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="salary">Annual Compensation (₹) *</label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="120000"
                className={errors.salary ? 'error-border' : ''}
              />
              {errors.salary && <span className="field-error">{errors.salary}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="joinDate">Joining Date *</label>
              <input
                type="date"
                id="joinDate"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                className={errors.joinDate ? 'error-border' : ''}
              />
              {errors.joinDate && <span className="field-error">{errors.joinDate}</span>}
            </div>
          </div>

          <div className="form-modal-footer">
            <button type="button" className="btn-ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-gradient">
              {employee ? 'Save Changes ✨' : 'Add Employee 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;
