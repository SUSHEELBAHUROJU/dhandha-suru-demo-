import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface CreditLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  retailer: any;
  onUpdate: (retailerId: string, newLimit: number) => void;
}

export default function CreditLimitModal({
  isOpen,
  onClose,
  retailer,
  onUpdate
}: CreditLimitModalProps) {
  const [newLimit, setNewLimit] = useState(retailer?.credit_limit || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await onUpdate(retailer.id, newLimit);
    } catch (err: any) {
      setError(err.message || 'Failed to update credit limit');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold">Update Credit Limit</h3>
            <p className="text-sm text-gray-500 mt-1">{retailer.business_name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Credit Limit
              </label>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                ₹{retailer.credit_limit.toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Credit Limit
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(Number(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Assessment Details</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>Credit Score: {retailer.credit_score}</li>
                <li>Payment History: {retailer.payment_history || 'N/A'}</li>
                <li>Business Age: {retailer.years_in_business} years</li>
              </ul>
            </div>
          </div>

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
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Limit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}