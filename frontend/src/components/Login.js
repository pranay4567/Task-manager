import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: ''
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.username, formData.password);
      } else {
        result = await register(formData);
      }

      if (result.success) {
        toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
        if (isLogin) {
          navigate('/dashboard');
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate forgot password API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Password reset link sent to your email!');
      setShowForgotPassword(false);
      setForgotEmail('');
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (type) => {
    if (type === 'student') {
      setFormData({ ...formData, username: 'student', password: 'password123' });
    } else {
      setFormData({ ...formData, username: 'admin', password: 'admin123' });
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      name: ''
    });
  };

  // Forgot Password Screen
  if (showForgotPassword) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1><i className="fas fa-key"></i> Reset Password</h1>
            <p>Enter your email to receive a password reset link</p>
          </div>

          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full-width"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.9rem'
              }}
            >
              <i className="fas fa-arrow-left"></i>
              Back to Login
            </button>
          </div>

          <div style={{marginTop: '2rem', padding: '1rem', background: '#e3f2fd', borderRadius: '8px', fontSize: '0.875rem'}}>
            <p style={{margin: 0, textAlign: 'center', color: '#1976d2'}}>
              <i className="fas fa-info-circle"></i>
              <strong> Demo Mode:</strong> Password reset emails are simulated in this demo version.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Login/Register Screen
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1><i className="fas fa-tasks"></i> TaskFlow</h1>
          <p>College Project Management System</p>
        </div>

        <div className="auth-tabs" style={{display: 'flex', marginBottom: '2rem'}}>
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              background: isLogin ? 'var(--primary)' : 'transparent',
              color: isLogin ? 'white' : 'var(--text)',
              borderRadius: '6px 0 0 6px',
              cursor: 'pointer'
            }}
            onClick={() => {
              setIsLogin(true);
              resetForm();
            }}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              background: !isLogin ? 'var(--primary)' : 'transparent',
              color: !isLogin ? 'white' : 'var(--text)',
              borderRadius: '0 6px 6px 0',
              cursor: 'pointer'
            }}
            onClick={() => {
              setIsLogin(false);
              resetForm();
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              {isLogin ? 'Username or Email' : 'Username'}
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder={isLogin ? "Enter username or email" : "Choose a username"}
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
              <label className="form-label">Password</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    textDecoration: 'underline'
                  }}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full-width"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                {isLogin ? 'Logging in...' : 'Creating account...'}
              </>
            ) : (
              isLogin ? 'Login' : 'Create Account'
            )}
          </button>
        </form>

        {isLogin && (
          <div style={{marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px'}}>
            <p style={{marginBottom: '1rem', fontWeight: '600', textAlign: 'center'}}>
              Demo Credentials
            </p>
            <div style={{display: 'flex', gap: '0.5rem', fontSize: '0.875rem'}}>
              <button
                type="button"
                className="btn btn-outline"
                style={{flex: 1, fontSize: '0.75rem', padding: '0.5rem'}}
                onClick={() => fillDemoCredentials('student')}
              >
                Student User
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{flex: 1, fontSize: '0.75rem', padding: '0.5rem'}}
                onClick={() => fillDemoCredentials('admin')}
              >
                Admin User
              </button>
            </div>
            <div style={{marginTop: '0.5rem', fontSize: '0.75rem', color: '#666', textAlign: 'center'}}>
              <p>Student: student / password123</p>
              <p>Admin: admin / admin123</p>
            </div>
          </div>
        )}

        {!isLogin && (
          <div style={{marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-light)'}}>
            By creating an account, you agree to our{' '}
            <a href="#" style={{color: 'var(--primary)', textDecoration: 'none'}}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" style={{color: 'var(--primary)', textDecoration: 'none'}}>Privacy Policy</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
