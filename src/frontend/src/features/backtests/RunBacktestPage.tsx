import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function RunBacktestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Run Backtest</h2>
        <p className="text-muted-foreground">
          Select a dataset and configuration to start a backtest run
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Backend backtest execution engine is not yet implemented. This feature will allow you to start a backtest
          run by selecting a dataset and configuration, then track the run status and view results.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Backtest Execution</CardTitle>
          <CardDescription>
            The backtest simulator will replay your dataset and generate equity curves, trade logs, and safety events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Once implemented, you'll be able to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Select a dataset from your uploaded datasets</li>
            <li>Choose a backtest configuration (or use defaults)</li>
            <li>Start the backtest run and track progress</li>
            <li>View real-time equity updates during simulation</li>
            <li>Review completed runs in the Results section</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
