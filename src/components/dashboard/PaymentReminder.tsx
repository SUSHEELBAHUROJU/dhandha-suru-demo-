import React, { useState } from 'react';
import { Send, Phone, AlertCircle } from 'lucide-react';

interface Due {
  id: string;
  retailerName: string;
  retailerPhone: string;
  amount: number;
  dueDate: string;
  status: string;
}

interface PaymentReminderProps {
  dues: Due[];
  onUpdate: () => void;
}

export default function PaymentReminder({ dues, onUpdate }: PaymentReminderProps) {
  const [sendingReminders, setSendingReminders] = useState<string[]>([]);

  const overdueEntries = dues.filter(
    due => due.status === 'overdue' || 
    (due.status === 'pending' && new Date(due.dueDate) <= new Date())
  );

  const handleSendReminder = async (dueId: string) => {
    try {
      setSendingReminders(prev => [...prev, dueId]);
      // TODO: Implement send reminder API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onUpdate();
    } catch (error) {
      console.error('Failed to send reminder:', error);
    } finally {
      setSendingReminders(prev => prev.filter(id => id !== dueId));
    }
  };

  const handleSendBulkReminders = async () => {
    try {
      const dueIds = overdueEntries.map(due => due.id);
      setSendingReminders(dueIds);
      // TODO: Implement bulk send reminder API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      onUpdate();
    } catch (error) {
      console.error('Failed to send bulk reminders:', error);
    } finally {
      setSendingReminders([]);
    }
  };

  if (overdueEntries.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Payment Reminders</h3>
          </div>
          <button
            onClick={handleSendBulkReminders}
            disabled={sendingReminders.length > 0}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50"
          >
            Send All Reminders
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {overdueEntries.map((due) => (
          <div key={due.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium text-gray-900">{due.retailerName}</h4>
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                    Overdue
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Phone className="h-4 w-4 mr-1" />
                  {due.retailerPhone}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Due Date: {new Date(due.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">₹{due.amount.toLocaleString()}</p>
                <button
                  onClick={() => handleSendReminder(due.id)}
                  disabled={sendingReminders.includes(due.id)}
                  className="mt-2 flex items-center text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                >
                  <Send className="h-4 w-4 mr-1" />
                  {sendingReminders.includes(due.id) ? 'Sending...' : 'Send Reminder'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}