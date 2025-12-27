import { createContext, useState, useEffect, ReactNode } from 'react';
import { User, authService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Try to refresh the token to validate it
          await authService.refresh();
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);
const login = async (email: string, password: string) => {
  const res = await authService.login(email, password);
  setUser(res.user);
  return res;
};

  const register = async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
    await authService.register(userData);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
