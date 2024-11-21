import api from '../api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    user_type: 'retailer' | 'supplier' | 'fintech';
    business_name: string;
  };
}

interface RegisterData {
  user: {
    email: string;
    password: string;
  };
  user_type: string;
  business_name: string;
  phone: string;
  gst_number: string;
  address: string;
}

export const auth = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login/', credentials);
      if (response.data.user) {
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post(data.user_type === 'fintech' ? '/auth/register/fintech/' : '/auth/register/', data);
      if (response.data.user) {
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout/');
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      throw error;
    }
  }
};