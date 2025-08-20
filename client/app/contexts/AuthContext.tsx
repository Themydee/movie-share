// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

type AuthContextType = {
  user: any;
  token: string | null;
  login: (token: string, user: any, refreshToken?: string) => void;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const server_url = 'http://localhost:5000';

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken) {
      setToken(savedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (newToken: string, newUser: any, refreshToken?: string) => {
    localStorage.setItem('token', newToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const refreshToken = async () => {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (!refreshTokenValue) {
      console.error('No refresh token found in localStorage');
      logout();
      return null;
    }

    try {
      console.log('Sending refresh token request with:', refreshTokenValue);
      const response = await axios.post(`${server_url}/api/auth/refresh`, {
        refreshToken: refreshTokenValue,
      });
      const newToken = response.data.accessToken;
      console.log('New access token received:', newToken);
      localStorage.setItem('token', newToken);
      setToken(newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return newToken;
    } catch (err: any) {
      console.error('Token refresh failed:', err.response?.data || err.message);
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}