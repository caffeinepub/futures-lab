import { useGetSystemHealth } from '../../lib/queries';
import { normalizeHealthStatus } from '../../lib/canisterValueNormalizers';
import { HealthStatus } from '../../backend';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export function HealthStatusBanner() {
  const { data: health, isError, refetch } = useGetSystemHealth();

  if (!health) {
    return null;
  }

  // Normalize the status to handle different runtime representations
  const normalizedStatus = normalizeHealthStatus(health.status);

  if (normalizedStatus === HealthStatus.healthy) {
    return null;
  }

  const getStatusConfig = () => {
    switch (normalizedStatus) {
      case HealthStatus.degraded:
        return {
          icon: AlertTriangle,
          variant: 'default' as const,
          title: 'Service Degraded',
          description: health.message || 'Some features may be slower than usual.',
        };
      case HealthStatus.maintenance:
        return {
          icon: AlertCircle,
          variant: 'default' as const,
          title: 'Maintenance Mode',
          description: health.message || 'The system is currently under maintenance.',
        };
      case HealthStatus.unreachable:
        return {
          icon: AlertCircle,
          variant: 'destructive' as const,
          title: 'Service Unreachable',
          description: health.message || 'Unable to connect to the backend service.',
        };
      case HealthStatus.appIssue:
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
