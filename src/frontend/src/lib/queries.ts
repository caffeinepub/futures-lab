import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import type { UserProfile, Dataset, PromptTemplate, Candle, TradingMode, AppHealth, Trade } from '../backend';
import { toast } from 'sonner';
import { withTimeout, normalizeError, QUERY_TIMEOUT } from './queryUtils';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return withTimeout(actor.getCallerUserProfile());
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    staleTime: 30000,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await withTimeout(actor.saveCallerUserProfile(profile));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error) => {
      toast.error(`Failed to save profile: ${normalizeError(error)}`);
    },
  });
}

// Health Queries
export function useGetSystemHealth() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AppHealth>({
    queryKey: ['systemHealth'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return withTimeout(actor.getSystemHealth(), 10000);
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 60000, // Refetch every minute
    retry: 1,
  });
}

// Dataset Queries
export function useGetAllDatasets() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Dataset[]>({
    queryKey: ['datasets'],
    queryFn: async () => {
      if (!actor) return [];
      const ids = await withTimeout(actor.getAllDatasetIds());
      const datasets = await Promise.all(
        ids.map(async (id) => {
          const dataset = await withTimeout(actor.getDataset(id));
          return dataset;
        })
      );
      return datasets.filter((d): d is Dataset => d !== null);
    },
    enabled: !!actor && !actorFetching,
    staleTime: 60000,
  });
}

export function useGetDataset(datasetId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Dataset | null>({
    queryKey: ['dataset', datasetId],
    queryFn: async () => {
      if (!actor || !datasetId) return null;
      return withTimeout(actor.getDataset(datasetId));
    },
    enabled: !!actor && !actorFetching && !!datasetId,
  });
}

export function useUploadDataset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      datasetId,
      candles,
      name,
      description,
    }: {
      datasetId: string;
      candles: Candle[];
      name: string;
      description?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await withTimeout(actor.uploadDataset(datasetId, candles, name, description || null));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      toast.success('Dataset uploaded successfully');
    },
    onError: (error) => {
      toast.error(`Failed to upload dataset: ${normalizeError(error)}`);
    },
  });
}

// Prompt Template Queries
export function useGetAllPromptTemplates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PromptTemplate[]>({
    queryKey: ['promptTemplates'],
    queryFn: async () => {
      if (!actor) return [];
      return withTimeout(actor.getAllPromptTemplates());
    },
    enabled: !!actor && !actorFetching,
    staleTime: 60000,
  });
}

export function useGetPromptTemplate(id: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PromptTemplate | null>({
    queryKey: ['promptTemplate', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return withTimeout(actor.getPromptTemplate(id));
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useSavePromptTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: PromptTemplate) => {
      if (!actor) throw new Error('Actor not available');
      await withTimeout(actor.savePromptTemplate(template));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      toast.success('Template saved successfully');
    },
    onError: (error) => {
      toast.error(`Failed to save template: ${normalizeError(error)}`);
    },
  });
}

// Binance Connection Queries
export function useAddBinanceAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      apiKey,
      secretKey,
      mode,
    }: {
      apiKey: string;
      secretKey: string;
      mode: TradingMode;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await withTimeout(actor.addBinanceAccount(apiKey, secretKey, mode));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error) => {
      toast.error(`Failed to connect Binance account: ${normalizeError(error)}`);
    },
  });
}

export function useDisconnectBinance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await withTimeout(actor.disconnectBinance());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error) => {
      toast.error(`Failed to disconnect: ${normalizeError(error)}`);
    },
  });
}

export function useVerifyBinanceConnection() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return withTimeout(actor.verifyBinanceConnection());
    },
    onError: (error) => {
      toast.error(`Verification failed: ${normalizeError(error)}`);
    },
  });
}

// Trading Mode Queries
export function useUpdateTradingMode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mode: TradingMode) => {
      if (!actor) throw new Error('Actor not available');
      await withTimeout(actor.updateTradingMode(mode));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error) => {
      toast.error(`Failed to update trading mode: ${normalizeError(error)}`);
    },
  });
}

// Trade History Queries
export function useGetAllTrades(tradeId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Trade[]>({
    queryKey: ['trades', tradeId],
    queryFn: async () => {
      if (!actor) return [];
      return withTimeout(actor.getAllTrades(tradeId));
    },
    enabled: !!actor && !actorFetching && !!tradeId,
    staleTime: 30000,
  });
}
