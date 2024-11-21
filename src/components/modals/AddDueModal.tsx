import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { Retailer } from '@/services/api/retailers';
import type { CreateDueData } from '@/services/api/dues';

interface AddDueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDueData) => Promise<void>;
  selectedRetailer: Retailer | null;
}

export default function AddDueModal({
  isOpen,
  onClose,
  onSubmit,
  selectedRetailer
}: AddDueModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setDueDate('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRetailer) {
      setError('Please select a retailer first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        retailer: selectedRetailer.id,
        amount: parseFloat(amount),
        description,
        purchase_date: purchaseDate,
        due_date: dueDate
      });
      
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add due entry');
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
            <h3 className="text-lg font-semibold">Add New Due Entry</h3>
            {selectedRetailer && (
              <p className="text-sm text-gray-500 mt-1">
                For {selectedRetailer.business_name}
              </p>
            )}
          </div>
          <button 
            onClick={() => {
              resetForm();
              onClose();
            }} 
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="0.00"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter product details or description"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={purchaseDate}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-md text-sm font-medium hover:from-orange-600 hover:to-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Due Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}