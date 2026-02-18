import { useActor } from './useActor';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './useInternetIdentity';

export function useActorStatus() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const retry = () => {
    // Invalidate all actor-related queries including identity-scoped ones
    queryClient.invalidateQueries({ queryKey: ['actor'] });
    if (identity) {
      queryClient.invalidateQueries({ queryKey: ['actor', identity.getPrincipal().toString()] });
    }
    // Also invalidate dependent queries to force refetch
    queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    queryClient.invalidateQueries({ queryKey: ['systemHealth'] });
  };

  // Try to extract error from query cache
  const getActorError = (): string | null => {
    const actorQuery = queryClient.getQueryState(['actor']);
    if (actorQuery?.error) {
      if (actorQuery.error instanceof Error) {
        return actorQuery.error.message;
      }
      if (typeof actorQuery.error === 'string') {
        return actorQuery.error;
      }
      // Handle object-shaped errors from agent/canister
      if (typeof actorQuery.error === 'object' && actorQuery.error !== null) {
        const err = actorQuery.error as any;
        return err.message || err.error_description || err.error || 'Actor initialization failed';
      }
    }
    return null;
  };

  if (isFetching) {
    return { status: 'loading' as const, error: null, retry };
  }

  if (!actor) {
    const errorMessage = getActorError() || 'Failed to initialize backend connection';
    return {
      status: 'error' as const,
      error: errorMessage,
      retry,
    };
  }

  return { status: 'ready' as const, error: null, retry };
}
