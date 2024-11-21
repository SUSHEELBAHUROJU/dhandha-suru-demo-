import React from 'react';
import { FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  description: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  supplier: {
    businessName: string;
  };
}

interface InvoiceListProps {
  invoices: Invoice[];
  userType: 'supplier' | 'retailer';
}

export default function InvoiceList({ invoices, userType }: InvoiceListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-700 bg-green-50';
      case 'overdue':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-yellow-700 bg-yellow-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          {userType === 'supplier' ? 'Outstanding Invoices' : 'Payment Due'}
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-gray-100">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">Invoice #{invoice.invoiceNumber}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {invoice.description} • Due {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">₹{invoice.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{invoice.supplier.businessName}</p>
              </div>
            </div>

            {userType === 'retailer' && invoice.status !== 'paid' && (
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
                  Pay Now
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}