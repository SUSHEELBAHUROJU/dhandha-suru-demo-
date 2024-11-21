import api from '../api';

export interface CreditAssessmentData {
  businessType: string;
  yearsInBusiness: number;
  annualTurnover: number;
  employeeCount: number;
  shopOwnership: 'owned' | 'rented';
  monthlyRent?: number;
  gstNumber: string;
  panNumber: string;
  bankAccountNumber: string;
  ifscCode: string;
  bankName: string;
  bankBranch: string;
  existingLoans: boolean;
  loanAmount?: number;
  loanProvider?: string;
  monthlyEmi?: number;
}

export interface CreditAssessmentStatus {
  status: 'pending' | 'approved' | 'rejected';
  creditScore?: number;
  creditLimit?: number;
  message?: string;
}

export const creditAssessment = {
  request: async (data: CreditAssessmentData): Promise<void> => {
    try {
      await api.post('/credit-assessment/request/', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to submit credit assessment');
    }
  },

  getStatus: async (): Promise<CreditAssessmentStatus> => {
    try {
      const response = await api.get('/credit-assessment/status/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get credit assessment status');
    }
  }
};