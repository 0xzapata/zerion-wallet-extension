import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { normalizeAddress } from 'src/shared/normalizeAddress';
import { walletPort } from 'src/ui/shared/channels';
import { queryClient } from '../requests/queryClient';

interface Result {
  params: { address: string };
  singleAddressNormalized: string;
  singleAddress: string;
  maybeSingleAddress: string | null;
  ready: boolean;
  isLoading: boolean;
  refetch: () => void;
}

const QUERY_KEY = ['wallet/getCurrentAddress'];

const queryFn = () =>
  walletPort.request('getCurrentAddress').then((result) => result || null);

export function readCachedCurrentAddress() {
  return queryClient.getQueryData<Awaited<ReturnType<typeof queryFn>>>(
    QUERY_KEY
  );
}

export function useAddressParams(): Result {
  const {
    data: addressResult,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn,
    useErrorBoundary: true,
  });
  const address = addressResult || '';
  const addressNormalized = normalizeAddress(address);
  return {
    params: useMemo(
      () => ({ address: addressNormalized }),
      [addressNormalized]
    ),
    singleAddressNormalized: addressNormalized,
    maybeSingleAddress: address || null,
    singleAddress: address,
    ready: Boolean(address),
    isLoading,
    refetch,
  };
}
