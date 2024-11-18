import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const res = await axios.get('/api/auth/status');
        setIsAuthenticated(res.data.authenticated);
      } catch (err) {
        console.error(err);
      }
    }

    checkAuthStatus();
  }, []);

  const loginUser = async (username, name, email) => {
    const payload = { username, name, email };

    try {
      await axios.post('/api/auth/login', payload);
      setIsAuthenticated(true);
    } catch (err) {
      alert("Error logging in");
    }
  };

  const logoutUser = async () => {
    try {
      await axios.get('/api/auth/logout');
      setIsAuthenticated(false);
    } catch (err) {
      alert("Error logging out");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
