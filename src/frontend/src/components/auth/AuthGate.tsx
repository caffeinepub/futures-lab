import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, TrendingUp, BarChart3, Brain } from 'lucide-react';

export function AuthGate() {
  const { login, loginStatus } = useInternetIdentity();

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
                <Shield className="mb-2 h-8 w-8 text-chart-3" />
                <CardTitle className="text-base">Risk Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Hard limits, kill-switch, and safety event logging
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <BarChart3 className="mb-2 h-8 w-8 text-chart-4" />
                <CardTitle className="text-base">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Episode review, metrics tracking, and LLM-assisted analysis
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Login card */}
          <Card className="mx-auto max-w-md border-border bg-card">
            <CardHeader className="text-center">
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Sign in with Internet Identity to access the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-6">
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="lg"
                className="min-w-[200px]"
              >
                {isLoggingIn ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Connecting...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                caffeine.ai
              </a>
            </p>
            <p className="mt-2 text-xs">
              © {new Date().getFullYear()} Futures Lab. For research purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
