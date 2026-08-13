import React, { useState, useMemo } from 'react';
import './EmployeeList.css';
import EmployeeDetailModal from './EmployeeDetailModal';

function EmployeeList({ employees, loading, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [viewingEmployee, setViewingEmployee] = useState(null);

  // Departments list for filter pills
  const departments = useMemo(() => {
    const set = new Set(employees.map(e => e.department).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [employees]);

  // Filter & Sort logic
  const filteredEmployees = useMemo(() => {
    return employees
      .filter(emp => {
        const matchesSearch =
          emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
        return matchesSearch && matchesDept;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'salary') return (b.salary || 0) - (a.salary || 0);
        if (sortBy === 'joinDate') return new Date(b.joinDate || 0) - new Date(a.joinDate || 0);
        return 0;
      });
  }, [employees, searchTerm, selectedDept, sortBy]);

  if (loading) {
    return (
      <div className="loading-state-card">
        <div className="pulsing-orbit"></div>
        <p className="loading-text">Fetching team directory...</p>
      </div>
    );
  }

  return (
    <div className="directory-wrapper">
      {/* Controls Bar: Search, Dept Pills, Sort, View Toggle */}
      <div className="controls-glass-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>×</button>
          )}
        </div>

        <div className="dept-tabs">
          {departments.map(dept => (
            <button
              key={dept}
              className={`dept-tab ${selectedDept === dept ? 'active' : ''}`}
              onClick={() => setSelectedDept(dept)}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="right-controls">
          <div className="sort-dropdown-wrapper">
            <span className="sort-label">Sort:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="name">Name (A-Z)</option>
              <option value="salary">Salary (High to Low)</option>
              <option value="joinDate">Recent Joiners</option>
            </select>
          </div>

          <div className="view-toggle-btns">
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              🎴
            </button>
            <button
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              📋
            </button>
          </div>
        </div>
      </div>

      {/* Directory Count Header */}
      <div className="directory-meta-header">
        <h3>
          Team Members <span className="count-badge">{filteredEmployees.length}</span>
        </h3>
        {searchTerm && <span className="filter-summary">Matching "{searchTerm}"</span>}
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="empty-state-card">
          <div className="empty-sparkle">🔍</div>
          <h3>No team members found</h3>
          <p>{searchTerm ? 'Try adjusting your search query or department filter.' : 'Click "Add Team Member" above to create your first employee record.'}</p>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredEmployees.length > 0 && (
        <div className="employees-modern-grid">
          {filteredEmployees.map(employee => {
            const photoUrl = employee.photo ? employee.photo : null;
            return (
              <div
                key={employee._id}
                className="sleek-employee-card"
                onClick={() => setViewingEmployee(employee)}
              >
                <div className="card-top-banner">
                  <span className="dept-tag">{employee.department}</span>
                  <div className="card-quick-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="quick-action-btn"
                      onClick={() => onEdit(employee)}
                      title="Edit Profile"
                    >
                      ✏️
                    </button>
                    <button
                      className="quick-action-btn delete-btn"
                      onClick={() => onDelete(employee._id)}
                      title="Delete Record"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="card-profile-header">
                  <div className="avatar-ring">
                    {photoUrl ? (
                      <img src={photoUrl} alt={employee.name} />
                    ) : (
                      <div className="avatar-initials">
                        {employee.name ? employee.name.charAt(0).toUpperCase() : '👤'}
                      </div>
                    )}
                  </div>
                  <h4 className="employee-name-title">{employee.name}</h4>
                  <p className="employee-role-subtitle">{employee.position}</p>
                </div>

                <div className="card-info-rows">
                  <div className="info-row">
                    <span className="row-icon">✉️</span>
                    <span className="row-val">{employee.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="row-icon">📞</span>
                    <span className="row-val">{employee.phone}</span>
                  </div>
                  <div className="info-row highlight-row">
                    <span className="row-icon">💰</span>
                    <span className="row-val salary-text">₹{Number(employee.salary).toLocaleString()} / yr</span>
                  </div>
                </div>

                <div className="card-footer-meta">
                  <span>Joined {new Date(employee.joinDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                  <span className="view-detail-hint">View Profile →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredEmployees.length > 0 && (
        <div className="table-responsive-wrapper glass-panel-table">
          <table className="sleek-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Position</th>
                <th>Contact</th>
                <th>Salary</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => (
                <tr key={employee._id} onClick={() => setViewingEmployee(employee)} className="table-row-interactive">
                  <td className="cell-employee">
                    <div className="table-avatar">
                      {employee.photo ? (
                        <img src={employee.photo} alt={employee.name} />
                      ) : (
                        <div className="table-avatar-initials">
                          {employee.name ? employee.name.charAt(0).toUpperCase() : '👤'}
                        </div>
                      )}
                    </div>
                    <div className="cell-name-box">
                      <span className="cell-name">{employee.name}</span>
                      <span className="cell-sub">{employee.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="dept-tag-table">{employee.department}</span>
                  </td>
                  <td className="cell-role">{employee.position}</td>
                  <td className="cell-contact">{employee.phone}</td>
                  <td className="cell-salary">₹{Number(employee.salary).toLocaleString()}</td>
                  <td className="cell-date">{new Date(employee.joinDate).toLocaleDateString()}</td>
                  <td className="cell-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="btn-action-icon" onClick={() => onEdit(employee)}>✏️</button>
                    <button className="btn-action-icon danger" onClick={() => onDelete(employee._id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Detail Interactive Modal */}
      {viewingEmployee && (
        <EmployeeDetailModal
          employee={viewingEmployee}
          onClose={() => setViewingEmployee(null)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}

export default EmployeeList;
