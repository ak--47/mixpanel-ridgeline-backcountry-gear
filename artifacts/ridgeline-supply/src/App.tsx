import { type ReactNode, useEffect } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import { initAnalytics } from '@/lib/analytics';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

import Home from '@/pages/home';
import Shop from '@/pages/shop';
import ProductDetail from '@/pages/product';
import Journal from '@/pages/journal';
import Checkout from '@/pages/checkout';
import NotFound from '@/pages/not-found';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawerProvider } from '@/components/cart/CartDrawerContext';

function Router() {
  return (
    <RoutedErrorBoundary>
      <CartDrawerProvider>
        <div className="flex flex-col min-h-[100dvh]">
          <Navbar />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/shop" component={Shop} />
              <Route path="/product/:id" component={ProductDetail} />
              <Route path="/journal" component={Journal} />
              <Route path="/checkout" component={Checkout} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </CartDrawerProvider>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
