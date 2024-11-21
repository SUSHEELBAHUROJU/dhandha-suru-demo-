import React, { useState, useEffect } from 'react';
import { X, Download, TrendingUp, AlertCircle } from 'lucide-react';
import { fintech } from '../../services/api/fintech';

interface RetailerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  retailerId: string;
}

export default function RetailerDetailsModal({
  isOpen,
  onClose,
  retailerId
}: RetailerDetailsModalProps) {
  const [loading, setLoading] = useState(true);
  const [retailerData, setRetailerData] = useState<any>(null);
  const [dues, setDues] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && retailerId) {
      loadRetailerDetails();
    }
  }, [isOpen, retailerId]);

  const loadRetailerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const [details, duesList] = await Promise.all([
        fintech.generateCreditReport(retailerId),
        fintech.getRetailerDues(retailerId)
      ]);
      setRetailerData(details);
      setDues(duesList);
    } catch (err: any) {
      setError(err.message || 'Failed to load retailer details');
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
            <h3 className="text-lg font-semibold">Retailer Details</h3>
            {retailerData && (
              <p className="text-sm text-gray-500 mt-1">{retailerData.business_name}</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Credit Score and Limits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800">Credit Score</h4>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {retailerData.credit_score}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800">Credit Limit</h4>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  ₹{retailerData.credit_limit.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-purple-800">Available Credit</h4>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  ₹{retailerData.available_credit.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-lg border p-4">
              <h4 className="text-lg font-medium mb-4">Payment History</h4>
              <div className="space-y-4">
                {dues.map((due: any) => (
                  <div key={due.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{due.description}</p>
                      <p className="text-sm text-gray-500">
                        Due Date: {new Date(due.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{due.amount.toLocaleString()}</p>
                      <p className={`text-sm ${
                        due.status === 'paid' ? 'text-green-600' :
                        due.status === 'overdue' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {due.status.charAt(0).toUpperCase() + due.status.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Details */}
            <div className="bg-white rounded-lg border p-4">
              <h4 className="text-lg font-medium mb-4">Business Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Business Type</p>
                  <p className="font-medium">{retailerData.business_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Years in Business</p>
                  <p className="font-medium">{retailerData.years_in_business} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Annual Turnover</p>
                  <p className="font-medium">₹{retailerData.annual_turnover.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">GST Number</p>
                  <p className="font-medium">{retailerData.gst_number}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => window.print()}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </button>
              <button
                onClick={() => {/* Handle credit score update */}}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Update Credit Score
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}