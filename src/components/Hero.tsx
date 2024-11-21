import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, Users, Store, CreditCard, Bell, Clock } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white pt-16">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Secure Credit Access for</span>{' '}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600 xl:inline">
                  Indian Businesses
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Bridge the trust gap between suppliers and retailers. Get guaranteed payments and flexible credit terms with DhandhaSuruu.
              </p>
              
              <div className="mt-8 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-orange-600 bg-orange-100 hover:bg-orange-200 md:py-4 md:text-lg md:px-10"
                >
                  Learn More
                </button>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-orange-100 to-blue-100 text-orange-600 mx-auto">
                  <Store className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 text-center">Digital Khata</h3>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Maintain all your business transactions digitally with our smart ledger system
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-orange-100 to-blue-100 text-blue-600 mx-auto">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 text-center">Instant Credit</h3>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Get approved for business credit based on your transaction history
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-orange-100 to-blue-100 text-orange-600 mx-auto">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 text-center">Smart Reminders</h3>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Automated payment reminders and collection tracking system
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-orange-100 to-blue-100 text-blue-600 mx-auto">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 text-center">Real-time Updates</h3>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Track payments, dues, and credit status in real-time
                </p>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-orange-100 to-blue-100 text-orange-600 mx-auto">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">Guaranteed Payments</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-orange-100 to-blue-100 text-blue-600 mx-auto">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">Flexible Credit Terms</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-orange-100 to-blue-100 text-orange-600 mx-auto">
                  <Users className="h-6 w-6" />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">Growing Network</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}