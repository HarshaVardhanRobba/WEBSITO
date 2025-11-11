'use client';

import React from 'react';
import { useTRPC } from "@/trpc/client"; // assumes this hook is exported from your trpc client module
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Client() {
  const trpc = useTRPC();
  // useSuspenseQuery expects the "queryOptions" object you already used
  const { data } = useSuspenseQuery(
    trpc.createAI.queryOptions({ text: 'Harsha - hello' })
  );

  return <div>{data?.greeting ?? 'No greeting yet'}</div>;
}
