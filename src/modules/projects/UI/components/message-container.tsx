import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { useEffect, useRef } from "react";


interface Props {
    projectId: string;
}

export const MessagesContainer = ({ projectId }: Props) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const trpc = useTRPC();
    const opts = trpc.messages.getMany.queryOptions({ projectId: projectId });
    // Log server/client call input for diagnostics (appears in server log during SSR and browser console on client)
    console.log('messages.getMany called with projectId =', projectId);
    const {data: messages} = useSuspenseQuery(opts);

    useEffect(() => {
        const lastAssistantMessage = messages.findLast((message) => message.role === "ASSISTANT",);

        if(lastAssistantMessage) bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    })

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="pt-2 pr-1">
                    {messages.map((message) => (
                        <MessageCard 
                            key={message.id}
                            content =  {message.content}
                            role={message.role}
                            fragment={message.fragment}
                            createdAt={message.createdAt}
                            isActiveFragment={false}
                            onFragmentClick={() => {}}
                            type={message.type}
                        />
                    ))}
                    <div ref={bottomRef} />
                </div>
            </div>
            <div className="relative p-3 pt-1">
                <div className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b form-transparent to-background/70 pointer-events-none">
                    <MessageForm projectId={projectId} />
                </div>

            </div>
        </div>
    )
    
}