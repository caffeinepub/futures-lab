import { useEffect, useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './lib/queries';
import { AuthGate } from './components/auth/AuthGate';
import { ProfileSetupModal } from './components/auth/ProfileSetupModal';
import { AppLayout } from './components/layout/AppLayout';
import { DatasetsPage } from './features/datasets/DatasetsPage';
import { PromptLibraryPage } from './features/prompts/PromptLibraryPage';
import { MetricsPage } from './features/metrics/MetricsPage';
import { BacktestConfigPage } from './features/backtests/BacktestConfigPage';
import { RunBacktestPage } from './features/backtests/RunBacktestPage';
import { BacktestResultsPage } from './features/backtests/BacktestResultsPage';
import { EpisodeReviewPage } from './features/episodes/EpisodeReviewPage';
import { TradingPortfolioPage } from './features/trading/TradingPortfolioPage';
import { TradingOrdersPage } from './features/trading/TradingOrdersPage';
import { TradingHistoryPage } from './features/trading/TradingHistoryPage';
import { TradingSafetyControlsPage } from './features/trading/TradingSafetyControlsPage';
import { AppInitGate } from './components/system/AppInitGate';
import { RouteErrorBoundary } from './components/system/RouteErrorBoundary';
import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

// Root route with layout and error boundary
const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
  errorComponent: RouteErrorBoundary,
});

// Define routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DatasetsPage,
});

const datasetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/datasets',
  component: DatasetsPage,
});

const configRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/config',
  component: BacktestConfigPage,
});

const runRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/run',
  component: RunBacktestPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results',
  component: BacktestResultsPage,
});

const episodesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/episodes',
  component: EpisodeReviewPage,
});

const promptsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/prompts',
  component: PromptLibraryPage,
});

const metricsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/metrics',
  component: MetricsPage,
});

const portfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trading/portfolio',
  component: TradingPortfolioPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trading/orders',
  component: TradingOrdersPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trading/history',
  component: TradingHistoryPage,
});

const safetyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trading/safety',
  component: TradingSafetyControlsPage,
});

// Create router
const routeTree = rootRoute.addChildren([
  indexRoute,
  datasetsRoute,
  configRoute,
  runRoute,
  resultsRoute,
  episodesRoute,
  promptsRoute,
  metricsRoute,
  portfolioRoute,
  ordersRoute,
  historyRoute,
  safetyRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const INIT_TIMEOUT = 3000; // 3 seconds for initialization

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [initTimedOut, setInitTimedOut] = useState(false);

  const isAuthenticated = !!identity;

  // Time-bounded initialization: if initialization takes too long, show stable UI
  useEffect(() => {
    if (isInitializing) {
      const timer = setTimeout(() => {
        setInitTimedOut(true);
      }, INIT_TIMEOUT);
      return () => clearTimeout(timer);
    } else {
      setInitTimedOut(false);
    }
  }, [isInitializing]);

  // Show profile setup modal only after auth and profile fetch is complete
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // If initialization is taking too long, render stable UI based on auth state
  if (isInitializing && !initTimedOut) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AuthGate />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppInitGate>
        <RouterProvider router={router} />
        <ProfileSetupModal open={showProfileSetup} />
        <Toaster />
      </AppInitGate>
    </ThemeProvider>
  );
}
