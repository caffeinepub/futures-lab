import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, TrendingUp, BarChart3, Brain, Info } from 'lucide-react';
import { StartupDiagnosticsDialog } from '../system/StartupDiagnosticsDialog';

export function AuthGate() {
  const { login, loginStatus } = useInternetIdentity();
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'url(/assets/generated/futures-lab-hero-bg.dim_1600x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-5xl">
          {/* Logo and title */}
          <div className="mb-12 text-center">
            <div className="mb-6 flex justify-center">
              <img
                src="/assets/generated/futures-lab-logo.dim_512x512.png"
                alt="Futures Lab"
                className="h-24 w-24"
              />
            </div>
            <h1 className="mb-3 text-5xl font-bold tracking-tight">Futures Lab</h1>
            <p className="text-xl text-muted-foreground">
              Production-grade futures trading research platform
            </p>
          </div>

          {/* Features grid */}
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <TrendingUp className="mb-2 h-8 w-8 text-chart-1" />
                <CardTitle className="text-base">Backtesting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Realistic simulation with slippage, fees, and risk controls
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <Brain className="mb-2 h-8 w-8 text-chart-2" />
                <CardTitle className="text-base">RL Training</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Reinforcement learning with LSTM forecasting integration
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <BarChart3 className="mb-2 h-8 w-8 text-chart-3" />
                <CardTitle className="text-base">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Comprehensive metrics and performance tracking
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <Shield className="mb-2 h-8 w-8 text-chart-4" />
                <CardTitle className="text-base">Safety First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Paper, shadow, and live modes with risk controls
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Login button */}
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="px-12 py-6 text-lg"
            >
              {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
            </Button>
            
            <Button
              onClick={() => setShowDiagnostics(true)}
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
            >
              <Info className="mr-2 h-4 w-4" />
              Diagnostics
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-6 text-center text-sm text-muted-foreground">
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
