import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, LoginResponse, RegisterData } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (userData: RegisterData) => Promise<{ message: string; emailToken: string }>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage
    const initializeAuth = () => {
      const storedUser = authService.getUser();
      if (storedUser && authService.isAuthenticated()) {
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ message: string; emailToken: string }> => {
    try {
      setIsLoading(true);
      return await authService.register(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = (): boolean => {
    return authService.isAdmin();
  };

  const hasRole = (role: string): boolean => {
    return authService.hasRole(role);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    isAdmin,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
