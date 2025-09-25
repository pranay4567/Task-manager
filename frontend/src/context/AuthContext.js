import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    const savedUser = localStorage.getItem('taskflow_user');
    const savedToken = localStorage.getItem('taskflow_token');

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('taskflow_user');
        localStorage.removeItem('taskflow_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        username: username.trim(),
        password
      });

      if (response.data.success) {
        const { user, token } = response.data;

        // Save user data and token
        setUser(user);
        localStorage.setItem('taskflow_user', JSON.stringify(user));
        localStorage.setItem('taskflow_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Network error. Please try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      // Validate input data
      if (!userData.username || !userData.email || !userData.password || !userData.name) {
        return {
          success: false,
          message: 'All fields are required'
        };
      }

      const response = await axios.post('/api/auth/register', {
        username: userData.username.trim(),
        email: userData.email.trim(),
        name: userData.name.trim(),
        password: userData.password
      });

      if (response.data.success) {
        const { user, token } = response.data;

        // Save user data and token
        setUser(user);
        localStorage.setItem('taskflow_user', JSON.stringify(user));
        localStorage.setItem('taskflow_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Network error. Please try again.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskflow_user');
    localStorage.removeItem('taskflow_token');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('taskflow_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;