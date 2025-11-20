"use client";

import React, { Suspense, useState } from "react";
import { 
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup, 
} from "@/components/ui/resizable"
import { MessagesContainer } from "../components/message-container";
import { Fragment } from "@/generated/prisma/client";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/Fragment-web";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, Crown, EyeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileExplorer } from "@/components/file-explorer";
import { Hint } from "@/components/hint";


interface Props {
    projectId: string;
    activeFragment: Fragment | null;
    setActiveFragment: (fragment: Fragment | null) => void;
}

export const ProjectView = ({ projectId }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

    const [tabState, setTabState] = useState<"preview" | "code">("preview");
    
    React.useEffect(() => {
        console.log('[Client] ProjectView mounted, projectId =', projectId);
    }, [projectId]);

    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel 
                defaultSize={35}
                minSize={20}
                className="flex flex-col min-h-0"
                >
                    <Suspense fallback={<p>Loading project...</p>}/>
                    <ProjectHeader projectId={projectId} />
                    <Suspense fallback={<div>Loading messages...</div>}>
                        <MessagesContainer projectId={projectId}
                        activeFragment={activeFragment}
                        setActiveFragment={setActiveFragment}
                        />
                    </Suspense>
                    
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={65}
                minSize={50}>
                    <Tabs
                        value={tabState}
                        defaultValue="preview"
                        onValueChange={(value) => setTabState(value as "preview" | "code")}
                        className="h-full gap-y-0">
                            <div className="w-full flex items-center p-2 border-b gap-x-2">
                                <TabsList className="h-8 p-0 border rounded-md">
                                    <TabsTrigger value="preview" className="rounded-md cursor-pointer">
                                        <EyeIcon/>
                                        <span>Preview</span>
                                    </TabsTrigger>
                                        <Hint text="Wanna copy the code bro?" side="right" align="start">
                                        <TabsTrigger value="code" className="rounded-md cursor-pointer">
                                            <CodeIcon/>
                                            <span>Code</span>
                                    </TabsTrigger>
                                    </Hint>
                                </TabsList>
                                <div className="ml-auto flex items-center gap-x-2 cursor-pointer">
                                    <Button asChild size="sm" variant="default">
                                        <Link href="/pricing">
                                            <Crown/> Upgrade to Ultra 
                                        </Link>
                                    </Button>
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