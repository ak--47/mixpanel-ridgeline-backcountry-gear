import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Product, ProductVariant } from '@/lib/data';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * The cart lives in one place. Navbar, CartDrawer, ProductDetail and Checkout
 * all read the same state — before this was a provider, each of them held its
 * own useState copy and only ever saw the others' writes after a full page
 * load, so adding from a PDP left the drawer and the badge showing an empty
 * cart. localStorage is the persistence layer, not the sync layer.
 */
export function CartProvider({ children }: { children: ReactNode }) {
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

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
