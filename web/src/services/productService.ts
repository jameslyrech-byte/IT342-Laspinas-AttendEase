import api from './api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getCart: async (): Promise<CartItem[]> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (productId: number, quantity: number): Promise<CartItem> => {
    const response = await api.post(`/cart/items?productId=${productId}&quantity=${quantity}`);
    return response.data;
  },

  removeFromCart: async (cartItemId: number): Promise<void> => {
    await api.delete(`/cart/items/${cartItemId}`);
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },
};
