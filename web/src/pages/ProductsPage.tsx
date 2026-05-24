import React, { useEffect, useState } from 'react';
import { productService, Product } from '../services/productService';
import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/home.css'; // Reusing some styles or will use Tailwind

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await productService.addToCart(productId, 1);
      setSuccessMsg('Item added to cart!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to add item to cart');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="home-container">
      <header className="navbar">
        <h1>AttendEase</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
      </header>

      <main className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-blue-800">Available Products</h2>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {successMsg && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{successMsg}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <img 
                src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                  <button 
                    onClick={() => handleAddToCart(product.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  >
                    Add to Cart
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">In Stock: {product.stockQuantity}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer mt-auto">
        <p>&copy; 2024 AttendEase. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProductsPage;
