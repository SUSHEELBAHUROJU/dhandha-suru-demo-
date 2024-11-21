import api from '../api';

export interface DashboardStats {
  // Common stats
  totalOutstanding?: number;
  activeRetailers?: number;
  monthlySales?: number;
  overdueAmount?: number;
  
  // Retailer specific stats
  totalDue?: number;
  dueToday?: number;
  creditLimit?: number;
  availableCredit?: number;
  creditScore?: number;
}

export const dashboard = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/dashboard/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};