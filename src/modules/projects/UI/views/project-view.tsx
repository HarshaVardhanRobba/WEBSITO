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


interface Props {
    projectId: string;
    activeFragment: Fragment | null;
    setActiveFragment: (fragment: Fragment | null) => void;
}

export const ProjectView = ({ projectId }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
    // Client-side diagnostic log to catch undefined props during hydration
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
                    {!!activeFragment && <FragmentWeb data={activeFragment} />}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}; 