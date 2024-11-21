import React from 'react';
import { CreditCard as CreditCardIcon, ArrowUpRight } from 'lucide-react';
import { CreditStatus } from '../../types';

interface CreditCardProps {
  creditStatus: CreditStatus;
}

export default function CreditCard({ creditStatus }: CreditCardProps) {
  const utilizationPercentage = (creditStatus.utilized / creditStatus.limit) * 100;

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <CreditCardIcon className="h-8 w-8" />
          <h3 className="text-lg font-semibold mt-2">Credit Overview</h3>
        </div>
        <button className="text-indigo-200 hover:text-white flex items-center text-sm">
          View Details
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Credit Utilization</span>
            <span>{utilizationPercentage.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-indigo-900/30 rounded-full">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${utilizationPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-indigo-200 text-sm">Available Credit</p>
            <p className="text-2xl font-bold">₹{creditStatus.available.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-indigo-200 text-sm">Total Limit</p>
            <p className="text-2xl font-bold">₹{creditStatus.limit.toLocaleString()}</p>
          </div>
        </div>

        {creditStatus.nextPaymentDue && (
          <div className="pt-4 border-t border-indigo-500">
            <p className="text-sm text-indigo-200">Next Payment Due</p>
            <div className="flex justify-between items-center mt-1">
              <p className="font-semibold">
                ₹{creditStatus.nextPaymentAmount?.toLocaleString()}
              </p>
              <p className="text-sm">
                {new Date(creditStatus.nextPaymentDue).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}