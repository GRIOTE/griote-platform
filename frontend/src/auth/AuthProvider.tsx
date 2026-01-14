// src/auth/AuthProvider.tsx
import { createContext, useState, useEffect, type ReactNode } from 'react';
import { type User, login, register, logout, getUser, type LoginResponse } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;

  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const res = await login(email, password);
    setUser(res.user);
    return res;
  };

  const handleRegister = async (userData: any) => {
    return await register(userData);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  };

  const refreshUser = () => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshUser,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};