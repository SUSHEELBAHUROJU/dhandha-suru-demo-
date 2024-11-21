import React, { useState, useEffect } from 'react';
import { X, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { fintech, EMIPlan } from '../../services/api/fintech';

interface EMIPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  dueId: string;
  totalAmount: number;
  onSuccess: () => void;
}

export default function EMIPlansModal({
  isOpen,
  onClose,
  dueId,
  totalAmount,
  onSuccess
}: EMIPlansModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emiPlans, setEmiPlans] = useState<EMIPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadEMIPlans();
    }
  }, [isOpen, dueId]);

  const loadEMIPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const plans = await fintech.getEMIPlans(dueId);
      setEmiPlans(plans);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load EMI plans');
    } finally {
      setLoading(false);
    }
  };

  const handleActivatePlan = async () => {
    if (!selectedPlan) return;

    try {
      setActivating(true);
      setError(null);
      await fintech.activateEMIPlan(dueId, selectedPlan);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to activate EMI plan');
    } finally {
      setActivating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold">EMI Plans</h3>
            <p className="text-sm text-gray-500 mt-1">
              Total Amount: ₹{totalAmount.toLocaleString()}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading EMI plans...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {emiPlans.map((plan) => (
                <label
                  key={plan.id}
                  className={`block p-4 border rounded-lg cursor-pointer ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="emiPlan"
                    value={plan.id}
                    checked={selectedPlan === plan.id}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {plan.tenure_months} Months
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        ₹{plan.monthly_amount.toLocaleString()}/month
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <p className="font-medium text-gray-900">
                        {plan.interest_rate}% p.a.
                      </p>
                    </div>
                  </div>
                </label>
              ))}

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleActivatePlan}
                  disabled={!selectedPlan || activating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {activating ? 'Activating...' : 'Activate Plan'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}