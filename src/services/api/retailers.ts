import api from '../api';

export interface Retailer {
  id: string;
  business_name: string;
  phone: string;
  address: string;
  credit_score?: number;
  total_dues?: number;
  payment_history?: string;
}

export const retailers = {
  search: async (query: string): Promise<Retailer[]> => {
    try {
      const response = await api.get(`/retailers/search/?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Retailer> => {
    try {
      const response = await api.get(`/retailers/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Get retailer error:', error);
      throw error;
    }
  },

  getRecent: async (): Promise<Retailer[]> => {
    try {
      const response = await api.get('/retailers/recent/');
      return response.data;
    } catch (error) {
      console.error('Get recent retailers error:', error);
      throw error;
    }
  },

  getAll: async (): Promise<Retailer[]> => {
    try {
      const response = await api.get('/retailers/');
      return response.data;
    } catch (error) {
      console.error('Get all retailers error:', error);
      throw error;
    }
  }
};