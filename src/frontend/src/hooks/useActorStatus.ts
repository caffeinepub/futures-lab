import { useActor } from './useActor';
import { useQueryClient } from '@tanstack/react-query';

export function useActorStatus() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const retry = () => {
    queryClient.invalidateQueries({ queryKey: ['actor'] });
  };

  if (isFetching) {
    return { status: 'loading' as const, error: null, retry };
  }

  if (!actor) {
    return {
      status: 'error' as const,
      error: 'Failed to initialize backend connection',
      retry,
    };
  }

  return { status: 'ready' as const, error: null, retry };
}
