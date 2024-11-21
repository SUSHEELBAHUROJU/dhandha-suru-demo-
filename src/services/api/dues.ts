import api from '../api';

export interface Due {
  id: string;
  supplier: {
    id: string;
    business_name: string;
  };
  retailer: {
    id: string;
    business_name: string;
    phone: string;
  };
  amount: number;
  description: string;
  purchase_date: string;
  due_date: string;
  status: 'pending' | 'overdue' | 'paid';
  created_at: string;
  updated_at: string;
}

export interface CreateDueData {
  retailer: string;
  amount: number;
  description: string;
  purchase_date: string;
  due_date: string;
}

export interface Payment {
  id: string;
  due: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  reference_id?: string;
  status: 'pending' | 'completed' | 'failed';
}

export const dues = {
  getAll: async (): Promise<Due[]> => {
    try {
      const response = await api.get('/dues/');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching dues:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch dues');
    }
  },

  create: async (data: CreateDueData): Promise<Due> => {
    try {
      const response = await api.post('/dues/create/', data);
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error: any) {
      console.error('Error creating due:', error);
      throw new Error(error.response?.data?.error || 'Failed to create due entry');
    }
  },

  makePayment: async (dueId: string, data: {
    amount: number;
    payment_method: string;
    reference_id?: string;
  }): Promise<Payment> => {
    try {
      const response = await api.post(`/dues/${dueId}/pay/`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error making payment:', error);
      throw new Error(error.response?.data?.error || 'Failed to make payment');
    }
  },

  getDueDetails: async (dueId: string): Promise<Due> => {
    try {
      const response = await api.get(`/dues/${dueId}/`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching due details:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch due details');
    }
  },

  update: async (dueId: string, data: Partial<Due>): Promise<Due> => {
    try {
      const response = await api.put(`/dues/${dueId}/`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating due:', error);
      throw new Error(error.response?.data?.error || 'Failed to update due');
    }
  },

  delete: async (dueId: string): Promise<void> => {
    try {
      await api.delete(`/dues/${dueId}/`);
    } catch (error: any) {
      console.error('Error deleting due:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete due');
    }
  }
};