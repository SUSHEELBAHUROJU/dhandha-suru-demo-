import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { fintech } from '../services/api/fintech';
import { CreditCard, Users, AlertTriangle, TrendingUp, DollarSign, Percent } from 'lucide-react';
import RetailerAssessmentList from '../components/fintech/RetailerAssessmentList';
import CreditLimitModal from '../components/fintech/CreditLimitModal';
import RetailerDetailsModal from '../components/fintech/RetailerDetailsModal';
import CreditAnalytics from '../components/fintech/CreditAnalytics';
import { useDashboardData } from '../hooks/useDashboardData';

export default function FintechDashboard() {
  const { stats, loading, error, refreshData } = useDashboardData();
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [isCreditLimitModalOpen, setIsCreditLimitModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('assessments');

  const handleCreditLimitUpdate = async (retailerId: string, newLimit: number) => {
    try {
      await fintech.updateCreditLimit(retailerId, newLimit);
      await refreshData();
      setIsCreditLimitModalOpen(false);
    } catch (err) {
      console.error('Failed to update credit limit:', err);
    }
  };

  const handleViewDetails = (retailer: any) => {
    setSelectedRetailer(retailer);
    setIsDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Fintech Dashboard</h1>
          <p className="text-gray-600">Monitor credit assessments and risk management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Credit</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{stats?.totalCreditExtended?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Retailers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.activeRetailers || '0'}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.pendingAssessments || '0'}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interest Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.averageInterestRate || '0'}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Percent className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Default Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.defaultRate || '0'}%
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{stats?.totalDueAmount?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('assessments')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assessments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Credit Assessments
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'assessments' ? (
          <RetailerAssessmentList
            onSelectRetailer={setSelectedRetailer}
            onUpdateCreditLimit={() => setIsCreditLimitModalOpen(true)}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <CreditAnalytics />
        )}

        {/* Modals */}
        {selectedRetailer && (
          <>
            <CreditLimitModal
              isOpen={isCreditLimitModalOpen}
              onClose={() => setIsCreditLimitModalOpen(false)}
              retailer={selectedRetailer}
              onUpdate={handleCreditLimitUpdate}
            />
            <RetailerDetailsModal
              isOpen={isDetailsModalOpen}
              onClose={() => setIsDetailsModalOpen(false)}
              retailerId={selectedRetailer.id}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}