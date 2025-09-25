import React, { useState } from 'react';
import Layout from './Layout';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [defaultView, setDefaultView] = useState(localStorage.getItem('defaultView') || 'all');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      
      if (updateUser) {
        updateUser(formData);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    toast.success(`Switched to ${newTheme} mode!`);
  };

  const handleDefaultViewChange = (view) => {
    setDefaultView(view);
    localStorage.setItem('defaultView', view);
    toast.success(`Default view set to: ${view}`);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || ''
    });
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your account settings and preferences</p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem'}}>
        {/* Profile Information Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Profile Information</h2>
            {!isEditing && (
              <button
                className="btn btn-outline"
                style={{padding: '0.5rem 1rem', fontSize: '0.875rem'}}
                onClick={() => setIsEditing(true)}
              >
                <i className="fas fa-edit"></i>
                Edit
              </button>
            )}
          </div>
          <div className="card-body">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{padding: '0.5rem 1rem', fontSize: '0.875rem'}}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{padding: '0.5rem 1rem', fontSize: '0.875rem'}}
                  >
                    <i className="fas fa-save"></i>
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div style={{display: 'grid', gap: '1.5rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}>
                    {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 style={{marginBottom: '0.25rem'}}>{user?.name || 'User Name'}</h3>
                    <p style={{color: 'var(--text-light)', margin: 0, fontSize: '0.875rem'}}>@{user?.username}</p>
                  </div>
                </div>

                <div style={{display: 'grid', gap: '1rem'}}>
                  <div>
                    <label style={{fontWeight: '600', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase'}}>
                      Full Name
                    </label>
                    <p style={{margin: '0.25rem 0 0', fontSize: '0.875rem'}}>{user?.name || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <label style={{fontWeight: '600', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase'}}>
                      Email Address
                    </label>
                    <p style={{margin: '0.25rem 0 0', fontSize: '0.875rem'}}>{user?.email || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <label style={{fontWeight: '600', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase'}}>
                      Username
                    </label>
                    <p style={{margin: '0.25rem 0 0', fontSize: '0.875rem'}}>@{user?.username || 'Not set'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Settings Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Account Settings</h2>
          </div>
          <div className="card-body">
            <div style={{display: 'grid', gap: '2rem'}}>
              {/* Security Section */}
              <div>
                <h4 style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem'}}>
                  <i className="fas fa-shield-alt" style={{color: 'var(--primary)'}}></i>
                  Security
                </h4>
                <p style={{color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.8rem'}}>
                  Manage your account security settings
                </p>
                <button 
                  className="btn btn-outline"
                  style={{padding: '0.5rem 1rem', fontSize: '0.875rem'}}
                  onClick={() => setShowPasswordModal(true)}
                >
                  <i className="fas fa-key"></i>
                  Change Password
                </button>
              </div>

              {/* Theme Section */}
              <div>
                <h4 style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem'}}>
                  <i className="fas fa-palette" style={{color: 'var(--primary)'}}></i>
                  Appearance
                </h4>
                <p style={{color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.8rem'}}>
                  Customize your theme preference
                </p>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <button
                    className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
                    style={{padding: '0.5rem 1rem', fontSize: '0.75rem'}}
                    onClick={() => handleThemeChange('light')}
                  >
                    <i className="fas fa-sun"></i>
                    Light
                  </button>
                  <button
                    className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
                    style={{padding: '0.5rem 1rem', fontSize: '0.75rem'}}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <i className="fas fa-moon"></i>
                    Dark
                  </button>
                  <button
                    className={`btn ${theme === 'auto' ? 'btn-primary' : 'btn-outline'}`}
                    style={{padding: '0.5rem 1rem', fontSize: '0.75rem'}}
                    onClick={() => handleThemeChange('auto')}
                  >
                    <i className="fas fa-adjust"></i>
                    Auto
                  </button>
                </div>
              </div>

              {/* Default View Section */}
              <div>
                <h4 style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem'}}>
                  <i className="fas fa-eye" style={{color: 'var(--primary)'}}></i>
                  Default Task View
                </h4>
                <p style={{color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.8rem'}}>
                  Choose your preferred default view for tasks
                </p>
                <select 
                  className="form-control" 
                  style={{maxWidth: '200px', fontSize: '0.875rem'}}
                  value={defaultView}
                  onChange={(e) => handleDefaultViewChange(e.target.value)}
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending Only</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="high-priority">High Priority</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '400px'}}>
            <div className="modal-header">
              <h2 className="modal-title">Change Password</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowPasswordModal(false)}
                style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  minLength="6"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  minLength="6"
                  required
                />
              </div>

              <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem'}}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{padding: '0.5rem 1rem', fontSize: '0.875rem'}}
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{padding: '0.5rem 1rem', fontSize: '0.875rem'}}
                >
                  <i className="fas fa-key"></i>
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Profile;
