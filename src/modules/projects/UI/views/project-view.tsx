"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessagesContainer } from "../components/message-container";
import { Fragment } from "@/generated/prisma/client";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/Fragment-web";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, EyeIcon } from "lucide-react";
import { FileExplorer } from "@/components/file-explorer";
import { Hint } from "@/components/hint";
import { UserControl } from "@/components/user-control";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  return (
    <div className="h-screen home-surface">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<p>Loading project...</p>} />
          <ProjectHeader projectId={projectId} />
          <Suspense fallback={<div className="p-4 text-muted-warm text-sm">Loading messages...</div>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-tangerine transition-colors" />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            value={tabState}
            defaultValue="preview"
            onValueChange={(value) => setTabState(value as "preview" | "code")}
            className="h-full gap-y-0"
          >
            <div className="w-full flex items-center p-2 border-b border-[rgba(14,14,16,0.08)] gap-x-2 bg-white/80 backdrop-blur-md">
              <TabsList className="h-8 p-0 border border-[rgba(14,14,16,0.1)] rounded-full bg-white">
                <TabsTrigger value="preview" className="rounded-full cursor-pointer data-[state=active]:bg-ink data-[state=active]:text-white">
                  <EyeIcon className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </TabsTrigger>
                <Hint text="Copy the code" side="right" align="start">
                  <TabsTrigger value="code" className="rounded-full cursor-pointer data-[state=active]:bg-ink data-[state=active]:text-white">
                    <CodeIcon className="w-3.5 h-3.5" />
                    <span>Code</span>
                  </TabsTrigger>
                </Hint>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                <Link
                  href="/pricing"
                  className="btn-tangerine inline-flex items-center gap-2 px-3.5 py-1.5 text-[12px] font-medium"
                >
                  <Icon icon="solar:bolt-bold" width={14} height={14} />
                  Upgrade
                </Link>
                <UserControl showname={false} />
              </div>
            </div>
            <TabsContent value="preview" className="flex flex-col h-full gap-y-0">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
