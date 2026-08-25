import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PRODUCTS, JOURNAL_ENTRIES } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { useCartDrawer } from '@/components/cart/CartDrawerContext';

export default function Home() {
  const featuredProducts = PRODUCTS.filter(p => p.isBestseller || p.isNew).slice(0, 4);
  const featuredJournal = JOURNAL_ENTRIES[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-secondary">
          {/* We'll use the generated image here, falling back to a CSS gradient if it fails to load or isn't ready */}
          <img 
            src="/hero-backcountry.jpg" 
            alt="Backcountry Skier" 
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center text-white mt-16">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tight mb-6 animate-in slide-in-from-bottom-8 duration-700">
            Beyond the <br/> Boundaries
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-in slide-in-from-bottom-8 duration-700 delay-150">
            Technical equipment and knowledge for the dedicated alpine traveler. Engineered for the ascent, built for the descent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button size="lg" className="h-14 px-8 text-lg font-display" asChild>
              <Link href="/shop">Shop Equipment</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-display bg-white/10 text-white border-white/20 hover:bg-white hover:text-secondary" asChild>
              <Link href="/journal">Read the Field Guide</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Equipment */}
      <section className="py-24 bg-background bg-noise">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight">Mission Critical</h2>
              <p className="text-muted-foreground mt-2 font-mono text-sm">TESTED IN THE TETONS. BUILT FOR EVERYWHERE.</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 font-display text-sm hover:text-primary transition-colors uppercase font-bold">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group cursor-pointer">
                <div className="relative aspect-[4/5] bg-muted mb-4 overflow-hidden rounded-sm">
                  {product.isNew && (
                    <span className="absolute top-3 left-3 z-10 bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">New</span>
                  )}
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{product.category}</p>
                    <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                  </div>
                  <p className="font-mono font-medium">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/shop">View All Equipment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Editorial Feature */}
      <section className="py-24 bg-white clip-diagonal">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-primary font-mono text-sm font-bold uppercase tracking-widest mb-4 block">Field Guide / {featuredJournal.category}</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight leading-none mb-6">
                {featuredJournal.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {featuredJournal.excerpt}
              </p>
              <Button asChild variant="outline" className="h-12 px-6 font-display uppercase tracking-wider">
                <Link href="/journal">Read Full Article <ArrowUpRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-square lg:aspect-[4/3] bg-muted relative overflow-hidden rounded-sm">
                <img 
                  src={featuredJournal.image} 
                  alt={featuredJournal.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="pt-8 md:pt-0 px-6">
              <h4 className="font-display text-xl font-bold uppercase mb-3">Field Tested</h4>
              <p className="text-white/70 text-sm leading-relaxed">Every piece of equipment is rigorously tested in the Tetons before it makes it to our shelves.</p>
            </div>
            <div className="pt-8 md:pt-0 px-6">
              <h4 className="font-display text-xl font-bold uppercase mb-3">Expert Support</h4>
              <p className="text-white/70 text-sm leading-relaxed">Our staff are certified guides and seasoned backcountry travelers. We know the gear because we rely on it.</p>
            </div>
            <div className="pt-8 md:pt-0 px-6">
              <h4 className="font-display text-xl font-bold uppercase mb-3">Alpine Warranty</h4>
              <p className="text-white/70 text-sm leading-relaxed">We stand behind our gear. If it fails you in the backcountry due to a defect, we'll replace it.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
