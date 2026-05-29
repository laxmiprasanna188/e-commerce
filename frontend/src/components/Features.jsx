import React from 'react';
import { Truck, ShieldCheck, Clock, CreditCard } from 'lucide-react';

const FeatureItem = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center p-6 text-center bg-white rounded-lg shadow-sm border border-gray-100 transition-transform hover:scale-105">
    <div className="p-3 mb-4 text-blue-600 bg-blue-50 rounded-full">
      <Icon size={32} />
    </div>
    <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const Features = () => {
  const featureData = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Enjoy free standard shipping on all orders over $50."
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "Your transactions are protected by industry-leading encryption."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our dedicated support team is available around the clock."
    },
    {
      icon: CreditCard,
      title: "Easy Returns",
      description: "Not satisfied? Return your items within 30 days for a full refund."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureData.map((feature, index) => (
            <FeatureItem key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
