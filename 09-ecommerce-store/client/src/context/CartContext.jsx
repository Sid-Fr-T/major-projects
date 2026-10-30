// client/src/context/CartContext.jsx
// Manages shopping cart state, quantity changes, and persistence in localStorage

import { useState, useEffect } from 'react';
import { CartContext } from './cartContextInstance';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('shopping_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync cart changes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shopping_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart to localStorage:', e);
    }
  }, [cart]);

  // Add a product to cart or increment quantity
  const addToCart = (product, qty = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item._id === product._id);
      const maxStock = product.stock !== undefined ? product.stock : 999;

      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity;
        const newQty = Math.min(currentQty + qty, maxStock);
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          stock: maxStock,
        };
        return updated;
      }

      const initialQty = Math.min(qty, maxStock > 0 ? maxStock : 1);
      return [
        ...prevCart,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: product.stock,
          quantity: initialQty,
        },
      ];
    });
  };

  // Remove a product from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // Update specific product quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item._id === productId) {
          const maxStock = item.stock !== undefined ? item.stock : 999;
          const cappedQty = Math.min(newQuantity, maxStock);
          return { ...item, quantity: cappedQty };
        }
        return item;
      })
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('shopping_cart');
  };

  // Computed totals
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

