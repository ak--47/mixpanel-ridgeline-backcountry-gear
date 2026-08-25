import { useState, useEffect } from 'react';
import { Product, ProductVariant } from '@/lib/data';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('ridgeline_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ridgeline_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    setItems(current => {
      const existing = current.find(item => item.product.id === product.id && item.variant.id === variant.id);
      if (existing) {
        return current.map(item => 
          item.product.id === product.id && item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { product, variant, quantity }];
    });
  };

  const removeItem = (productId: string, variantId: string) => {
    setItems(current => current.filter(item => !(item.product.id === productId && item.variant.id === variantId)));
  };

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(current => 
      current.map(item => 
        item.product.id === productId && item.variant.id === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, subtotal, totalItems };
}
