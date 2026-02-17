import { useGetCallerUserProfile } from '../../lib/queries';
import { TradingMode } from '../../backend';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TestTube, Eye } from 'lucide-react';

export function TradingModeBanner() {
  const { data: profile } = useGetCallerUserProfile();
  const mode = profile?.tradingStatus?.mode || TradingMode.paperTrading;

  const getModeConfig = () => {
    switch (mode) {
      case TradingMode.paperTrading:
        return {
          icon: TestTube,
          label: 'Paper Trading',
          description: 'Simulated trading with virtual funds',
          className: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
        };
      case TradingMode.shadowTrading:
        return {
          icon: Eye,
          label: 'Shadow Trading',
          description: 'Live market data with simulated execution',
          className: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
        };
      case TradingMode.liveTrading:
        return {
          icon: AlertTriangle,
          label: 'Live Trading',
          description: 'Real orders with real funds - Exercise caution',
          className: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
        };
      default:
        return null;
    }
  };

  const config = getModeConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Alert className={config.className}>
      <Icon className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-semibold">{config.label}</span>
          <span className="ml-2 text-sm opacity-80">• {config.description}</span>
        </div>
      </AlertDescription>
    </Alert>
  );
}
