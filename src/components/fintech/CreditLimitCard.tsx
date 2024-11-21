import React from 'react';
import { CreditCard, AlertCircle } from 'lucide-react';

interface CreditLimitCardProps {
  creditLimit: number;
  availableCredit: number;
  creditScore: number;
  onRequestAssessment?: () => void;
}

export default function CreditLimitCard({
  creditLimit,
  availableCredit,
  creditScore,
  onRequestAssessment
}: CreditLimitCardProps) {
  const utilizationPercentage = ((creditLimit - availableCredit) / creditLimit) * 100;
  const isHighUtilization = utilizationPercentage > 80;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CreditCard className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 ml-2">Credit Status</h3>
        </div>
        {onRequestAssessment && (
          <button
            onClick={onRequestAssessment}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Request Assessment
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Credit Utilization</span>
            <span className={`text-sm font-medium ${
              isHighUtilization ? 'text-red-600' : 'text-gray-900'
            }`}>
              {utilizationPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isHighUtilization ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${utilizationPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Available Credit</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{availableCredit.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Credit Limit</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{creditLimit.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Credit Score</p>
              <p className="text-lg font-semibold text-gray-900">{creditScore}</p>
            </div>
            {isHighUtilization && (
              <div className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-1" />
                <span className="text-sm">High Usage Alert</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}