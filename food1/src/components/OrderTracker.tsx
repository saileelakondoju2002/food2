import React from 'react';
import { Order } from '../models/Order';
import { Clock, Package, Truck, CheckCircle } from 'lucide-react';

interface OrderTrackerProps {
  order: Order;
}

export default function OrderTracker({ order }: OrderTrackerProps) {
  const steps = [
    { status: 'confirmed', icon: Clock, label: 'Order Confirmed' },
    { status: 'preparing', icon: Package, label: 'Preparing' },
    { status: 'out_for_delivery', icon: Truck, label: 'Out for Delivery' },
    { status: 'delivered', icon: CheckCircle, label: 'Delivered' }
  ];

  const getCurrentStep = () => {
    const statusIndex = steps.findIndex(step => step.status === order.status);
    return statusIndex === -1 ? 0 : statusIndex;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="w-full py-4">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.status} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center
              ${index <= currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
              <step.icon className="w-6 h-6" />
            </div>
            <span className="text-sm mt-2">{step.label}</span>
            {index < steps.length - 1 && (
              <div className={`h-1 w-24 mt-4
                ${index < currentStep ? 'bg-green-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
      
      {order.estimatedDeliveryTime && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Estimated delivery by{' '}
            {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      )}
    </div>
  );
}