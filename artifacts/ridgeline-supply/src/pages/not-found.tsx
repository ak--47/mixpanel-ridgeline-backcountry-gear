import React from 'react';
import { Link } from 'wouter';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
            <AlertCircle className="h-10 w-10" />
          </div>
        </div>
        <h1 className="text-4xl font-display font-bold uppercase tracking-tight mb-4">
          Off Route
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          The page you're looking for doesn't exist. You might have strayed from the skin track.
        </p>
        <Button asChild size="lg" className="font-display uppercase tracking-widest">
          <Link href="/">Return to Basecamp</Link>
        </Button>
      </div>
    </div>
  );
}
