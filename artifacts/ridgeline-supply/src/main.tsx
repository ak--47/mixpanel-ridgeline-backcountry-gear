import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';
import { initAnalytics } from '@/lib/analytics';

import './index.css';

// Init before the first render, not from an effect in App. React runs child
// effects before the parent's, so a page that tracks on mount — ProductDetail's
// product_viewed — used to fire track() before mixpanel.init() had installed the
// snippet's method stubs. On a cold load of /product/:id that threw
// "window.mixpanel?.track is not a function" and the ErrorBoundary replaced the
// whole page with "Something went wrong". Initializing here means the stubs
// exist before any component mounts, so the entry event is queued, not lost.
initAnalytics();

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
