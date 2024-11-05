import React from 'react';
import { X } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Record<string, number>;
  items: Array<{
    id: number;
    name: string;
    price: number;
  }>;
}

export default function CartModal({ isOpen, onClose, cart, items }: CartModalProps) {
  if (!isOpen) return null;

  const cartItems = Object.entries(cart).map(([itemId, quantity]) => {
    const item = items.find(i => i.id === parseInt(itemId));
    if (!item) return null;
    return {
      ...item,
      quantity,
      subtotal: item.price * quantity
    };
  }).filter(Boolean);

  const subtotal = cartItems.reduce((sum, item) => sum + (item?.subtotal || 0), 0);
  const deliveryFee = 5.99;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => item && (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <button
                onClick={() => alert('This is a preview. Checkout is not implemented.')}
                className="w-full btn-primary mt-6"
              >
                Checkout • ${total.toFixed(2)}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}