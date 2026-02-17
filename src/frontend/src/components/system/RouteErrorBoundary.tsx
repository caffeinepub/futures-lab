import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

export function RouteErrorBoundary() {
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate({ to: '/datasets' });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            An unexpected error occurred while rendering this page. Please try reloading or return to the home page.
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-3">
          <Button onClick={handleReload} variant="outline" className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload
          </Button>
          <Button onClick={handleGoHome} variant="default" className="flex-1">
            <Home className="mr-2 h-4 w-4" />
            Go to Datasets
          </Button>
        </div>
      </div>
    </div>
  );
}
