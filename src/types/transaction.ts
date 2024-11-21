export interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
  description?: string;
} 