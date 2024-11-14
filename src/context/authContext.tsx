// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getUserRole } from '../utils/getRole';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  loading: boolean;
  setLoading: (loading: boolean) => void; // New function to set loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('authToken');
    setIsAuthenticated(!!token);
    setUserRole(token ? getUserRole() : null);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, loading, setLoading }}>
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
