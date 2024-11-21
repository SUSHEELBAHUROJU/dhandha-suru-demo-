import React, { useState } from 'react';
import { CreditCard, Smartphone, Building2 } from 'lucide-react';

interface PaymentOptionsProps {
  amount: number;
  onPaymentSelect: (method: string) => void;
}

export default function PaymentOptions({ amount, onPaymentSelect }: PaymentOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState('');

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'Pay using any UPI app',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building2,
      description: 'Pay using your bank account',
    },
    {
      id: 'card',
      name: 'Card Payment',
      icon: CreditCard,
      description: 'Credit or Debit card',
    },
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    onPaymentSelect(methodId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Select Payment Method</h3>
      
      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => handleMethodSelect(method.id)}
            className={`flex items-center p-4 border rounded-lg ${
              selectedMethod === method.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200'
            }`}
          >
            <method.icon className={`h-6 w-6 ${
              selectedMethod === method.id ? 'text-indigo-500' : 'text-gray-400'
            }`} />
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">{method.name}</p>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>
            <div className="ml-4">
              <div className={`h-5 w-5 border-2 rounded-full ${
                selectedMethod === method.id
                  ? 'border-indigo-500 bg-indigo-500'
                  : 'border-gray-300'
              }`}>
                {selectedMethod === method.id && (
                  <div className="h-full w-full rounded-full bg-white border-2 border-indigo-500" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Amount to Pay</span>
          <span className="text-lg font-semibold text-gray-900">₹{amount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}