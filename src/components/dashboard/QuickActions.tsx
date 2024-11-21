import React from 'react';
import { PlusCircle, Calendar, FileText, TrendingUp } from 'lucide-react';

interface QuickActionsProps {
  onNewPurchase: () => void;
  onSchedulePayment: () => void;
  onViewReport: () => void;
}

export default function QuickActions({ onNewPurchase, onSchedulePayment, onViewReport }: QuickActionsProps) {
  const actions = [
    {
      name: 'New Purchase',
      icon: PlusCircle,
      onClick: onNewPurchase,
      color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
    },
    {
      name: 'Schedule Payment',
      icon: Calendar,
      onClick: onSchedulePayment,
      color: 'bg-green-50 text-green-700 hover:bg-green-100',
    },
    {
      name: 'View Report',
      icon: FileText,
      onClick: onViewReport,
      color: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.name}
            onClick={action.onClick}
            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${action.color}`}
          >
            <action.icon className="h-5 w-5 mr-2" />
            {action.name}
          </button>
        ))}
      </div>
    </div>
  );
}