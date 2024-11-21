import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useDashboardData } from '../hooks/useDashboardData';
import RetailerStats from '../components/dashboard/RetailerStats';
import DuePayments from '../components/dashboard/DuePayments';
import TransactionHistory from '../components/dashboard/TransactionHistory';
import CreditStatus from '../components/dashboard/CreditStatus';
import PaymentModal from '../components/modals/PaymentModal';
import CreditAssessmentModal from '../components/modals/CreditAssessmentModal';
import { AlertCircle } from 'lucide-react';
import { dues, transactions } from '../services';
import type { Due } from '../services/api/dues';
import type { Transaction } from '../services/api/transactions';

export default function RetailerDashboard() {
  const { stats, loading: statsLoading, error: statsError, refreshData } = useDashboardData();
  const [duePayments, setDuePayments] = React.useState<Due[]>([]);
  const [transactionList, setTransactionList] = React.useState<Transaction[]>([]);
  const [selectedPayment, setSelectedPayment] = React.useState<Due | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [isCreditAssessmentModalOpen, setIsCreditAssessmentModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [duesData, transactionsData] = await Promise.all([
        dues.getAll(),
        transactions.getHistory()
      ]);
      setDuePayments(duesData);
      setTransactionList(transactionsData);
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    let mounted = true;

    const initializeDashboard = async () => {
      try {
        await loadDashboardData();
        if (mounted) {
          setIsInitialized(true);
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to initialize dashboard:', err);
        }
      }
    };

    initializeDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const handlePayment = (payment: Due) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = async () => {
    setIsPaymentModalOpen(false);
    await Promise.all([
      loadDashboardData(),
      refreshData()
    ]);
  };

  const handleCreditAssessmentComplete = async () => {
    setIsCreditAssessmentModalOpen(false);
    await refreshData();
  };

  if (!isInitialized && loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(error || statsError) && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error || statsError}</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Retailer Dashboard</h1>
          <p className="text-gray-600">Track your dues and payments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <CreditStatus
              creditLimit={stats?.creditLimit || 0}
              availableCredit={stats?.availableCredit || 0}
              creditScore={stats?.creditScore || 0}
              creditHistory={[]}
              isLoading={statsLoading}
              onRequestAssessment={() => setIsCreditAssessmentModalOpen(true)}
            />
          </div>
          <RetailerStats
            stats={{
              totalDue: stats?.totalDue || 0,
              dueToday: stats?.dueToday || 0,
              overdueAmount: stats?.overdueAmount || 0
            }}
            isLoading={statsLoading}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <DuePayments
            payments={duePayments}
            onPayment={handlePayment}
            isLoading={loading}
          />

          <TransactionHistory
            transactions={transactionList}
            isLoading={loading}
          />
        </div>

        {selectedPayment && (
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onSuccess={handlePaymentComplete}
            payment={selectedPayment}
          />
        )}

        <CreditAssessmentModal
          isOpen={isCreditAssessmentModalOpen}
          onClose={() => setIsCreditAssessmentModalOpen(false)}
          onSuccess={handleCreditAssessmentComplete}
        />
      </div>
    </DashboardLayout>
  );
}