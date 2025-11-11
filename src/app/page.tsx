// server component
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient, trpc } from '../trpc/server';
import { Suspense } from 'react';
// Update this import to match the actual export from '../trpc/client'
import Client from './client';

export default async function Home() {
  const queryClient = getQueryClient();

  // await the prefetch so the cache is populated before we dehydrate
  await queryClient.prefetchQuery(trpc.createAI.queryOptions({ text: 'Harsha - hello' }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <Client />
      </Suspense>
    </HydrationBoundary>
  );
}
