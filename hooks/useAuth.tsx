import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { USERS, USER_PASSWORDS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, companyId: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('odoo-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, password: string, companyId: string): boolean => {
    // Find user by their username from the consolidated user list.
    const baseUser = USERS.find(
      (u) => u.username === username.trim()
    );

    // First, check if user exists and password is correct.
    // Then, check if the selected company is in the user's allowed list.
    if (baseUser && USER_PASSWORDS[baseUser.username] === password && baseUser.allowedCompanyIds.includes(companyId)) {
      
      // Construct the 'user' object for the session in the shape the app expects.
      const sessionUser: User = {
        id: baseUser.id,
        username: baseUser.username,
        companyId: companyId, // The company selected during login
      };
      
      setUser(sessionUser);
      localStorage.setItem('odoo-user', JSON.stringify(sessionUser));
      return true;
    }
    
    // If any check fails, login is unsuccessful.
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('odoo-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};