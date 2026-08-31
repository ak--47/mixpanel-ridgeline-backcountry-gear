import React, { useState, useMemo, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { PRODUCTS, ProductVariant } from '@/lib/data';
import { track } from '@/lib/analytics';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import { useCartDrawer } from '@/components/cart/CartDrawerContext';
import { Button } from '@/components/ui/button';
import { ChevronRight, Heart, Minus, Plus, Ruler, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const productId = params?.id;
  const product = PRODUCTS.find(p => p.id === productId);
  
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { openDrawer } = useCartDrawer();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Derive available options
  const colors = useMemo(() => {
    if (!product) return [];
    const colorSet = new Set(product.variants.map(v => v.color).filter(Boolean));
    return Array.from(colorSet) as string[];
  }, [product]);

  const [selectedColor, setSelectedColor] = useState<string | undefined>(colors.length > 0 ? colors[0] : undefined);

  // Filter sizes based on selected color (if applicable)
  const availableVariants = useMemo(() => {
    if (!product) return [];
    return product.variants.filter(v => selectedColor ? v.color === selectedColor : true);
  }, [product, selectedColor]);

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    availableVariants.length > 0 && availableVariants[0].inStock ? availableVariants[0].id : undefined
  );

  const selectedVariant = useMemo(() => {
    return availableVariants.find(v => v.id === selectedVariantId);
  }, [availableVariants, selectedVariantId]);

  useEffect(() => {
    if (!product) return;
    track('product_viewed', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.price,
      is_new: Boolean(product.isNew),
      is_bestseller: Boolean(product.isBestseller),
    });
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center pt-24 text-center">
        <h1 className="text-3xl font-display font-bold uppercase tracking-widest mb-4">Equipment Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you are looking for has been discontinued or moved.</p>
        <Button asChild>
          <Link href="/shop">Return to Shop</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem(product, selectedVariant, quantity);

    track('add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.price,
      quantity,
      variant_id: selectedVariant.id,
      size: selectedVariant.size ?? 'One Size',
      color: selectedVariant.color,
      source: 'pdp',
    });

    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} (${selectedVariant.size || 'One Size'})`,
      duration: 3000,
    });
    
    openDrawer();
  };

  const isOutOfStock = availableVariants.every(v => !v.inStock);

  return (
    <div className="bg-background min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs font-mono uppercase tracking-widest text-muted-foreground mb-8">
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-muted relative rounded-sm overflow-hidden">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-cover animate-in fade-in duration-500"
                key={selectedImage} // forces re-render for animation
              />
              <button
                onClick={() => {
                  track('favorite_toggled', {
                    product_id: product.id,
                    product_name: product.name,
                    category: product.category,
                    price: product.price,
                    action: isFavorite(product.id) ? 'remove' : 'add',
                    source: 'pdp',
                  });
                  toggleFavorite(product.id);
                }}
                data-analytics-event="favorite_toggled"
                data-analytics-product-id={product.id}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:text-primary transition-colors"
              >
                <Heart className={cn("w-5 h-5 transition-colors", isFavorite(product.id) && "fill-primary text-primary")} />
              </button>
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "aspect-square bg-muted rounded-sm overflow-hidden border-2 transition-colors",
                      selectedImage === idx ? "border-primary" : "border-transparent hover:border-primary/50"
                    )}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              {product.isNew && (
                <span className="inline-block bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider mb-4">New Arrival</span>
              )}
              <h1 className="text-4xl sm:text-5xl font-display font-bold uppercase tracking-tight mb-4 leading-none">{product.name}</h1>
              <p className="text-2xl font-mono">${product.price.toFixed(2)}</p>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-10 text-lg">
              {product.description}
            </p>

            {/* Options */}
            <div className="space-y-8 mb-10 flex-1">
              {colors.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-mono uppercase tracking-widest font-bold">Color</span>
                    <span className="text-sm text-muted-foreground">{selectedColor}</span>
                  </div>
                  <div className="flex gap-3">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          track('variant_selected', {
                            product_id: product.id,
                            product_name: product.name,
                            option: 'color',
                            value: color,
                          });
                          setSelectedColor(color);
                        }}
                        data-analytics-event="variant_selected"
                        data-analytics-option="color"
                        className={cn(
                          "px-4 py-2 text-sm font-display uppercase tracking-wide border rounded-sm transition-all",
                          selectedColor === color ? "border-foreground bg-foreground text-white" : "border-border hover:border-foreground/50 text-foreground"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-mono uppercase tracking-widest font-bold">Size</span>
                  <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 underline underline-offset-4">
                    <Ruler className="w-3 h-3" /> Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableVariants.map(variant => {
                    const isSelected = selectedVariantId === variant.id;
                    const isDisabled = !variant.inStock;
                    
                    return (
                      <button
                        key={variant.id}
                        disabled={isDisabled}
                        onClick={() => {
                          track('variant_selected', {
                            product_id: product.id,
                            product_name: product.name,
                            option: 'size',
                            value: variant.size ?? 'One Size',
                            variant_id: variant.id,
                          });
                          setSelectedVariantId(variant.id);
                        }}
                        data-analytics-event="variant_selected"
                        data-analytics-option="size"
                        className={cn(
                          "py-3 text-sm font-display uppercase tracking-wide border rounded-sm transition-all relative overflow-hidden",
                          isSelected ? "border-primary bg-primary text-white" : "border-border text-foreground hover:border-foreground",
                          isDisabled && "opacity-50 cursor-not-allowed hover:border-border text-muted-foreground bg-muted/50"
                        )}
                      >
                        {variant.size || 'One Size'}
                        {isDisabled && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-[1px] bg-border rotate-45 transform origin-center absolute" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-muted/30 p-6 rounded-sm border mb-8">
              {isOutOfStock ? (
                <div className="flex items-center gap-2 text-destructive font-bold uppercase tracking-widest text-sm mb-4">
                  <AlertCircle className="w-4 h-4" /> Out of stock
                </div>
              ) : (
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center border rounded-md bg-white">
                    <button 
                      className="p-3 hover:text-primary transition-colors disabled:opacity-50"
                      onClick={() => {
                        track('pdp_quantity_changed', {
                          product_id: product.id,
                          product_name: product.name,
                          direction: 'decrement',
                          previous_quantity: quantity,
                          new_quantity: Math.max(1, quantity - 1),
                        });
                        setQuantity(Math.max(1, quantity - 1));
                      }}
                      data-analytics-event="pdp_quantity_changed"
                      data-analytics-direction="decrement"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-mono">{quantity}</span>
                    <button 
                      className="p-3 hover:text-primary transition-colors disabled:opacity-50"
                      onClick={() => {
                        track('pdp_quantity_changed', {
                          product_id: product.id,
                          product_name: product.name,
                          direction: 'increment',
                          previous_quantity: quantity,
                          new_quantity: quantity + 1,
                        });
                        setQuantity(quantity + 1);
                      }}
                      data-analytics-event="pdp_quantity_changed"
                      data-analytics-direction="increment"
                      disabled={selectedVariant ? quantity >= selectedVariant.stockCount : false}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {selectedVariant && selectedVariant.stockCount < 5 && (
                      <span className="text-primary font-bold">Only {selectedVariant.stockCount} left</span>
                    )}
                  </div>
                </div>
              )}

              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-display uppercase tracking-widest"
                data-analytics-event="add_to_cart"
                data-analytics-product-id={product.id}
                data-analytics-price={product.price}
                onClick={handleAddToCart}
                disabled={!selectedVariant || !selectedVariant.inStock}
              >
                {selectedVariant && !selectedVariant.inStock ? 'Out of Stock' : 'Add to Kit'}
              </Button>
            </div>

            {/* Tech Specs */}
            <Accordion type="single" collapsible className="w-full" defaultValue="specs">
              <AccordionItem value="specs">
                <AccordionTrigger className="text-lg font-display uppercase tracking-widest hover:text-primary transition-colors">Technical Specifications</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2 pb-4">
                    {Object.entries(product.technicalSpecs).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-3 py-2 border-b border-border/50 last:border-0">
                        <span className="font-bold text-xs uppercase tracking-widest text-muted-foreground col-span-1">{key}</span>
                        <span className="font-mono text-sm col-span-2 text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-lg font-display uppercase tracking-widest hover:text-primary transition-colors">Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Free standard shipping on all orders over $150. Expedited options available at checkout. 
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Unused gear can be returned within 60 days of purchase. Hardgoods (skis, bindings, safety equipment) must be in original packaging and unregistered.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </div>
        </div>
      </div>
    </div>
  );
}
