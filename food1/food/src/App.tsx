import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ShoppingCart, User, LogIn, Menu, X, MapPin, Plus, Minus, HelpCircle } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { createOrder } from './services/orderService';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import CartModal from './components/CartModal';
import LocationModal from './components/LocationModal';
import { groceryItems } from './data/groceryItems';

function App() {
  const { currentUser, logout } = useAuth();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [address, setAddress] = useState('');
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

  const handleCheckout = async () => {
    if (!currentUser) {
      setShowLogin(true);
      return;
    }

    if (!address) {
      setShowLocation(true);
      return;
    }

    try {
      const orderItems = Object.entries(cart).map(([itemId, quantity]) => {
        const item = groceryItems.find(i => i.id === parseInt(itemId));
        return {
          id: parseInt(itemId),
          name: item!.name,
          quantity,
          price: item!.price
        };
      });

      const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      await createOrder({
        userId: currentUser.uid,
        items: orderItems,
        total,
        status: 'pending',
        deliveryAddress: address
      });

      setCart({});
      setShowCart(false);
    } catch (error) {
      console.error('Error creating order:', error);
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
            {currentUser ? (
              <>
                <span className="text-green-600">Welcome, {currentUser.email}</span>
                <button onClick={() => logout()} className="btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => setShowLogin(true)} className="btn-primary">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </button>
                <button onClick={() => setShowRegister(true)} className="btn-secondary">
                  <User className="w-4 h-4 mr-2" />
                  Register
                </button>
              </>
            )}
            
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
                    <Minus className="w-4 h-4" />
                  </button>
                  <span>{cart[item.id] || 0}</span>
                  <button
                    onClick={() => updateQuantity(item.id.toString(), (cart[item.id] || 0) + 1)}
                    className="btn-icon"
                  >
                    <Plus className="w-4 h-4" />
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

      {/* Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => setShowLogin(false)}
      />
      
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSuccess={() => setShowRegister(false)}
      />
      
      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        onCheckout={handleCheckout}
        items={groceryItems}
      />
      
      <LocationModal
        isOpen={showLocation}
        onClose={() => setShowLocation(false)}
        onSetAddress={setAddress}
      />

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
              {currentUser ? (
                <>
                  <span className="text-green-600">Welcome, {currentUser.email}</span>
                  <button onClick={() => logout()} className="btn-secondary">Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowLogin(true)} className="btn-primary">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </button>
                  <button onClick={() => setShowRegister(true)} className="btn-secondary">
                    <User className="w-4 h-4 mr-2" />
                    Register
                  </button>
                </>
              )}
              
              <button onClick={() => setShowCart(true)} className="btn-primary">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart ({Object.values(cart).reduce((a, b) => a + b, 0)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;