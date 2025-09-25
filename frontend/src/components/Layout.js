import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: 'fa-chart-bar', label: 'Dashboard' },
    { path: '/tasks', icon: 'fa-list', label: 'All Tasks' },
    { path: '/create-task', icon: 'fa-plus', label: 'Create Task' },
    { path: '/profile', icon: 'fa-user', label: 'Profile' }
  ];

  return (
    <div className="app-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 style={{color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <i className="fas fa-tasks"></i>
            TaskFlow
          </h2>
          <p style={{fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem'}}>
            Welcome, {user?.name || user?.username}
          </p>
        </div>
        
        <nav>
          <ul className="sidebar-nav">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                  style={{fontSize: '0.9rem'}}
                >
                  <i className={`fas ${item.icon}`}></i>
                  {item.label}
                </Link>
              </li>
            ))}
            <li style={{marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1rem'}}>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 2rem',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-light)',
                  cursor: 'pointer',
                  gap: '0.75rem',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'var(--danger)';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = 'var(--text-light)';
                }}
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
