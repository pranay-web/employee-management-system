import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import Toast from './components/Toast';

function App() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState('dark');

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  const showNotification = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch all employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/employees`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        showNotification('Failed to load employee list', 'error');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      showNotification('Server connection error. Check backend status.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCount = employees.length;
    const totalPayroll = employees.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);
    const avgSalary = totalCount > 0 ? Math.round(totalPayroll / totalCount) : 0;
    const depts = new Set(employees.map(e => e.department).filter(Boolean)).size;

    return { totalCount, totalPayroll, avgSalary, depts };
  }, [employees]);

  // Handle add employee
  const handleAddEmployee = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newEmployee = await response.json();
        setEmployees([newEmployee, ...employees]);
        setShowForm(false);
        showNotification(`Added ${newEmployee.name} to team!`, 'success');
      } else {
        const errData = await response.json().catch(() => ({}));
        showNotification(errData.message || 'Failed to add employee', 'error');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      showNotification('Network error while creating employee', 'error');
    }
  };

  // Handle update employee
  const handleUpdateEmployee = async (id, formData) => {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedEmployee = await response.json();
        setEmployees(employees.map(emp => emp._id === id ? updatedEmployee : emp));
        setSelectedEmployee(null);
        setShowForm(false);
        showNotification(`Updated profile for ${updatedEmployee.name}`, 'success');
      } else {
        const errData = await response.json().catch(() => ({}));
        showNotification(errData.message || 'Failed to update employee', 'error');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      showNotification('Network error while updating employee', 'error');
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async (id) => {
    const target = employees.find(e => e._id === id);
    const targetName = target ? target.name : 'this employee';
    
    if (window.confirm(`Are you sure you want to delete ${targetName}?`)) {
      try {
        const response = await fetch(`${API_URL}/employees/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setEmployees(employees.filter(emp => emp._id !== id));
          showNotification(`Removed ${targetName} from system`, 'info');
        } else {
          showNotification('Failed to delete employee', 'error');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        showNotification('Network error while deleting employee', 'error');
      }
    }
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedEmployee(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`app-wrapper theme-${theme}`}>
      {/* Dynamic Background Glows */}
      <div className="bg-glow blob-1"></div>
      <div className="bg-glow blob-2"></div>

      {/* Main Top Navigation Header */}
      <header className="main-navbar">
        <div className="navbar-container">
          <div className="brand-logo-group">
            <div className="brand-icon">💎</div>
            <div className="brand-text">
              <h1>Nexus<span className="brand-accent">HR</span></h1>
              <span className="brand-tagline">Enterprise Workforce Analytics</span>
            </div>
          </div>

          <div className="header-right-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button 
              className="btn-add-primary" 
              onClick={() => setShowForm(true)}
            >
              <span className="plus-icon">+</span> Add Team Member
            </button>
          </div>
        </div>
      </header>

      <main className="app-main-content">
        {/* Real-time Dashboard Stats Counters */}
        <div className="stats-dashboard-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper cyan">👥</div>
            <div className="stat-info">
              <span className="stat-label">Total Employees</span>
              <span className="stat-value">{stats.totalCount}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper indigo">🏢</div>
            <div className="stat-info">
              <span className="stat-label">Active Departments</span>
              <span className="stat-value">{stats.depts}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper emerald">💰</div>
            <div className="stat-info">
              <span className="stat-label">Total Annual Payroll</span>
              <span className="stat-value">₹{stats.totalPayroll.toLocaleString()}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper violet">📊</div>
            <div className="stat-info">
              <span className="stat-label">Average Salary</span>
              <span className="stat-value">₹{stats.avgSalary.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Directory & Actions */}
        <EmployeeList
          employees={employees}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteEmployee}
        />
      </main>

      {/* Add / Edit Employee Overlay Form */}
      {showForm && (
        <EmployeeForm
          employee={selectedEmployee}
          onSubmit={selectedEmployee 
            ? (data) => handleUpdateEmployee(selectedEmployee._id, data)
            : handleAddEmployee
          }
          onCancel={handleCloseForm}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
