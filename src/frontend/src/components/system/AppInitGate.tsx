import { ReactNode } from 'react';
import { useActorStatus } from '../../hooks/useActorStatus';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface AppInitGateProps {
  children: ReactNode;
}

export function AppInitGate({ children }: AppInitGateProps) {
  const { status, error, retry } = useActorStatus();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await clear();
    queryClient.clear();
  };

  const handleRetry = () => {
    retry();
  };

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    // Normalize error to ensure it's always renderable
    let errorMessage = 'Failed to connect to the application backend. Please try again.';
    
    if (error !== null && error !== undefined) {
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (typeof error === 'object') {
        const err = error as any;
        if (err.message) {
          errorMessage = String(err.message);
        }
      }
    }

    // Provide more actionable guidance based on error content
    const getErrorGuidance = (msg: string): string => {
      if (msg.includes('Unauthorized') || msg.includes('permission') || msg.includes('admin')) {
        return 'Authorization issue detected. If you are an admin, ensure you have the correct admin token in the URL. Standard users should be able to log in without any special parameters.';
      }
      if (msg.includes('timeout') || msg.includes('timed out')) {
        return 'The backend is taking too long to respond. Please check your connection and try again.';
      }
      if (msg.includes('network') || msg.includes('fetch')) {
        return 'Network connectivity issue. Please check your internet connection and try again.';
      }
      return 'Unable to initialize the application. Please try refreshing or signing out and back in.';
    };

    return (
      <div className="flex h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to Initialize</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p className="font-medium">{errorMessage}</p>
              <p className="text-sm opacity-90">{getErrorGuidance(errorMessage)}</p>
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-3">
            <Button onClick={handleRetry} variant="outline" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Button onClick={handleSignOut} variant="secondary" className="flex-1">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
