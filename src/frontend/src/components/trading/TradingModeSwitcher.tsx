import { useGetCallerUserProfile, useUpdateTradingMode } from '../../lib/queries';
import { TradingMode } from '../../backend';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState } from 'react';
import { LiveTradingConfirmDialog } from './LiveTradingConfirmDialog';

export function TradingModeSwitcher() {
  const { data: profile } = useGetCallerUserProfile();
  const updateMode = useUpdateTradingMode();
  const [showLiveConfirm, setShowLiveConfirm] = useState(false);
  const [pendingMode, setPendingMode] = useState<TradingMode | null>(null);

  const currentMode = profile?.tradingStatus?.mode || TradingMode.paperTrading;

  const handleModeChange = (value: string) => {
    const newMode = value as TradingMode;
    
    if (newMode === TradingMode.liveTrading) {
      setPendingMode(newMode);
      setShowLiveConfirm(true);
    } else {
      updateMode.mutate(newMode, {
        onSuccess: () => {
          toast.success(`Switched to ${getModeLabel(newMode)} mode`);
        },
        onError: (error) => {
          toast.error(`Failed to switch mode: ${error.message}`);
        },
      });
    }
  };

  const handleLiveConfirm = () => {
    if (pendingMode) {
      updateMode.mutate(pendingMode, {
        onSuccess: () => {
          toast.success('Live trading mode enabled');
          setShowLiveConfirm(false);
          setPendingMode(null);
        },
        onError: (error) => {
          toast.error(`Failed to enable live trading: ${error.message}`);
        },
      });
    }
  };

  const handleLiveCancel = () => {
    setShowLiveConfirm(false);
    setPendingMode(null);
  };

  const getModeLabel = (mode: TradingMode) => {
    switch (mode) {
      case TradingMode.paperTrading:
        return 'Paper Trading';
      case TradingMode.shadowTrading:
        return 'Shadow Trading';
      case TradingMode.liveTrading:
        return 'Live Trading';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Label htmlFor="trading-mode" className="text-sm font-medium">
          Trading Mode
        </Label>
        <Select value={currentMode} onValueChange={handleModeChange} disabled={updateMode.isPending}>
          <SelectTrigger id="trading-mode" className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TradingMode.paperTrading}>Paper Trading</SelectItem>
            <SelectItem value={TradingMode.shadowTrading}>Shadow Trading</SelectItem>
            <SelectItem value={TradingMode.liveTrading}>Live Trading</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <LiveTradingConfirmDialog
        open={showLiveConfirm}
        onConfirm={handleLiveConfirm}
        onCancel={handleLiveCancel}
        isPending={updateMode.isPending}
      />
    </>
  );
}
