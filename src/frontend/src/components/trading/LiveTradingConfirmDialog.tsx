import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface LiveTradingConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export function LiveTradingConfirmDialog({
  open,
  onConfirm,
  onCancel,
  isPending,
}: LiveTradingConfirmDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const CONFIRM_PHRASE = 'ENABLE LIVE TRADING';

  const handleConfirm = () => {
    if (confirmText === CONFIRM_PHRASE) {
      onConfirm();
      setConfirmText('');
    }
  };

  const handleCancel = () => {
    setConfirmText('');
    onCancel();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl">Enable Live Trading?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 text-base">
            <p className="font-semibold text-foreground">
              ⚠️ WARNING: You are about to enable live trading with real funds.
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Real orders will be placed on Binance</li>
              <li>Real money will be at risk</li>
              <li>Losses can occur and are your responsibility</li>
              <li>Ensure your safety controls are properly configured</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Type <span className="font-mono font-bold text-foreground">{CONFIRM_PHRASE}</span> to confirm:
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <Label htmlFor="confirm-input" className="sr-only">
            Confirmation
          </Label>
          <Input
            id="confirm-input"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_PHRASE}
            className="font-mono"
            disabled={isPending}
          />
        </div>
        <AlertDialogFooter>
          <Button onClick={handleCancel} variant="outline" disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="destructive"
            disabled={confirmText !== CONFIRM_PHRASE || isPending}
          >
            {isPending ? 'Enabling...' : 'Enable Live Trading'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
