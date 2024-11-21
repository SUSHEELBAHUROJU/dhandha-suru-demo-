import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { Due, dues } from '../../services/api/dues';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  payment: Due | null;
}

const PAYMENT_METHODS = [
  {
    id: 'upi',
    name: 'UPI Payment',
    icon: Smartphone,
    description: 'Pay using any UPI app'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: Building2,
    description: 'Pay using your bank account'
  },
  {
    id: 'card',
    name: 'Card Payment',
    icon: CreditCard,
    description: 'Credit or Debit card'
  }
];

export default function PaymentModal({ isOpen, onClose, onSuccess, payment }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod || !payment) return;

    setLoading(true);
    setError(null);

    try {
      await dues.makePayment(payment.id, {
        amount: payment.amount,
        payment_method: selectedMethod,
        reference_id: referenceId
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold">Make Payment</h3>
            <p className="text-sm text-gray-500 mt-1">
              to {payment.supplier.business_name}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-6 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Amount to Pay</span>
              <span className="text-lg font-semibold text-gray-900">
                ₹{payment.amount.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Due Date: {new Date(payment.due_date).toLocaleDateString()}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Select Payment Method</h4>
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                  selectedMethod === method.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-200'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="sr-only"
                />
                <method.icon className={`h-6 w-6 ${
                  selectedMethod === method.id ? 'text-orange-500' : 'text-gray-400'
                }`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{method.name}</p>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </label>
            ))}
          </div>

          {selectedMethod && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reference ID (Optional)
              </label>
              <input
                type="text"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter transaction reference ID"
              />
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedMethod || loading}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-md text-sm font-medium hover:from-orange-600 hover:to-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}