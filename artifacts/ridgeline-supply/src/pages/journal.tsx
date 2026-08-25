import React from 'react';
import { JOURNAL_ENTRIES } from '@/lib/data';
import { ArrowUpRight, Clock, Calendar } from 'lucide-react';

export default function Journal() {
  const heroEntry = JOURNAL_ENTRIES[0];
  const remainingEntries = JOURNAL_ENTRIES.slice(1);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      {/* Texture Background for Journal Header */}
      <div className="absolute inset-0 h-[400px] w-full z-0 overflow-hidden pointer-events-none opacity-20">
        <img 
          src="/journal-texture.jpg" 
          alt="" 
          className="w-full h-full object-cover mix-blend-multiply"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <header className="mb-16 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tight mb-6">Field Guide</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Stories, technical guides, and dispatches from the high alpine. Wisdom earned through seasons of trial and error in the backcountry.
          </p>
        </header>

        {/* Hero Article */}
        <article className="mb-24 group cursor-pointer">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-muted order-2 lg:order-1">
              <img 
                src={heroEntry.image} 
                alt={heroEntry.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="order-1 lg:order-2 lg:pl-10">
              <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-primary mb-6 font-bold">
                <span>{heroEntry.category}</span>
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {heroEntry.readTime} min read</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight leading-none mb-6 group-hover:text-primary transition-colors">
                {heroEntry.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {heroEntry.excerpt}
              </p>
              <div className="flex items-center justify-between border-t pt-6">
                <div className="text-sm font-mono text-muted-foreground">
                  By {heroEntry.author} • {formatDate(heroEntry.date)}
                </div>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Grid Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {remainingEntries.map(entry => (
            <article key={entry.id} className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-muted mb-6">
                <img 
                  src={entry.image} 
                  alt={entry.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-primary mb-4 font-bold">
                  <span>{entry.category}</span>
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {entry.readTime} min read</span>
                </div>
                <h3 className="text-2xl font-display font-bold uppercase tracking-tight leading-tight mb-4 group-hover:text-primary transition-colors">
                  {entry.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed flex-1">
                  {entry.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <Calendar className="w-3 h-3" /> {formatDate(entry.date)}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t text-center">
          <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">More dispatches coming soon.</p>
        </div>
      </div>
    </div>
  );
}
