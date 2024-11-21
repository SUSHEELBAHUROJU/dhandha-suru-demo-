import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, AlertCircle, Building2, Briefcase, CreditCard, FileText } from 'lucide-react';

interface CreditAssessmentFormData {
  // Business Information
  businessType: string;
  yearsInBusiness: number;
  annualTurnover: number;
  employeeCount: number;
  shopOwnership: 'owned' | 'rented';
  monthlyRent?: number;

  // Financial Information
  gstNumber: string;
  panNumber: string;
  bankAccountNumber: string;
  ifscCode: string;
  bankName: string;
  bankBranch: string;

  // Documents
  gstCertificate?: FileList;
  bankStatements?: FileList;
  financialStatements?: FileList;
  shopLicense?: FileList;
  ownershipDocs?: FileList;

  // Additional Information
  existingLoans: boolean;
  loanAmount?: number;
  loanProvider?: string;
  monthlyEmi?: number;
  
  // References
  references: {
    name: string;
    phone: string;
    relation: string;
  }[];
}

interface CreditAssessmentFormProps {
  onSubmit: (data: CreditAssessmentFormData) => void;
  isLoading?: boolean;
}

export default function CreditAssessmentForm({ onSubmit, isLoading = false }: CreditAssessmentFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreditAssessmentFormData>();
  const [documents, setDocuments] = useState<{ [key: string]: File | null }>({});

  const shopOwnership = watch('shopOwnership');
  const existingLoans = watch('existingLoans');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0] || null;
    setDocuments(prev => ({ ...prev, [fieldName]: file }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Business Information Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Building2 className="h-5 w-5 text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold">Business Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Type</label>
            <select
              {...register('businessType', { required: 'Business type is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="retail_store">Retail Store</option>
              <option value="wholesale">Wholesale Business</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="service">Service Business</option>
              <option value="distribution">Distribution</option>
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
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.employeeCount && (
              <p className="mt-1 text-sm text-red-600">{errors.employeeCount.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Shop Ownership</label>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('shopOwnership', { required: 'Shop ownership is required' })}
                value="owned"
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Owned</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('shopOwnership', { required: 'Shop ownership is required' })}
                value="rented"
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Rented</span>
            </label>
          </div>
          {errors.shopOwnership && (
            <p className="mt-1 text-sm text-red-600">{errors.shopOwnership.message}</p>
          )}

          {shopOwnership === 'rented' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Monthly Rent (₹)</label>
              <input
                type="number"
                {...register('monthlyRent', {
                  required: 'Monthly rent is required for rented shops',
                  min: { value: 0, message: 'Rent must be 0 or greater' }
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.monthlyRent && (
                <p className="mt-1 text-sm text-red-600">{errors.monthlyRent.message}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Financial Information Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold">Financial Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">GST Number</label>
            <input
              type="text"
              {...register('gstNumber', {
                required: 'GST number is required',
                pattern: {
                  value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                  message: 'Invalid GST number format'
                }
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.gstNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.gstNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">PAN Number</label>
            <input
              type="text"
              {...register('panNumber', {
                required: 'PAN number is required',
                pattern: {
                  value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                  message: 'Invalid PAN number format'
                }
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.panNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.panNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
            <input
              type="text"
              {...register('bankAccountNumber', { required: 'Bank account number is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.bankBranch && (
              <p className="mt-1 text-sm text-red-600">{errors.bankBranch.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <FileText className="h-5 w-5 text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold">Required Documents</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">GST Certificate</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      {...register('gstCertificate')}
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'gstCertificate')}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Statements (Last 6 months)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload files</span>
                    <input
                      type="file"
                      {...register('bankStatements')}
                      className="sr-only"
                      accept=".pdf"
                      multiple
                      onChange={(e) => handleFileChange(e, 'bankStatements')}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PDF files up to 10MB each</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Financial Statements</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload files</span>
                    <input
                      type="file"
                      {...register('financialStatements')}
                      className="sr-only"
                      accept=".pdf,.xlsx,.xls"
                      multiple
                      onChange={(e) => handleFileChange(e, 'financialStatements')}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PDF or Excel files up to 10MB each</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Loans Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold">Existing Loans</h2>
        </div>

        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register('existingLoans')}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2">I have existing business loans</span>
          </label>

          {existingLoans && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Loan Amount (₹)</label>
                <input
                  type="number"
                  {...register('loanAmount', {
                    required: 'Loan amount is required if you have existing loans'
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.monthlyEmi && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthlyEmi.message}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit Assessment'}
        </button>
      </div>

      {/* Information Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-blue-400" />
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              All information provided will be verified. Ensure all details are accurate and documents are clearly readable.
              Incomplete or incorrect information may delay your credit assessment.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}