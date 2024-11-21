import React, { useState } from 'react';
import { Search, Phone, MapPin, ArrowRight } from 'lucide-react';

interface Retailer {
  id: number;
  business_name: string;
  phone: string;
  address: string;
}

interface RetailersListProps {
  retailers: Retailer[];
  onRetailerSelect: (retailer: Retailer) => void;
  onRetailerUpdate: () => void;
}

export default function RetailersList({ retailers, onRetailerSelect, onRetailerUpdate }: RetailersListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, recent

  const filteredRetailers = retailers
    .filter(retailer => 
      retailer.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.phone.includes(searchQuery)
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.business_name.localeCompare(b.business_name);
      }
      return 0;
    });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search retailers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="name">Sort by Name</option>
          <option value="recent">Sort by Recent</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
        {filteredRetailers.map((retailer) => (
          <div
            key={retailer.id}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{retailer.business_name}</h4>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Phone className="h-4 w-4 mr-1" />
                  {retailer.phone}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {retailer.address}
                </div>
              </div>
              <button
                onClick={() => onRetailerSelect(retailer)}
                className="flex items-center text-orange-600 hover:text-orange-700"
              >
                Add Due Entry
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        ))}

        {filteredRetailers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No retailers found</p>
          </div>
        )}
      </div>
    </div>
  );
}