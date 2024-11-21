import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { PlusCircle, Calendar, FileText, TrendingUp, Users, AlertTriangle, Download } from 'lucide-react';
import { dues, retailers } from '../services';
import AddDueModal from '../components/modals/AddDueModal';
import DuesList from '../components/dashboard/DuesList';
import RetailerSearch from '../components/dashboard/RetailerSearch';
import { useDashboardData } from '../hooks/useDashboardData';
import PaymentReminder from '../components/dashboard/PaymentReminder';
import RetailerSelectModal from '../components/modals/RetailerSelectModal';
import type { Due } from '@/services/api/dues';
import type { Retailer } from '@/services/api/retailers';

export default function SupplierDashboard() {
  const { stats, loading: statsLoading, error: statsError, refreshData } = useDashboardData();
  const [isAddDueModalOpen, setIsAddDueModalOpen] = useState(false);
  const [isRetailerSelectModalOpen, setIsRetailerSelectModalOpen] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [duesList, setDuesList] = useState<Due[]>([]);
  const [retailersList, setRetailersList] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [duesData, retailersData] = await Promise.all([
          dues.getAll(),
          retailers.getAll()
        ]);

        if (mounted) {
          setDuesList(duesData);
          setRetailersList(retailersData);
          setIsInitialized(true);
        }
      } catch (err: any) {
        if (mounted) {
          console.error('Failed to load data:', err);
          setError(err.response?.data?.error || 'Failed to load dashboard data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleAddDue = async (dueData: {
    retailer: string;
    amount: number;
    description: string;
    purchase_date: string;
    due_date: string;
  }) => {
    try {
      setError(null);
      await dues.create(dueData);
      
      // Close modal first to prevent UI glitch
      setIsAddDueModalOpen(false);
      setSelectedRetailer(null);
      
      // Then refresh data
      await Promise.all([
        loadDuesAndRetailers(),
        refreshData()
      ]);
    } catch (err: any) {
      console.error('Failed to add due:', err);
      setError(err.response?.data?.error || 'Failed to create due entry');
      throw err;
    }
  };

  const loadDuesAndRetailers = async () => {
    try {
      setLoading(true);
      setError(null);
      const [duesData, retailersData] = await Promise.all([
        dues.getAll(),
        retailers.getAll()
      ]);
      setDuesList(duesData);
      setRetailersList(retailersData);
    } catch (err: any) {
      console.error('Failed to refresh data:', err);
      setError(err.response?.data?.error || 'Failed to refresh dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRetailerSelect = (retailer: Retailer) => {
    setSelectedRetailer(retailer);
    setIsRetailerSelectModalOpen(false);
    setIsAddDueModalOpen(true);
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
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>
            <p className="text-gray-600">Manage your business operations</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsRetailerSelectModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-blue-700 flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Due Entry
            </button>
            <button
              onClick={() => {/* Handle report download */}}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </button>
          </div>
        </div>

        {(error || statsError) && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error || statsError}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{stats?.totalOutstanding?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              From {stats?.activeRetailers || 0} retailers
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{stats?.monthlySales?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">This month's performance</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Retailers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.activeRetailers || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Total active accounts</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{stats?.overdueAmount?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Needs attention</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'retailers'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <PaymentReminder
                dues={duesList.filter((due) => due.status === 'overdue')}
                onUpdate={loadDuesAndRetailers}
              />
              <DuesList
                dues={duesList}
                onDueUpdate={loadDuesAndRetailers}
              />
            </div>
          </div>
        ) : (
          <RetailerSearch onRetailerSelect={handleRetailerSelect} />
        )}

        {/* Modals */}
        <AddDueModal
          isOpen={isAddDueModalOpen}
          onClose={() => {
            setIsAddDueModalOpen(false);
            setSelectedRetailer(null);
          }}
          onSubmit={handleAddDue}
          selectedRetailer={selectedRetailer}
        />

        <RetailerSelectModal
          isOpen={isRetailerSelectModalOpen}
          onClose={() => setIsRetailerSelectModalOpen(false)}
          onSelect={handleRetailerSelect}
        />
      </div>
    </DashboardLayout>
  );
}