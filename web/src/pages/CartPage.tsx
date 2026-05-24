import React, { useEffect, useState } from 'react';
import { productService, CartItem } from '../services/productService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await productService.getCart();
      setCartItems(data);
    } catch (err) {
      setError('Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await productService.removeFromCart(id);
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const handleClear = async () => {
    try {
      await productService.clearCart();
      setCartItems([]);
    } catch (err) {
      setError('Failed to clear cart');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (loading) return <div className="p-8 text-center">Loading cart...</div>;

  return (
    <div className="home-container">
      <header className="navbar">
        <h1>AttendEase</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/cart">Cart</a>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
      </header>

      <main className="p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-800">Your Shopping Cart</h2>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-600">Your cart is empty.</p>
            <button 
              onClick={() => navigate('/products')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Subtotal</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded mr-4" />
                      <span className="font-medium">{item.product.name}</span>
                    </td>
                    <td className="px-6 py-4">${item.product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4 font-semibold">${(item.product.price * item.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-6 bg-gray-50 flex justify-between items-center">
              <button 
                onClick={handleClear}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                Clear Cart
              </button>
              <div className="text-right">
                <p className="text-gray-600">Total Amount:</p>
                <p className="text-3xl font-bold text-blue-800">${total.toFixed(2)}</p>
                <button className="mt-4 bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer mt-auto">
        <p>&copy; 2024 AttendEase. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CartPage;
