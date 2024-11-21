import React from 'react';
import { CreditCard, TrendingUp, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CreditStatusProps {
  creditLimit: number;
  availableCredit: number;
  creditScore: number;
  creditHistory: Array<{
    date: string;
    amount: number;
  }>;
  isLoading: boolean;
  onRequestAssessment?: () => void;
}

export default function CreditStatus({
  creditLimit,
  availableCredit,
  creditScore,
  creditHistory,
  isLoading,
  onRequestAssessment
}: CreditStatusProps) {
  const utilizationPercentage = ((creditLimit - availableCredit) / creditLimit) * 100;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-green-500" />
          <span className="text-sm text-green-600 ml-2">Credit Score: {creditScore}</span>
        </div>
        {onRequestAssessment && (
          <button
            onClick={onRequestAssessment}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-blue-700"
          >
            Request Credit Assessment
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Credit Utilization</p>
            <p className="text-sm font-medium text-gray-900">{utilizationPercentage.toFixed(1)}%</p>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${utilizationPercentage}%`,
                backgroundColor: utilizationPercentage > 80 ? '#ef4444' : '#22c55e'
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Available Credit</p>
            <p className="text-2xl font-bold text-gray-900">₹{availableCredit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Limit</p>
            <p className="text-2xl font-bold text-gray-900">₹{creditLimit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-4">Credit History</h4>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={creditHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}