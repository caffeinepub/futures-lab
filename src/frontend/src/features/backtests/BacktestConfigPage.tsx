import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function BacktestConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Backtest Configuration</h2>
        <p className="text-muted-foreground">
          Configure risk limits, reward coefficients, and simulator parameters
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Backend configuration storage is not yet implemented. This feature will allow you to save and manage
          backtest configurations including risk limits (max leverage, daily loss limit, max trade risk),
          reward function coefficients (lambda_d, lambda_v, lambda_c), and simulator parameters (fees, slippage model).
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Configuration</CardTitle>
            <CardDescription>Hard limits and safety parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Max Leverage:</span>
              <span className="font-medium text-foreground">20x</span>
            </div>
            <div className="flex justify-between">
              <span>Daily Loss Limit:</span>
              <span className="font-medium text-foreground">10%</span>
            </div>
            <div className="flex justify-between">
              <span>Max Trade Risk:</span>
              <span className="font-medium text-foreground">2%</span>
            </div>
            <div className="flex justify-between">
              <span>Min Notional:</span>
              <span className="font-medium text-foreground">$10</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reward Configuration</CardTitle>
            <CardDescription>Reward function coefficients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Drawdown Penalty (λ_d):</span>
              <span className="font-medium text-foreground">10.0</span>
            </div>
            <div className="flex justify-between">
              <span>Drawdown Threshold:</span>
              <span className="font-medium text-foreground">5%</span>
            </div>
            <div className="flex justify-between">
              <span>Volatility Penalty (λ_v):</span>
              <span className="font-medium text-foreground">0.5</span>
            </div>
            <div className="flex justify-between">
              <span>Cost Factor (λ_c):</span>
              <span className="font-medium text-foreground">1.0</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulator Parameters</CardTitle>
            <CardDescription>Execution simulation settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Taker Fee:</span>
              <span className="font-medium text-foreground">0.05%</span>
            </div>
            <div className="flex justify-between">
              <span>Slippage Model:</span>
              <span className="font-medium text-foreground">Power (0.7)</span>
            </div>
            <div className="flex justify-between">
              <span>Latency:</span>
              <span className="font-medium text-foreground">50ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Safety Controls</CardTitle>
            <CardDescription>Additional safety parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Rate Limit:</span>
              <span className="font-medium text-foreground">10 orders/min</span>
            </div>
            <div className="flex justify-between">
              <span>Kill Switch:</span>
              <span className="font-medium text-chart-2">Enabled</span>
            </div>
            <div className="flex justify-between">
              <span>Liquidation Penalty:</span>
              <span className="font-medium text-foreground">50x equity</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
