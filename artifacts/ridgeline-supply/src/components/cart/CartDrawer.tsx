import React from 'react';
import { useCart } from '@/hooks/use-cart';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const [, setLocation] = useLocation();

  const FREE_SHIPPING_THRESHOLD = 150;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  const handleCheckout = () => {
    onClose();
    setLocation('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l-0 sm:border-l">
        <div className="p-6 border-b flex items-center justify-between bg-white z-10">
          <SheetTitle className="font-display text-2xl flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Cart ({totalItems})
          </SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </SheetClose>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-muted/20">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <div>
                <p className="font-medium text-foreground text-lg">Your cart is empty.</p>
                <p className="text-sm mt-1">Time to gear up for the mountains.</p>
              </div>
              <Button onClick={onClose} className="mt-4" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white p-4 border rounded-md shadow-sm">
                <p className="text-sm font-medium mb-2">
                  {amountToFreeShipping === 0 
                    ? "✨ You've unlocked free shipping!" 
                    : `You are $${amountToFreeShipping.toFixed(2)} away from free shipping.`}
                </p>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.variant.id}`} className="flex gap-4 bg-white p-4 border rounded-md shadow-sm">
                    <div className="w-20 h-24 bg-muted rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium font-display leading-tight">{item.product.name}</h4>
                          <button onClick={() => removeItem(item.product.id, item.variant.id)} className="text-muted-foreground hover:text-destructive">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.variant.color && <span>{item.variant.color}</span>}
                          {item.variant.color && item.variant.size && <span> / </span>}
                          {item.variant.size && <span>{item.variant.size}</span>}
                        </p>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border rounded-md">
                          <button 
                            className="p-1 hover:bg-muted"
                            onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                          <button 
                            className="p-1 hover:bg-muted"
                            onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                            disabled={item.quantity >= item.variant.stockCount}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-mono font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t bg-white space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
            <div className="flex justify-between items-center text-lg font-display">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">Shipping and taxes calculated at checkout.</p>
            <Button className="w-full text-lg h-12" onClick={handleCheckout}>
              Checkout <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
