// src/auth/AuthProvider.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import { User, login, register, logout, getUser, LoginResponse } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;

  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    await logout();
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