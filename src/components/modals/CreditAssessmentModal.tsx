import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, AlertCircle } from 'lucide-react';
import { creditAssessment, CreditAssessmentData } from '../../services/api/creditAssessment';

interface CreditAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreditAssessmentModal({
  isOpen,
  onClose,
  onSuccess
}: CreditAssessmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreditAssessmentData>();

  const shopOwnership = watch('shopOwnership');
  const existingLoans = watch('existingLoans');

  const onSubmit = async (data: CreditAssessmentData) => {
    try {
      setLoading(true);
      setError(null);
      await creditAssessment.request(data);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <div>
            <h3 className="text-lg font-semibold">Credit Assessment Form</h3>
            <p className="text-sm text-gray-500 mt-1">
              Please provide accurate information for better credit evaluation
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Business Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Type</label>
                <select
                  {...register('businessType', { required: 'Business type is required' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select type</option>
                  <option value="retail_store">Retail Store</option>
                  <option value="wholesale">Wholesale Business</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="service">Service Business</option>
                </select>
                {errors.businessType && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Years in Business</label>
                <input
                  type="number"
                  {...register('yearsInBusiness', {
                    required: 'Years in business is required',
                    min: { value: 0, message: 'Years must be 0 or greater' }
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.yearsInBusiness && (
                  <p className="mt-1 text-sm text-red-600">{errors.yearsInBusiness.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Annual Turnover (₹)</label>
                <input
                  type="number"
                  {...register('annualTurnover', {
                    required: 'Annual turnover is required',
                    min: { value: 0, message: 'Turnover must be 0 or greater' }
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.annualTurnover && (
                  <p className="mt-1 text-sm text-red-600">{errors.annualTurnover.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Employees</label>
                <input
                  type="number"
                  {...register('employeeCount', {
                    required: 'Employee count is required',
                    min: { value: 1, message: 'Must have at least 1 employee' }
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.employeeCount && (
                  <p className="mt-1 text-sm text-red-600">{errors.employeeCount.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Shop Ownership</label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register('shopOwnership', { required: 'Shop ownership is required' })}
                    value="owned"
                    className="form-radio h-4 w-4 text-orange-600"
                  />
                  <span className="ml-2">Owned</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register('shopOwnership', { required: 'Shop ownership is required' })}
                    value="rented"
                    className="form-radio h-4 w-4 text-orange-600"
                  />
                  <span className="ml-2">Rented</span>
                </label>
              </div>
              {errors.shopOwnership && (
                <p className="mt-1 text-sm text-red-600">{errors.shopOwnership.message}</p>
              )}
            </div>

            {shopOwnership === 'rented' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Rent (₹)</label>
                <input
                  type="number"
                  {...register('monthlyRent', {
                    required: 'Monthly rent is required for rented shops',
                    min: { value: 0, message: 'Rent must be 0 or greater' }
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.monthlyRent && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthlyRent.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Bank Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
                <input
                  type="text"
                  {...register('bankAccountNumber', { required: 'Bank account number is required' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.bankAccountNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankAccountNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                <input
                  type="text"
                  {...register('ifscCode', {
                    required: 'IFSC code is required',
                    pattern: {
                      value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                      message: 'Invalid IFSC code format'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.ifscCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.ifscCode.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                <input
                  type="text"
                  {...register('bankName', { required: 'Bank name is required' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.bankName && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Branch</label>
                <input
                  type="text"
                  {...register('bankBranch', { required: 'Bank branch is required' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.bankBranch && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankBranch.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Existing Loans */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Existing Loans</h4>

            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  {...register('existingLoans')}
                  className="form-checkbox h-4 w-4 text-orange-600"
                />
                <span className="ml-2">I have existing business loans</span>
              </label>
            </div>

            {existingLoans && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loan Amount (₹)</label>
                  <input
                    type="number"
                    {...register('loanAmount', {
                      required: 'Loan amount is required if you have existing loans'
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {errors.loanAmount && (
                    <p className="mt-1 text-sm text-red-600">{errors.loanAmount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Loan Provider</label>
                  <input
                    type="text"
                    {...register('loanProvider', {
                      required: 'Loan provider is required if you have existing loans'
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {errors.loanProvider && (
                    <p className="mt-1 text-sm text-red-600">{errors.loanProvider.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly EMI (₹)</label>
                  <input
                    type="number"
                    {...register('monthlyEmi', {
                      required: 'Monthly EMI is required if you have existing loans'
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {errors.monthlyEmi && (
                    <p className="mt-1 text-sm text-red-600">{errors.monthlyEmi.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
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
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-md text-sm font-medium hover:from-orange-600 hover:to-blue-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}