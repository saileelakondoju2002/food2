import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ShoppingCart, User, LogIn, Menu, X } from 'lucide-react';
import { groceryItems } from './data/groceryItems';
import CartModal from './components/CartModal';
import OrderHistory from './components/OrderHistory';

function App() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity > 0 && quantity <= 5) {
      setCart(prev => ({
        ...prev,
        [itemId]: quantity
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#a8e6cf] to-[#56ab2f]">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white bg-opacity-90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">GroceryExpress</h1>
          
          <nav className="hidden md:flex space-x-4">
            <button onClick={() => setShowCart(true)} className="btn-primary">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({Object.values(cart).reduce((a, b) => a + b, 0)})
            </button>
          </nav>

          <button className="md:hidden" onClick={() => setShowMobileMenu(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {groceryItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-md mb-4" />
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">${item.price.toFixed(2)}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id.toString(), (cart[item.id] || 0) - 1)}
                    className="btn-icon"
                  >
                    <span className="text-xl">-</span>
                  </button>
                  <span>{cart[item.id] || 0}</span>
                  <button
                    onClick={() => updateQuantity(item.id.toString(), (cart[item.id] || 0) + 1)}
                    className="btn-icon"
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
                
                <button
                  onClick={() => addToCart(item.id.toString())}
                  className="btn-primary"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 right-0 w-64 bg-white p-4">
            <button
              onClick={() => setShowMobileMenu(false)}
              className="absolute top-4 right-4"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mt-12 flex flex-col space-y-4">
              <button onClick={() => setShowCart(true)} className="btn-primary">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart ({Object.values(cart).reduce((a, b) => a + b, 0)})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        items={groceryItems}
      />
    </div>
  );
}

export default App;