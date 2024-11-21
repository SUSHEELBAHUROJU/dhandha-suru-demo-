import React, { useState, useEffect } from 'react';
import { X, Search, Phone, User } from 'lucide-react';
import { retailers } from '../../services/api';

interface RetailerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (retailer: any) => void;
}

export default function RetailerSelectModal({ isOpen, onClose, onSelect }: RetailerSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isOpen]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await retailers.search(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">Select Retailer</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by phone number or business name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {isLoading && (
            <div className="mt-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2">Searching retailers...</p>
            </div>
          )}

          <div className="mt-4 divide-y divide-gray-100">
            {searchResults.map((retailer: any) => (
              <div
                key={retailer.id}
                onClick={() => onSelect(retailer)}
                className="py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer rounded-lg px-4"
              >
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-orange-100 to-blue-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{retailer.business_name}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-1" />
                      {retailer.phone}
                    </div>
                  </div>
                </div>
                <button
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(retailer);
                  }}
                >
                  Select
                </button>
              </div>
            ))}
          </div>

          {searchQuery.length >= 3 && searchResults.length === 0 && !isLoading && (
            <div className="mt-4 text-center">
              <p className="text-gray-500">No retailers found</p>
              <button
                onClick={() => {
                  onClose();
                  // You can add logic here to open the AddRetailerModal
                }}
                className="mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                + Add New Retailer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}