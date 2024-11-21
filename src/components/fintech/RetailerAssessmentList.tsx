import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpRight } from 'lucide-react';
import { fintech, RetailerAssessment } from '../../services/api/fintech';

interface RetailerAssessmentListProps {
  onSelectRetailer: (retailer: RetailerAssessment) => void;
  onUpdateCreditLimit: () => void;
  onViewDetails: (retailer: RetailerAssessment) => void;
}

export default function RetailerAssessmentList({
  onSelectRetailer,
  onUpdateCreditLimit,
  onViewDetails
}: RetailerAssessmentListProps) {
  const [retailers, setRetailers] = useState<RetailerAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadRetailers();
  }, []);

  const loadRetailers = async () => {
    try {
      setLoading(true);
      const response = await fintech.getRetailersForAssessment();
      setRetailers(response);
    } catch (err) {
      console.error('Failed to load retailers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRetailers = retailers.filter(retailer => {
    const matchesSearch = retailer.business_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || retailer.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Retailer Assessments</h2>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search retailers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Retailers</option>
              <option value="pending">Pending Assessment</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredRetailers.map((retailer) => (
          <div key={retailer.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {retailer.business_name}
                </h3>
                <div className="mt-1 text-sm text-gray-500">
                  <p>Credit Score: {retailer.credit_score}</p>
                  <p>Years in Business: {retailer.years_in_business}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  retailer.status === 'approved' ? 'bg-green-100 text-green-800' :
                  retailer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {retailer.status.charAt(0).toUpperCase() + retailer.status.slice(1)}
                </span>
                <button
                  onClick={() => onViewDetails(retailer)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  View Details
                </button>
                <button
                  onClick={() => onSelectRetailer(retailer)}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  Update Credit Limit
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredRetailers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No retailers found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}