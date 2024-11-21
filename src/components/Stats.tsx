import React from 'react';

const stats = [
  { id: 1, name: 'MSMEs in India', value: '63M+' },
  { id: 2, name: 'Default Rate', value: '2-3%' },
  { id: 3, name: 'Commission Savings', value: '1.5%' },
  { id: 4, name: 'Dealer Network', value: '150+' },
];

export default function Stats() {
  return (
    <div className="bg-indigo-800" id="stats">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Trusted by businesses across India
          </h2>
          <p className="mt-3 text-xl text-indigo-200 sm:mt-4">
            Our platform delivers real results for suppliers and retailers
          </p>
        </div>
        <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-2 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
                {stat.name}
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}