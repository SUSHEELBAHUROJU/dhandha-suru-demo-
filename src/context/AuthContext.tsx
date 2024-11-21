import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, profile } from '../services';

interface User {
  id: number;
  email: string;
  user_type: 'retailer' | 'supplier' | 'fintech';
  business_name: string;
}

interface AuthContextType {
  user: User | null;
  error: string | null;
  loading: boolean;
  register: (data: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await profile.get();
      setUser(response.user);
      redirectToDashboard(response.user.user_type);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const redirectToDashboard = (userType: string) => {
    switch (userType) {
      case 'retailer':
        navigate('/retailer/dashboard');
        break;
      case 'supplier':
        navigate('/supplier/dashboard');
        break;
      case 'fintech':
        navigate('/fintech/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const register = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure business_name is included in the registration data
      if (!data.business_name) {
        throw new Error('Business name is required');
      }

      const response = await auth.register({
        user: {
          email: data.user.email,
          password: data.user.password,
        },
        user_type: data.user_type,
        business_name: data.business_name,
        phone: data.phone,
        gst_number: data.gst_number,
        address: data.address,
      });
      
      if (response.user) {
        localStorage.setItem('token', response.token || '');
        setUser(response.user);
        redirectToDashboard(response.user.user_type);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await auth.login({ email, password });
      
      if (response.user) {
        localStorage.setItem('token', response.token || '');
        setUser(response.user);
        redirectToDashboard(response.user.user_type);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Invalid credentials';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, error, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}