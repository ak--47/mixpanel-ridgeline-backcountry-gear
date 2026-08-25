import React, { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronLeft, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const shipping = subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.08; // Fake 8% tax
  const total = subtotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      clearCart();
      setIsSuccess(true);
    }, 800);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-24 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-display font-bold uppercase tracking-tight">Order Confirmed</h1>
          <p className="text-muted-foreground">
            Your gear is being prepped for dispatch. We've sent a confirmation email with tracking details.
          </p>
          <div className="pt-6">
            <Button asChild size="lg" className="font-display uppercase tracking-widest">
              <Link href="/shop">Return to Shop</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-24 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-display font-bold uppercase tracking-tight">Your Cart is Empty</h1>
          <p className="text-muted-foreground">You need gear before you can check out.</p>
          <Button asChild>
            <Link href="/shop">Shop Equipment</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        <Link href="/shop" className="inline-flex items-center text-sm font-mono uppercase tracking-widest hover:text-primary transition-colors mb-8">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <h1 className="text-3xl font-display font-bold uppercase tracking-tight mb-8">Checkout</h1>
            
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Contact */}
              <section>
                <h2 className="text-lg font-display uppercase tracking-widest border-b pb-2 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required className="h-12 bg-white" />
                  </div>
                </div>
              </section>

              {/* Shipping */}
              <section>
                <h2 className="text-lg font-display uppercase tracking-widest border-b pb-2 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required className="h-12 bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required className="h-12 bg-white" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" required className="h-12 bg-white" />
                  </div>
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required className="h-12 bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" required className="h-12 bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP / Postal Code</Label>
                    <Input id="zip" required className="h-12 bg-white" />
                  </div>
                </div>
              </section>

              {/* Payment (Mock) */}
              <section>
                <h2 className="text-lg font-display uppercase tracking-widest border-b pb-2 mb-4">Payment</h2>
                <div className="bg-secondary/5 border border-secondary/20 p-6 rounded-md text-center text-secondary">
                  <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-mono mb-2">This is a demo environment.</p>
                  <p className="text-xs opacity-70">No real payment processing is connected. Clicking submit will complete a test order.</p>
                </div>
              </section>

              <Button type="submit" size="lg" className="w-full h-14 text-lg font-display uppercase tracking-widest">
                Place Order — ${total.toFixed(2)}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-muted/30 p-6 sm:p-8 rounded-sm border sticky top-24">
              <h2 className="text-lg font-display uppercase tracking-widest border-b pb-4 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.variant.id}`} className="flex gap-4">
                    <div className="w-16 h-20 bg-muted rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium font-display leading-tight">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 mb-2">
                        {item.variant.color && <span>{item.variant.color} / </span>}
                        {item.variant.size || 'One Size'}
                      </p>
                      <div className="flex justify-between items-center text-sm font-mono">
                        <span className="text-muted-foreground">Qty: {item.quantity}</span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-6 border-t font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-4 mt-2 border-t">
                  <span className="font-display text-lg uppercase tracking-widest font-bold">Total</span>
                  <span className="font-display text-xl font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
