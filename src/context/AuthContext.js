// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, isTesting = false, isAdminTesting = false }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAdminTesting) {
        // Auto login for admin testing
        setUser({ id: 1, username: 'admin', role: 'admin' });
        setLoading(false);
        return;
      }
      if (isTesting) {
        // Skip connecting to URL if in testing mode
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('/user');
        setUser(response.data);
      } catch (error) {
        console.error('No credentials found or there was an error fetching the user!', error);
        setUser(null); // Ensure user is set to null if not authenticated
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isTesting, isAdminTesting]);

  const login = async (credentials) => {
    if (isTesting) {
      // Mock login response for testing
      setUser({ id: 1, username: 'testuser', role: 'user' });
      setError(null); // Clear any previous error
      return;
    }
    try {
      const response = await axios.post('/login', credentials);
      setUser(response.data);
      setError(null); // Clear any previous error
    } catch (error) {
      console.error('There was an error logging in!', error);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  const logout = async () => {
    if (isTesting) {
      // Mock logout response for testing
      setUser(null);
      setError(null); // Clear any previous error
      return;
    }
    try {
      await axios.get('/logout');
      setUser(null);
      setError(null); // Clear any previous error
    } catch (error) {
      console.error('There was an error logging out!', error);
      setError('Logout failed. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};