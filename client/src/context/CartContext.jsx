import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getCart(token);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addItem(productId, quantity = 1) {
    const data = await api.addToCart(productId, quantity, token);
    setItems(data);
  }

  async function updateQuantity(productId, quantity) {
    const data = await api.updateCartItem(productId, quantity, token);
    setItems(data);
  }

  async function removeItem(productId) {
    const data = await api.removeCartItem(productId, token);
    setItems(data);
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, loading, total, count, addItem, updateQuantity, removeItem, refresh }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
