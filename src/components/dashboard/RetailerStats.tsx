import React from 'react';
import { IndianRupee, AlertTriangle, Calendar } from 'lucide-react';

interface RetailerStatsProps {
  stats: {
    totalDue: number;
    dueToday: number;
    overdueAmount: number;
  };
  isLoading: boolean;
}

export default function RetailerStats({ stats, isLoading }: RetailerStatsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Due Amount</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ₹{stats.totalDue.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <IndianRupee className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Due Today</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ₹{stats.dueToday.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              ₹{stats.overdueAmount.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}