import React, { useState } from 'react';
import { Calendar, ArrowUpRight, Search, Filter, Phone, Send } from 'lucide-react';

interface Due {
  id: string;
  retailerName: string;
  retailerPhone: string;
  amount: number;
  dueDate: string;
  purchaseDate: string;
  description: string;
  status: 'pending' | 'overdue' | 'paid';
}

interface DuesListProps {
  dues: Due[];
  onDueUpdate: () => void;
}

export default function DuesList({ dues = [], onDueUpdate }: DuesListProps) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');

  const filteredDues = dues.filter(due => {
    const matchesFilter = filter === 'all' || due.status === filter;
    const matchesSearch = 
      due.retailerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      due.retailerPhone.includes(searchQuery) ||
      due.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'amount':
        return b.amount - a.amount;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const totalDue = filteredDues.reduce((sum, due) => 
    due.status !== 'paid' ? sum + due.amount : sum, 0
  );

  const handleSendReminder = async (due: Due) => {
    // TODO: Implement send reminder functionality
    console.log('Sending reminder for:', due);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Due Entries</h3>
            <p className="text-sm text-gray-500 mt-1">
              Total Outstanding: ₹{totalDue.toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search dues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Entries</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="paid">Paid</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredDues.map((due) => (
          <div key={due.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  due.status === 'overdue' ? 'bg-red-100' : 
                  due.status === 'paid' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <Calendar className={`h-5 w-5 ${
                    due.status === 'overdue' ? 'text-red-600' :
                    due.status === 'paid' ? 'text-green-600' : 'text-orange-600'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium text-gray-900">{due.retailerName}</p>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      due.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      due.status === 'paid' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {due.status.charAt(0).toUpperCase() + due.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Phone className="h-4 w-4 mr-1" />
                    {due.retailerPhone}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Purchase Date: {new Date(due.purchaseDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{due.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">₹{due.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(due.dueDate).toLocaleDateString()}
                </p>
                {due.status !== 'paid' && (
                  <button 
                    onClick={() => handleSendReminder(due)}
                    className="mt-2 flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send Reminder
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredDues.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No due entries found</p>
          </div>
        )}
      </div>
    </div>
  );
}