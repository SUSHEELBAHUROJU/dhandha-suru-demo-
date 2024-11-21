import React, { useState, useEffect } from 'react';
import { Search, Phone, User, Building2, MapPin } from 'lucide-react';
import { retailers } from '../../services/api';

interface Retailer {
  id: string;
  business_name: string;
  phone: string;
  address: string;
  credit_score?: number;
  total_dues?: number;
  payment_history?: string;
}

interface RetailerSearchProps {
  onRetailerSelect: (retailer: Retailer) => void;
}

export default function RetailerSearch({ onRetailerSelect }: RetailerSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Retailer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentRetailers, setRecentRetailers] = useState<Retailer[]>([]);

  // Load recent retailers on component mount
  useEffect(() => {
    loadRecentRetailers();
  }, []);

  const loadRecentRetailers = async () => {
    try {
      const response = await retailers.getAll();
      setRecentRetailers(response);
    } catch (err) {
      console.error('Failed to load recent retailers:', err);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setSearchQuery(query);
      setError(null);

      if (!query.trim()) {
        setSearchResults(recentRetailers);
        return;
      }

      if (query.length < 3) {
        return;
      }

      setIsLoading(true);
      const response = await retailers.search(query);
      setSearchResults(response);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search retailers. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentHistoryColor = (history: string) => {
    switch (history) {
      case 'excellent':
        return 'text-green-600 bg-green-50';
      case 'good':
        return 'text-blue-600 bg-blue-50';
      case 'fair':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="max-w-2xl">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Retailers
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="search"
              type="text"
              placeholder="Search by business name, phone number, or address..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Enter at least 3 characters to search
          </p>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
        {isLoading ? (
          <div className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <span className="ml-2 text-gray-600">Searching retailers...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            <p>{error}</p>
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map((retailer) => (
            <div
              key={retailer.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-orange-100 to-blue-100 p-3 rounded-full">
                    <Building2 className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {retailer.business_name}
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-1" />
                      {retailer.phone}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {retailer.address}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {retailer.credit_score && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">Credit Score</span>
                      <p className="font-medium text-gray-900">{retailer.credit_score}</p>
                    </div>
                  )}
                  {retailer.payment_history && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      getPaymentHistoryColor(retailer.payment_history)
                    }`}>
                      {retailer.payment_history.charAt(0).toUpperCase() + retailer.payment_history.slice(1)} Payer
                    </span>
                  )}
                  <button
                    onClick={() => onRetailerSelect(retailer)}
                    className="mt-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-blue-700"
                  >
                    Add Due Entry
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : searchQuery.length >= 3 ? (
          <div className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No retailers found matching "{searchQuery}"</p>
            <p className="text-sm text-gray-500">
              Try searching with a different business name or phone number
            </p>
          </div>
        ) : recentRetailers.length > 0 ? (
          <>
            <div className="p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700">Recent Retailers</h3>
            </div>
            {recentRetailers.map((retailer) => (
              <div
                key={retailer.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-orange-100 to-blue-100 p-3 rounded-full">
                      <Building2 className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {retailer.business_name}
                      </h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-1" />
                        {retailer.phone}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRetailerSelect(retailer)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-blue-700"
                  >
                    Add Due Entry
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>Start typing to search for retailers</p>
          </div>
        )}
      </div>
    </div>
  );
}