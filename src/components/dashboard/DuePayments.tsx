import React from 'react';
import { Calendar, IndianRupee, AlertTriangle, Clock } from 'lucide-react';
import { Due } from '../../services/api/dues';

interface DuePaymentsProps {
  payments: Due[];
  onPayment: (payment: Due) => void;
  isLoading: boolean;
}

export default function DuePayments({ payments, onPayment, isLoading }: DuePaymentsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="divide-y divide-gray-100">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-24 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sortedPayments = [...payments].sort((a, b) => {
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (a.status !== 'overdue' && b.status === 'overdue') return 1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return <Calendar className="h-5 w-5 text-green-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-600';
      case 'pending':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-green-100 text-green-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Due Payments</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {sortedPayments.map((payment) => (
          <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${getStatusColor(payment.status)}`}>
                  {getStatusIcon(payment.status)}
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">{payment.supplier.business_name}</h4>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{payment.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due: {new Date(payment.due_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">₹{payment.amount.toLocaleString()}</p>
                {payment.status !== 'paid' && (
                  <button
                    onClick={() => onPayment(payment)}
                    className="mt-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-blue-700"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {payments.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No due payments</p>
          </div>
        )}
      </div>
    </div>
  );
}