import { ReactNode, useState } from 'react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { HealthStatusBanner } from '../system/HealthStatusBanner';
import { TradingModeBanner } from '../trading/TradingModeBanner';
import { TradingModeSwitcher } from '../trading/TradingModeSwitcher';
import { StartupDiagnosticsDialog } from '../system/StartupDiagnosticsDialog';
import {
  Database,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Wallet,
  ListOrdered,
  History,
  Shield,
  Info,
} from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const currentPath = routerState.location.pathname;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const navItems = [
    { path: '/datasets', label: 'Datasets', icon: Database },
    { path: '/prompts', label: 'Prompts', icon: FileText },
    { path: '/metrics', label: 'Metrics', icon: BarChart3 },
  ];

  const tradingItems = [
    { path: '/trading/portfolio', label: 'Portfolio', icon: Wallet },
    { path: '/trading/orders', label: 'Orders', icon: ListOrdered },
    { path: '/trading/history', label: 'History', icon: History },
    { path: '/trading/safety', label: 'Safety', icon: Shield },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/futures-lab-logo.dim_512x512.png"
              alt="Futures Lab"
              className="h-10 w-10"
            />
            <h1 className="text-xl font-bold">Futures Lab</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Data & Config
            </h2>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Trading
            </h2>
            <div className="space-y-1">
              {tradingItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Button
            onClick={() => setShowDiagnostics(true)}
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            size="sm"
          >
            <Info className="mr-2 h-4 w-4" />
            Diagnostics
          </Button>
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <TradingModeBanner />
            </div>
            <TradingModeSwitcher />
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <HealthStatusBanner />
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card px-6 py-3 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} • Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'futures-lab'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      <StartupDiagnosticsDialog open={showDiagnostics} onOpenChange={setShowDiagnostics} />
    </div>
  );
}
