const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  is_email_verified: boolean;
  date_of_birth?: string;
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  requiresInterfaceSelection: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
  date_of_birth?: string;
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        this.clearTokens();
      }
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      
      // Store tokens and user data
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.user = data.user;
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<{ message: string; emailToken: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        // Si l'erreur contient des détails de validation, les afficher
        if (error.details && Array.isArray(error.details)) {
          const errorMessages = error.details.map((d: any) => `${d.field}: ${d.message}`).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(error.message || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.refreshToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const data = await response.json();
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      return data.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearTokens();
      return null;
    }
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // If token expired, try to refresh
    if (response.status === 401 && this.refreshToken) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, {
          ...options,
          headers,
        });
      }
    }

    return response;
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Getters
  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.user;
  }

  isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }

  hasRole(role: string): boolean {
    return this.user?.role === role;
  }
}

export const authService = new AuthService();
export default authService;
