import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

const getRoleFromDecoded = (decoded) => {
  if (!decoded) return null;
  
  // Check typical JWT payload role claim names
  let roleVal = decoded.role || decoded.roles || decoded.authority || decoded.authorities;
  
  if (Array.isArray(roleVal)) {
    if (roleVal.length > 0) {
      const first = roleVal[0];
      roleVal = typeof first === 'object' ? (first.authority || first.role) : first;
    } else {
      roleVal = null;
    }
  }
  
  if (typeof roleVal === 'string') {
    const cleanRole = roleVal.replace(/^ROLE_/, '').toUpperCase();
    if (cleanRole === 'STUDENT' || cleanRole === 'FACULTY') {
      return cleanRole;
    }
  }
  
  // Intelligent fallbacks based on claims
  if (decoded.sub && decoded.sub.includes('faculty')) return 'FACULTY';
  if (decoded.email && decoded.email.includes('faculty')) return 'FACULTY';
  
  // Default to STUDENT if undefined or not explicitly FACULTY
  return 'STUDENT';
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        // Check if token is expired
        const exp = decoded.exp ? decoded.exp * 1000 : null;
        if (exp && Date.now() >= exp) {
          console.warn('JWT token has expired, logging out');
          logout();
        } else {
          setUser(decoded);
          const detectedRole = getRoleFromDecoded(decoded);
          setRole(detectedRole);
        }
      } else {
        // Invalid token format
        logout();
      }
    } else {
      setUser(null);
      setRole(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await API.post('/api/auth/login', { email, password });
      const { token: jwtToken } = response.data;
      
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      
      const decoded = decodeToken(jwtToken);
      const detectedRole = getRoleFromDecoded(decoded);
      
      return { success: true, role: detectedRole, message: response.data.message };
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: errorMsg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await API.post('/api/auth/register', { name, email, password, role: 'STUDENT' });
      const { token: jwtToken } = response.data;
      
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      
      const decoded = decodeToken(jwtToken);
      const detectedRole = getRoleFromDecoded(decoded);
      
      return { success: true, role: detectedRole, message: response.data.message };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.message || 'Registration failed. Please check your inputs.';
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
