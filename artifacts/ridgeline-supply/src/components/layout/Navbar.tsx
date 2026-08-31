import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '@/hooks/use-cart';
import { useCartDrawer } from '@/components/cart/CartDrawerContext';
import { Mountain, ShoppingBag, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';

const MOBILE_NAV_LINKS = [
  { label: 'Shop All Equipment', href: '/shop' },
  { label: 'Touring Skis', href: '/shop?category=skis' },
  { label: 'Splitboards', href: '/shop?category=splitboards' },
  { label: 'Technical Apparel', href: '/shop?category=apparel' },
  { label: 'Field Guide Journal', href: '/journal' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { totalItems } = useCart();
  const { openDrawer } = useCartDrawer();

  // Handle scroll effect for sticky transparent nav
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const trackNav = (
    label: string,
    href: string,
    navLocation: 'header' | 'mobile_menu',
  ) =>
    track('nav_clicked', {
      nav_item: label,
      nav_href: href,
      nav_location: navLocation,
      cart_item_count: totalItems,
    });

  const isHome = location === '/';
  const navClass = cn(
    "fixed top-0 w-full z-40 transition-all duration-300 border-b",
    isHome && !isScrolled 
      ? "bg-transparent text-white border-transparent" 
      : "bg-white/90 backdrop-blur-md text-foreground border-border shadow-sm"
  );

  const linkClass = cn(
    "text-sm font-medium tracking-wide transition-colors hover:text-primary",
    isHome && !isScrolled ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-primary"
  );

  return (
    <>
      <header className={navClass}>
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              onClick={() => trackNav('logo', '/', 'header')}
              data-analytics-event="nav_clicked"
              data-analytics-nav-item="logo"
              className="flex items-center gap-2 group"
            >
              <Mountain className="w-6 h-6 group-hover:text-primary transition-colors" />
              <span className="font-display font-bold text-xl tracking-tight uppercase">RIDGELINE</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 ml-8">
              {[
                { label: 'Equipment', href: '/shop' },
                { label: 'Apparel', href: '/shop?category=apparel' },
                { label: 'Field Guide', href: '/journal' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => trackNav(link.label, link.href, 'header')}
                  data-analytics-event="nav_clicked"
                  data-analytics-nav-item={link.label}
                  className={linkClass}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" className={cn("rounded-full", isHome && !isScrolled && "text-white hover:bg-white/20 hover:text-white")}>
              <Search className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("rounded-full relative", isHome && !isScrolled && "text-white hover:bg-white/20 hover:text-white")}
              data-analytics-event="cart_drawer_toggled"
              onClick={() => {
                track('cart_drawer_toggled', {
                  action: 'open',
                  source: 'header',
                  cart_item_count: totalItems,
                });
                openDrawer();
              }}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">
                  {totalItems}
                </span>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("md:hidden rounded-full", isHome && !isScrolled && "text-white hover:bg-white/20 hover:text-white")}
              data-analytics-event="mobile_menu_toggled"
              onClick={() => {
                track('mobile_menu_toggled', { action: 'open' });
                setIsMobileMenuOpen(true);
              }}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-4 flex items-center justify-between border-b">
            <Link
              href="/"
              onClick={() => trackNav('logo', '/', 'mobile_menu')}
              data-analytics-event="nav_clicked"
              data-analytics-nav-item="logo"
              className="flex items-center gap-2"
            >
              <Mountain className="w-6 h-6" />
              <span className="font-display font-bold text-xl tracking-tight uppercase">RIDGELINE</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              data-analytics-event="mobile_menu_toggled"
              onClick={() => {
                track('mobile_menu_toggled', { action: 'close' });
                setIsMobileMenuOpen(false);
              }}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          <nav className="flex flex-col p-6 gap-6 text-2xl font-display">
            {MOBILE_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => trackNav(link.label, link.href, 'mobile_menu')}
                data-analytics-event="nav_clicked"
                data-analytics-nav-item={link.label}
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
