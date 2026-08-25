import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { PRODUCTS, ProductCategory } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const CATEGORIES: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Equipment' },
  { id: 'skis', label: 'Touring Skis' },
  { id: 'splitboards', label: 'Splitboards' },
  { id: 'safety', label: 'Avy Safety' },
  { id: 'packs', label: 'Packs' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'poles', label: 'Poles' },
];

export default function Shop() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get('category') as ProductCategory | 'all' || 'all';
  
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>(initialCategory);
  const [sortOrder, setSortOrder] = useState<string>('featured');

  let filteredProducts = PRODUCTS;
  if (activeCategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
  }

  if (sortOrder === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else {
    // featured: bestsellers and new first
    filteredProducts.sort((a, b) => {
      const scoreA = (a.isBestseller ? 2 : 0) + (a.isNew ? 1 : 0);
      const scoreB = (b.isBestseller ? 2 : 0) + (b.isNew ? 1 : 0);
      return scoreB - scoreA;
    });
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">Equipment</h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm max-w-xl">
              Curated gear for the ascent and descent. Filtered by category, tested by experts.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="font-mono text-xs uppercase tracking-wider h-10">
                  Sort: {sortOrder.replace('-', ' ')} <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="font-mono text-xs uppercase">
                <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                  <DropdownMenuRadioItem value="featured">Featured</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-asc">Price: Low to High</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-desc">Price: High to Low</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-foreground font-display font-bold uppercase text-lg border-b pb-4">
                <SlidersHorizontal className="w-5 h-5" /> Filters
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Categories</h3>
                  <ul className="space-y-2">
                    {CATEGORIES.map(cat => (
                      <li key={cat.id}>
                        <button 
                          onClick={() => setActiveCategory(cat.id)}
                          className={cn(
                            "text-sm w-full text-left flex items-center justify-between py-1 transition-colors",
                            activeCategory === cat.id ? "font-bold text-primary" : "text-foreground hover:text-primary"
                          )}
                        >
                          <span className="uppercase font-display tracking-wide">{cat.label}</span>
                          {activeCategory === cat.id && <Check className="w-4 h-4" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-border rounded-lg">
                <p className="text-lg font-display uppercase tracking-widest text-muted-foreground">No products found in this category.</p>
                <Button variant="link" onClick={() => setActiveCategory('all')} className="mt-4 font-mono text-xs">Reset Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`} className="group cursor-pointer flex flex-col">
                    <div className="relative aspect-[3/4] bg-muted mb-4 overflow-hidden rounded-sm">
                      {product.isNew && (
                        <span className="absolute top-3 left-3 z-10 bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">New</span>
                      )}
                      {!product.isNew && product.isBestseller && (
                        <span className="absolute top-3 left-3 z-10 bg-secondary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Popular</span>
                      )}
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {product.images[1] && (
                        <img 
                          src={product.images[1]} 
                          alt={`${product.name} alternate view`} 
                          className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-mono">{product.category}</p>
                        <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-primary transition-colors mb-2">{product.name}</h3>
                      </div>
                      <p className="font-mono font-medium mt-auto">${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
