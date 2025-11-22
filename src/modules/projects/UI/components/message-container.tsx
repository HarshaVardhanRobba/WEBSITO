import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { useEffect, useRef } from "react";
import { Fragment } from "@/generated/prisma/client";
import { MessageLoading } from "./message-loading";


interface Props {
    projectId: string;
    activeFragment: Fragment | null;
        setActiveFragment: (fragment: Fragment | null) => void;
}

export const MessagesContainer = ({ projectId, activeFragment, setActiveFragment }: Props) => {
    
    const bottomRef = useRef<HTMLDivElement>(null);
    const lastAssistantMessageIdRef = useRef<string | null>(null);
    const trpc = useTRPC();
    // Log server/client call input for diagnostics (appears in server log during SSR and browser console on client)

    const {data: messages} = useSuspenseQuery(trpc.messages.getMany.queryOptions({  projectId: projectId 
    }, {
        refetchInterval: 5000,
    }));

    useEffect(() => {
        const lastAssistantMessage = messages.findLast((message) => message.role === "ASSISTANT");

        if (lastAssistantMessage?.fragment && lastAssistantMessageIdRef.current !== lastAssistantMessage.id) {
            setActiveFragment(lastAssistantMessage.fragment);
            lastAssistantMessageIdRef.current = lastAssistantMessage.id;
        }
    }, [messages, setActiveFragment] );

    useEffect(() => {
        bottomRef.current?.scrollIntoView();
    },[messages.length]);

    const LastMessage = messages[messages.length - 1];
    const isLastMessageUser = LastMessage?.role === "USER";

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div
            className="flex-1 min-h-0 overflow-y-auto pb-20"
            style={{ WebkitOverflowScrolling: "touch" }}
            >
            <div className="pt-2 pr-1">
                {messages.map((message) => (
        <MessageCard
            key={message.id}
            content={message.content}
            role={message.role}
            fragment={message.fragment}
            // convert to Date if the API returns a string
            createdAt={new Date(message.createdAt)}
            isActiveFragment={activeFragment?.id === message.fragment?.id}
            onFragmentClick={() => setActiveFragment(message.fragment)}
            type={message.type}
        />
        ))}
        {isLastMessageUser && <MessageLoading />}
        <div ref={bottomRef} />
      </div>
    </div>

    {/* decorative overlay as a sibling so it doesn't wrap the form */}
    <div className="absolute pointer-events-none left-0 right-0 -bottom-24 h-24 bg-linear-to-t from-background/90 to-transparent" />

    {/* footer area with interactive form */}
    <div className="relative p-3 pt-1 bg-transparent">
      <MessageForm projectId={projectId} />
    </div>
  </div>
);
    
}