import React from 'react';
import { useOrders } from '../hooks/useOrders';
import { OrderStatus } from '../models/Order';
import OrderTracker from './OrderTracker';

export default function OrderHistory() {
  const { orders, loading, error } = useOrders();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-8 h-8 border-t-2 border-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        {error}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No orders yet</p>
      </div>
    );
  }

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">Order #{order.id?.slice(-6)}</h3>
              <p className="text-sm text-gray-600">
                {order.createdAt.toLocaleDateString()} at{' '}
                {order.createdAt.toLocaleTimeString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {order.status !== 'cancelled' && order.status !== 'pending' && (
            <OrderTracker order={order} />
          )}

          <div className="mt-4">
            <h4 className="font-medium mb-2">Order Items:</h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery Fee</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold mt-2">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Delivery Address:</h4>
            <p className="text-sm text-gray-600">
              {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
              {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}