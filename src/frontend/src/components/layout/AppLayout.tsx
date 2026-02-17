import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../lib/queries';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Database, Settings, Play, BarChart3, FileText, MessageSquare, LogOut, TrendingUp, ShoppingCart, History, Shield } from 'lucide-react';
import { TradingModeSwitcher } from '../trading/TradingModeSwitcher';
import { TradingModeBanner } from '../trading/TradingModeBanner';
import { HealthStatusBanner } from '../system/HealthStatusBanner';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const routerState = useRouterState();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const currentPath = routerState.location.pathname;

  const navItems = [
    { icon: Database, label: 'Datasets', path: '/datasets' },
    { icon: Settings, label: 'Config', path: '/config' },
    { icon: Play, label: 'Run Backtest', path: '/run' },
    { icon: BarChart3, label: 'Results', path: '/results' },
    { icon: FileText, label: 'Episodes', path: '/episodes' },
    { icon: MessageSquare, label: 'Prompts', path: '/prompts' },
    { icon: BarChart3, label: 'Metrics', path: '/metrics' },
  ];

  const tradingItems = [
    { icon: TrendingUp, label: 'Portfolio', path: '/trading/portfolio' },
    { icon: ShoppingCart, label: 'Orders', path: '/trading/orders' },
    { icon: History, label: 'Trade History', path: '/trading/history' },
    { icon: Shield, label: 'Safety Controls', path: '/trading/safety' },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/futures-lab-logo.dim_512x512.png" 
              alt="Futures Lab" 
              className="h-8 w-8"
            />
            <div>
              <h2 className="text-sm font-semibold">Futures Lab</h2>
              <p className="text-xs text-muted-foreground">Research Platform</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Research</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      onClick={() => navigate({ to: item.path })}
                      isActive={currentPath === item.path}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Trading</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tradingItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      onClick={() => navigate({ to: item.path })}
                      isActive={currentPath === item.path}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-4">
          <div className="mb-3 text-xs text-muted-foreground">
            <p className="font-medium">{userProfile?.name || 'User'}</p>
            {userProfile?.email && <p className="mt-1">{userProfile.email}</p>}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center justify-between flex-1">
            <h1 className="text-sm font-semibold">
              {[...navItems, ...tradingItems].find((item) => item.path === currentPath)?.label || 'Futures Lab'}
            </h1>
            {currentPath.startsWith('/trading') && <TradingModeSwitcher />}
          </div>
        </header>
        <main className="flex-1 p-6">
          <HealthStatusBanner />
          {currentPath.startsWith('/trading') && (
            <div className="mb-4">
              <TradingModeBanner />
            </div>
          )}
          {children}
        </main>
        <footer className="border-t bg-background px-6 py-4">
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} • Built with ❤️ using </span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 font-medium hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
