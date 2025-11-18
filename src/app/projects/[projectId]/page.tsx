import { ProjectView } from "@/modules/projects/UI/views/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import React, { Suspense } from "react";

interface RouteParams {
  projectId: string;
}

// params can be a resolved object or a Promise that resolves to that object
interface Props {
  params: RouteParams | Promise<RouteParams>;
}

const Page = async ({ params }: Props) => {
  // IMPORTANT: await params because Next can pass params as a Promise
  const { projectId } = await params;

  // Defensive: if projectId is missing, show a 404 instead of calling trpc with undefined
  if (!projectId) {
    console.warn("projects/[projectId] page rendered without projectId param");
    notFound();
  }

  console.log("projects/[projectId] server render, projectId=", projectId);

  const queryclient = getQueryClient();

  // Prefetch server-side (will validate inputs) using the ensured projectId
  void queryclient.prefetchQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  void queryclient.prefetchQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryclient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectView projectId={projectId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
