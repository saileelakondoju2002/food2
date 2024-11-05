import React from 'react';
import { X } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Record<string, number>;
  onCheckout: () => void;
  items: Array<{
    id: number;
    name: string;
    price: number;
  }>;
}

export default function CartModal({ isOpen, onClose, cart, onCheckout, items }: CartModalProps) {
  if (!isOpen) return null;

  const total = Object.entries(cart).reduce((sum, [itemId, quantity]) => {
    const item = items.find(i => i.id === parseInt(itemId));
    return sum + (item ? item.price * quantity : 0);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {Object.entries(cart).length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              {Object.entries(cart).map(([itemId, quantity]) => {
                const item = items.find(i => i.id === parseInt(itemId));
                if (!item) return null;
                
                return (
                  <div key={itemId} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <div className="flex items-center space-x-4">
                      <span>{quantity}x</span>
                      <span>${(item.price * quantity).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">Total:</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              
              <button
                onClick={onCheckout}
                className="w-full btn-primary"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}