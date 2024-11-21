import api from '../api';

export interface RetailerAssessment {
  id: string;
  business_name: string;
  credit_score: number;
  credit_limit: number;
  status: 'pending' | 'approved' | 'rejected';
  payment_history: string;
  years_in_business: number;
  assessment_date: string;
}

export interface EMIPlan {
  id: string;
  tenure_months: number;
  monthly_amount: number;
  interest_rate: number;
  total_amount: number;
}

export const fintech = {
  getRetailersForAssessment: async (): Promise<RetailerAssessment[]> => {
    try {
      const response = await api.get('/fintech/retailers');
      return response.data;
    } catch (error) {
      console.error('Error fetching retailers:', error);
      throw error;
    }
  },

  updateCreditLimit: async (retailerId: string, newLimit: number) => {
    try {
      const response = await api.put(`/fintech/retailers/${retailerId}/credit-limit`, {
        credit_limit: newLimit
      });
      return response.data;
    } catch (error) {
      console.error('Error updating credit limit:', error);
      throw error;
    }
  },

  getEMIPlans: async (dueId: string): Promise<EMIPlan[]> => {
    try {
      const response = await api.get(`/fintech/dues/${dueId}/emi-plans`);
      return response.data;
    } catch (error) {
      console.error('Error fetching EMI plans:', error);
      throw error;
    }
  },

  activateEMIPlan: async (dueId: string, planId: string) => {
    try {
      const response = await api.post(`/fintech/dues/${dueId}/emi-plans/${planId}/activate`);
      return response.data;
    } catch (error) {
      console.error('Error activating EMI plan:', error);
      throw error;
    }
  },

  processAutomaticPayment: async (dueId: string) => {
    try {
      const response = await api.post(`/fintech/dues/${dueId}/process-payment`);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  requestCreditAssessment: async (retailerId: string) => {
    try {
      const response = await api.post(`/fintech/retailers/${retailerId}/request-assessment`);
      return response.data;
    } catch (error) {
      console.error('Error requesting assessment:', error);
      throw error;
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await api.get('/fintech/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getAnalytics: async () => {
    try {
      const response = await api.get('/fintech/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
};