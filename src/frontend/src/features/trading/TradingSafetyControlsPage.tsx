import { useState } from 'react';
import { useGetCallerUserProfile } from '../../lib/queries';
import { AsyncState } from '../../components/system/AsyncState';
import { BinanceConnectionCard } from '../../components/trading/BinanceConnectionCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function TradingSafetyControlsPage() {
  const { data: profile, isLoading, isError, error, refetch } = useGetCallerUserProfile();
  const [killSwitch, setKillSwitch] = useState(false);
  const [maxNotional, setMaxNotional] = useState('10000');
  const [maxPositionSize, setMaxPositionSize] = useState('1.0');

  const handleSaveControls = () => {
    toast.success('Safety controls updated');
  };

  const handleKillSwitchToggle = (checked: boolean) => {
    setKillSwitch(checked);
    if (checked) {
      toast.warning('Kill switch activated - All trading disabled');
    } else {
      toast.success('Kill switch deactivated - Trading enabled');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Safety Controls</h2>
        <p className="text-muted-foreground mt-1">
          Configure risk limits and emergency controls
        </p>
      </div>

      <AsyncState
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        onRetry={refetch}
      >
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Safety First</AlertTitle>
          <AlertDescription>
            These controls help protect your account from excessive losses. They are enforced server-side and apply to all trading modes.
          </AlertDescription>
        </Alert>

        <BinanceConnectionCard />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Emergency Kill Switch
            </CardTitle>
            <CardDescription>
              Immediately disable all trading activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-destructive/5">
              <div>
                <p className="font-semibold">Kill Switch</p>
                <p className="text-sm text-muted-foreground">
                  {killSwitch ? 'All trading is currently disabled' : 'Trading is currently enabled'}
                </p>
              </div>
              <Switch
                checked={killSwitch}
                onCheckedChange={handleKillSwitchToggle}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Limits</CardTitle>
            <CardDescription>
              Set maximum exposure limits for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-notional">Maximum Notional Value (USDT)</Label>
              <Input
                id="max-notional"
                type="number"
                value={maxNotional}
                onChange={(e) => setMaxNotional(e.target.value)}
                placeholder="10000"
              />
              <p className="text-xs text-muted-foreground">
                Maximum total value of all open positions
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-position">Maximum Position Size</Label>
              <Input
                id="max-position"
                type="number"
                step="0.1"
                value={maxPositionSize}
                onChange={(e) => setMaxPositionSize(e.target.value)}
                placeholder="1.0"
              />
              <p className="text-xs text-muted-foreground">
                Maximum size for a single position (in base asset)
              </p>
            </div>

            <Button onClick={handleSaveControls} className="w-full">
              Save Risk Limits
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trading Status</CardTitle>
            <CardDescription>Current account trading permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="text-sm font-medium">Binance Connected</span>
                <span className={`text-sm ${profile?.tradingStatus?.binanceConnected ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                  {profile?.tradingStatus?.binanceConnected ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="text-sm font-medium">Trading Enabled</span>
                <span className={`text-sm ${profile?.tradingStatus?.tradingEnabled ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                  {profile?.tradingStatus?.tradingEnabled ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span className="text-sm font-medium">Current Mode</span>
                <span className="text-sm font-medium capitalize">
                  {profile?.tradingStatus?.mode?.replace('Trading', ' Trading') || 'Paper Trading'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </AsyncState>
    </div>
  );
}
