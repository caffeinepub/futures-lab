import { useGetSystemHealth } from '../../lib/queries';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';

export function HealthStatusBanner() {
  const { data: health, isError, refetch } = useGetSystemHealth();

  if (!health || health.status === 'healthy') {
    return null;
  }

  const getStatusConfig = () => {
    switch (health.status) {
      case 'degraded':
        return {
          icon: AlertTriangle,
          variant: 'default' as const,
          title: 'Service Degraded',
          description: health.message || 'Some features may be slower than usual.',
        };
      case 'maintenance':
        return {
          icon: AlertCircle,
          variant: 'default' as const,
          title: 'Maintenance Mode',
          description: health.message || 'The system is currently under maintenance.',
        };
      case 'unreachable':
        return {
          icon: AlertCircle,
          variant: 'destructive' as const,
          title: 'Service Unreachable',
          description: health.message || 'Unable to connect to the backend service.',
        };
      case 'appIssue':
        return {
          icon: AlertCircle,
          variant: 'destructive' as const,
          title: 'Application Issue',
          description: health.message || 'An application error has occurred.',
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Alert variant={config.variant} className="mb-4">
      <Icon className="h-4 w-4" />
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{config.description}</span>
        <Button onClick={() => refetch()} variant="ghost" size="sm" className="ml-4">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
