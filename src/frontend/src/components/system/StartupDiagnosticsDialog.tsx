import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useActorStatus } from '../../hooks/useActorStatus';
import { useGetSystemHealth, useGetCallerUserProfile } from '../../lib/queries';
import { normalizeError } from '../../lib/queryUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StartupDiagnosticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StartupDiagnosticsDialog({ open, onOpenChange }: StartupDiagnosticsDialogProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { status: actorStatus, error: actorError } = useActorStatus();
  const { data: health, error: healthError, isLoading: healthLoading } = useGetSystemHealth();
  const { data: profile, error: profileError, isLoading: profileLoading } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  const DiagnosticItem = ({
    label,
    status,
    details,
  }: {
    label: string;
    status: 'success' | 'error' | 'loading' | 'warning';
    details?: string;
  }) => {
    const getIcon = () => {
      switch (status) {
        case 'success':
          return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
        case 'error':
          return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
        case 'loading':
          return <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />;
        case 'warning':
          return <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      }
    };

    return (
      <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{label}</p>
          {details && (
            <p className="text-xs text-muted-foreground mt-1 break-words">{details}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Startup Diagnostics</DialogTitle>
          <DialogDescription>
            System initialization status and health checks
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-1">
            {/* Internet Identity Status */}
            <DiagnosticItem
              label="Internet Identity"
              status={
                isInitializing
                  ? 'loading'
                  : isAuthenticated
                    ? 'success'
                    : 'warning'
              }
              details={
                isInitializing
                  ? 'Initializing authentication...'
                  : isAuthenticated
                    ? `Signed in as ${identity.getPrincipal().toString().slice(0, 20)}...`
                    : 'Not signed in'
              }
            />

            {/* Actor Status */}
            <DiagnosticItem
              label="Backend Connection"
              status={
                actorStatus === 'loading'
                  ? 'loading'
                  : actorStatus === 'ready'
                    ? 'success'
                    : 'error'
              }
              details={
                actorStatus === 'loading'
                  ? 'Connecting to backend...'
                  : actorStatus === 'ready'
                    ? 'Backend actor initialized successfully'
                    : actorError || 'Failed to initialize backend actor'
              }
            />

            {/* System Health */}
            {isAuthenticated && (
              <DiagnosticItem
                label="System Health Check"
                status={
                  healthLoading
                    ? 'loading'
                    : healthError
                      ? 'error'
                      : health?.status === 'healthy'
                        ? 'success'
                        : 'warning'
                }
                details={
                  healthLoading
                    ? 'Checking system health...'
                    : healthError
                      ? `Health check failed: ${normalizeError(healthError)}`
                      : health
                        ? `Status: ${health.status}${health.message ? ` - ${health.message}` : ''}`
                        : 'No health data available'
                }
              />
            )}

            {/* User Profile */}
            {isAuthenticated && (
              <DiagnosticItem
                label="User Profile"
                status={
                  profileLoading
                    ? 'loading'
                    : profileError
                      ? 'error'
                      : profile
                        ? 'success'
                        : 'warning'
                }
                details={
                  profileLoading
                    ? 'Loading user profile...'
                    : profileError
                      ? `Profile fetch failed: ${normalizeError(profileError)}`
                      : profile
                        ? `Profile loaded: ${profile.name}`
                        : 'No profile found (setup required)'
                }
              />
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
