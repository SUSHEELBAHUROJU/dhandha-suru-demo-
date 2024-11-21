import React from 'react';
import { Wallet, Calendar, Users, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight, Phone } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalOutstanding: number;
    dueToday: number;
    totalRetailers: number;
    overdueAmount: number;
    thisMonthCollection: number;
    lastMonthCollection: number;
  };
  isLoading: boolean;
}

export default function DashboardStats({ stats = {
  totalOutstanding: 0,
  dueToday: 0,
  totalRetailers: 0,
  overdueAmount: 0,
  thisMonthCollection: 0,
  lastMonthCollection: 0
}, isLoading }: DashboardStatsProps) {
  const collectionGrowth = stats.lastMonthCollection ? 
    ((stats.thisMonthCollection - stats.lastMonthCollection) / stats.lastMonthCollection) * 100 : 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ₹{stats.totalOutstanding?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <Wallet className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">From {stats.totalRetailers || 0} retailers</p>
      </div>
      
      {/* Rest of the component remains the same */}
    </div>
  );
}