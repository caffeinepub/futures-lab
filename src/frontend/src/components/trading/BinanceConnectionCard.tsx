import { useState } from 'react';
import { useGetCallerUserProfile, useAddBinanceAccount, useDisconnectBinance, useVerifyBinanceConnection } from '../../lib/queries';
import { TradingMode } from '../../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Shield, Key } from 'lucide-react';
import { toast } from 'sonner';

export function BinanceConnectionCard() {
  const { data: profile } = useGetCallerUserProfile();
  const addAccount = useAddBinanceAccount();
  const disconnect = useDisconnectBinance();
  const verify = useVerifyBinanceConnection();
  
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showForm, setShowForm] = useState(false);

  const isConnected = profile?.tradingStatus?.binanceConnected || false;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim() || !secretKey.trim()) {
      toast.error('Please enter both API key and secret key');
      return;
    }

    addAccount.mutate(
      { apiKey: apiKey.trim(), secretKey: secretKey.trim(), mode: TradingMode.paperTrading },
      {
        onSuccess: () => {
          toast.success('Binance account connected successfully');
          setApiKey('');
          setSecretKey('');
          setShowForm(false);
        },
        onError: (error) => {
          toast.error(`Failed to connect: ${error.message}`);
        },
      }
    );
  };

  const handleDisconnect = () => {
    disconnect.mutate(undefined, {
      onSuccess: () => {
        toast.success('Binance account disconnected');
      },
      onError: (error) => {
        toast.error(`Failed to disconnect: ${error.message}`);
      },
    });
  };

  const handleTestConnection = () => {
    verify.mutate(undefined, {
      onSuccess: (isValid) => {
        if (isValid) {
          toast.success('Connection verified successfully');
        } else {
          toast.error('Connection verification failed');
        }
      },
      onError: (error) => {
        toast.error(`Verification failed: ${error.message}`);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Binance Connection
            </CardTitle>
            <CardDescription className="mt-1.5">
              Connect your Binance account to enable trading
            </CardDescription>
          </div>
          {isConnected ? (
            <Badge variant="default" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
              <CheckCircle className="mr-1 h-3 w-3" />
              Connected
            </Badge>
          ) : (
            <Badge variant="secondary">
              <XCircle className="mr-1 h-3 w-3" />
              Not Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Your API credentials are encrypted and stored securely. Only you can access them through your authenticated session.
            They are protected by Internet Identity access control.
          </AlertDescription>
        </Alert>

        {!isConnected && !showForm && (
          <Button onClick={() => setShowForm(true)} className="w-full">
            Connect Binance Account
          </Button>
        )}

        {!isConnected && showForm && (
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Binance API key"
                disabled={addAccount.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secret-key">Secret Key</Label>
              <Input
                id="secret-key"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter your Binance secret key"
                disabled={addAccount.isPending}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={addAccount.isPending} className="flex-1">
                {addAccount.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setApiKey('');
                  setSecretKey('');
                }}
                disabled={addAccount.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {isConnected && (
          <div className="flex gap-2">
            <Button
              onClick={handleTestConnection}
              variant="outline"
              disabled={verify.isPending}
              className="flex-1"
            >
              {verify.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
            <Button
              onClick={handleDisconnect}
              variant="destructive"
              disabled={disconnect.isPending}
              className="flex-1"
            >
              {disconnect.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                'Disconnect'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
