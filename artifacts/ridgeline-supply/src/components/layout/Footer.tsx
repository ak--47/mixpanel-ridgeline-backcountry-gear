import React from 'react';
import { Mountain, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16 border-t border-border/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <Mountain className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-xl tracking-tight uppercase">RIDGELINE</span>
            </Link>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed max-w-xs">
              Equipping dedicated backcountry travelers with the tools, knowledge, and inspiration to push deeper into the mountains.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-semibold mb-4 text-white">Equipment</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li><Link href="/shop?category=skis" className="hover:text-primary transition-colors">Touring Skis</Link></li>
              <li><Link href="/shop?category=splitboards" className="hover:text-primary transition-colors">Splitboards</Link></li>
              <li><Link href="/shop?category=safety" className="hover:text-primary transition-colors">Avalanche Safety</Link></li>
              <li><Link href="/shop?category=apparel" className="hover:text-primary transition-colors">Technical Apparel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-white">Culture</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li><Link href="/journal" className="hover:text-primary transition-colors">Field Guide</Link></li>
              <li><Link href="/journal" className="hover:text-primary transition-colors">Expedition Stories</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Our Ethos</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pro Team</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li><Link href="#" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Warranty</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li className="pt-4 flex gap-4">
                <a href="#" className="hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="hover:text-primary transition-colors"><Youtube className="w-5 h-5" /></a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary-foreground/50">
          <p>© {new Date().getFullYear()} Ridgeline Supply Co. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
