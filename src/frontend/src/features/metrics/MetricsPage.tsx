import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function MetricsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Metrics & Monitoring</h2>
        <p className="text-muted-foreground">
          Track performance metrics and model drift indicators
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Backend metrics aggregation is not yet implemented. This feature will display run-level metrics
          (PnL, Sharpe/Sortino, max drawdown, trade statistics) and drift proxy indicators computed from
          stored data.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sharpe Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-muted-foreground">—</p>
            <p className="text-xs text-muted-foreground mt-1">30-day rolling</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-muted-foreground">—</p>
            <p className="text-xs text-muted-foreground mt-1">% profitable trades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Avg Trade PnL</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-muted-foreground">—</p>
            <p className="text-xs text-muted-foreground mt-1">Per trade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Drift Proxy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-muted-foreground">—</p>
            <p className="text-xs text-muted-foreground mt-1">Feature distribution delta</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Metrics will be computed from backtest run results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Once the backend simulation engine is implemented, this page will display:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Sharpe and Sortino ratios (rolling windows)</li>
            <li>Win rate and average trade PnL</li>
            <li>Maximum drawdown over various time periods</li>
            <li>Trade duration statistics</li>
            <li>Drift proxy indicators (feature distribution changes vs baseline)</li>
            <li>Sparklines and histograms for key metrics</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
