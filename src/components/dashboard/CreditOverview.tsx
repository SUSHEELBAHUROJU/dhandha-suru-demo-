import React from 'react';
import { CreditCard, TrendingUp, AlertCircle } from 'lucide-react';

interface CreditOverviewProps {
  creditLimit: number;
  availableCredit: number;
  nextPayment?: {
    amount: number;
    dueDate: string;
  };
  creditScore: number;
  onRequestAssessment?: () => void;
}

export default function CreditOverview({
  creditLimit,
  availableCredit,
  nextPayment,
  creditScore,
  onRequestAssessment
}: CreditOverviewProps) {
  const utilizationPercentage = ((creditLimit - availableCredit) / creditLimit) * 100;
  const isHighUtilization = utilizationPercentage > 80;

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CreditCard className="h-8 w-8 mr-3" />
          <h3 className="text-xl font-semibold">Credit Overview</h3>
        </div>
        {onRequestAssessment && (
          <button
            onClick={onRequestAssessment}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium"
          >
            Request Assessment
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Credit Utilization</span>
            <span>{utilizationPercentage.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isHighUtilization ? 'bg-red-400' : 'bg-white'
              }`}
              style={{ width: `${utilizationPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-indigo-200 text-sm">Available Credit</p>
            <p className="text-2xl font-bold">₹{availableCredit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-indigo-200 text-sm">Total Credit Limit</p>
            <p className="text-2xl font-bold">₹{creditLimit.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-indigo-500/30">
          <div>
            <p className="text-indigo-200 text-sm">Credit Score</p>
            <p className="text-xl font-semibold">{creditScore}</p>
          </div>
          {nextPayment && (
            <div>
              <p className="text-indigo-200 text-sm">Next Payment Due</p>
              <p className="text-xl font-semibold">₹{nextPayment.amount.toLocaleString()}</p>
              <p className="text-sm text-indigo-200">
                Due: {new Date(nextPayment.dueDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {isHighUtilization && (
          <div className="flex items-center bg-red-400/20 p-3 rounded-lg mt-4">
            <AlertCircle className="h-5 w-5 text-red-300 mr-2" />
            <span className="text-sm">High credit utilization may affect your credit score</span>
          </div>
        )}
      </div>
    </div>
  );
}