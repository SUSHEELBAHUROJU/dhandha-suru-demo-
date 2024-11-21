import React from 'react';
import { Building2, ArrowRight, ShieldCheck, Store, CreditCard } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Retailer Registration',
    description: 'Retailers sign up and undergo a comprehensive creditworthiness assessment.',
    icon: Building2,
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 2,
    title: 'Credit Approval',
    description: 'Our fintech partners evaluate and approve credit limits based on assessment.',
    icon: ShieldCheck,
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 3,
    title: 'Supplier Connection',
    description: 'Approved retailers connect with suppliers on the platform.',
    icon: Store,
    gradient: 'from-orange-500 to-blue-600'
  },
  {
    id: 4,
    title: 'Guaranteed Transactions',
    description: 'Suppliers provide credit with confidence, backed by our guarantee.',
    icon: CreditCard,
    gradient: 'from-blue-600 to-orange-500'
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-white py-12" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold tracking-wide uppercase bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">Process</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            A simple, transparent process to build trust between suppliers and retailers.
          </p>
        </div>

        <div className="mt-16">
          <div className="space-y-16">
            {steps.map((step, stepIdx) => (
              <div key={step.id} className="relative">
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center w-full">
                    <span className={`h-12 w-12 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center ring-8 ring-white`}>
                      <step.icon className="h-6 w-6 text-white" />
                    </span>
                    <div className="ml-6 w-full">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        {step.title}
                        <ArrowRight className={`h-5 w-5 ml-2 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`} />
                      </h3>
                      <p className="mt-2 text-base text-gray-500">{step.description}</p>
                    </div>
                  </div>
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute left-6 top-14 h-16 w-px bg-gradient-to-b from-orange-500 to-blue-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}