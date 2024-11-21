import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const mockData = {
  creditDistribution: [
    { range: '0-1L', count: 45 },
    { range: '1L-5L', count: 30 },
    { range: '5L-10L', count: 15 },
    { range: '10L+', count: 10 },
  ],
  defaultTrend: [
    { month: 'Jan', rate: 2.1 },
    { month: 'Feb', rate: 2.3 },
    { month: 'Mar', rate: 2.0 },
    { month: 'Apr', rate: 1.8 },
    { month: 'May', rate: 1.9 },
    { month: 'Jun', rate: 2.2 },
  ],
};

export default function CreditAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credit Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Credit Limit Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.creditDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Default Rate Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Default Rate Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.defaultTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Risk Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800">Average Credit Score</h4>
            <p className="text-2xl font-bold text-blue-900 mt-1">725</p>
            <p className="text-sm text-blue-600 mt-2">↑ 2.5% from last month</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm font-medium text-green-800">Recovery Rate</h4>
            <p className="text-2xl font-bold text-green-900 mt-1">98.2%</p>
            <p className="text-sm text-green-600 mt-2">↑ 0.5% from last month</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="text-sm font-medium text-purple-800">Average Days to Pay</h4>
            <p className="text-2xl font-bold text-purple-900 mt-1">12.5</p>
            <p className="text-sm text-purple-600 mt-2">↓ 1.2 days from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
}