import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Calendar, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import TransactionModal from '../components/modals/TransactionModal';

interface Transaction {
  id: string;
  date: string;
  name: string;
  type: 'IN' | 'OUT';
  amount: number;
  paymentMode: string;
  description?: string;
}

export default function CashbookPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('All');
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [transactionType, setTransactionType] = useState<'IN' | 'OUT' | null>(null);

  const totalBalance = 25000; // Replace with actual calculation
  const todaysBalance = 1500; // Replace with actual calculation

  const transactions: Transaction[] = []; // Replace with actual data

  const handleAddTransaction = (type: 'IN' | 'OUT') => {
    setTransactionType(type);
    setIsAddingTransaction(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Total Balance</p>
              <p className="text-2xl font-bold">₹ {totalBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Today's Balance</p>
              <p className="text-2xl font-bold">₹ {todaysBalance.toLocaleString()}</p>
            </div>
            <div className="flex justify-end">
              <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100">
                View Report
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-600 mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-600">NAME</th>
                  <th className="text-right py-3 px-4 text-gray-600">OUT</th>
                  <th className="text-right py-3 px-4 text-gray-600">IN</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8">
                      <div className="max-w-sm mx-auto">
                        <img
                          src="/empty-transactions.svg"
                          alt="No transactions"
                          className="w-48 h-48 mx-auto mb-4"
                        />
                        <p className="text-gray-600 mb-4">Add your first transaction</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium">{transaction.name}</p>
                        <p className="text-sm text-gray-500">{transaction.description}</p>
                      </td>
                      <td className="text-right py-3 px-4">
                        {transaction.type === 'OUT' && (
                          <span className="text-red-600">₹ {transaction.amount.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="text-right py-3 px-4">
                        {transaction.type === 'IN' && (
                          <span className="text-green-600">₹ {transaction.amount.toLocaleString()}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => handleAddTransaction('OUT')}
              className="w-full py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium"
            >
              OUT
            </button>
            <button
              onClick={() => handleAddTransaction('IN')}
              className="w-full py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium"
            >
              IN
            </button>
          </div>
        </div>

        {isAddingTransaction && (
          <TransactionModal
            isOpen={isAddingTransaction}
            onClose={() => setIsAddingTransaction(false)}
            type={transactionType!}
          />
        )}
      </div>
    </DashboardLayout>
  );
}