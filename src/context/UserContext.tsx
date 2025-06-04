import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserContextProps {
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

const API_BASE = '/api';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('authToken');
    if (stored) setToken(stored);
  }, []);

  const login = async (username: string, password: string) => {
    const resp = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (resp.ok) {
      const data = await resp.json();
      setToken(data.access_token);
      localStorage.setItem('authToken', data.access_token);
      return true;
    }
    return false;
  };

  const register = async (username: string, password: string) => {
    const resp = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return resp.ok;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <UserContext.Provider value={{ token, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
