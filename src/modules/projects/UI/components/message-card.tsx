import { Card } from "@/components/ui/card";
import { Fragment } from "@/generated/prisma/client";
import { MessageRole, MessageType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
 interface UserMessageProps {
    content: string;
}


const UserMessage = ({ content }: UserMessageProps) => {
    return (
        <div className="flex justify-end pb-4 pr-2 pl-10">
            <Card className="rounded-lg bg-muted p-3 shadow-none *:border-none max-w-[80%] break-words">
                {content}
            </Card>
        </div>
    );
};

interface FragmentCardProps {
    fragment: Fragment;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
};

const FragmentCard = ({ fragment, isActiveFragment, onFragmentClick }: FragmentCardProps) => {
    return (
        <button className={cn("flex gap-2 items-center cursor-pointer rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors", isActiveFragment && "bg-primary text-primary-foreground border-primary hover:bg-primary"
        )} 
        onClick={() => onFragmentClick(fragment)}
        >
            <Code2Icon className="size-4 mt-0.5" />
            <div>
                <span className="text-sm font-medium line-clamp-1">{fragment.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">Preview</span>
            </div>
            <div className="flex items-center justify-center mt-0.5">
                <ChevronRightIcon className="w-4 h-4" />
            </div>
        </button>
    )
}

interface AssistantMessageProps {
    content: string;
    fragment: Fragment | null;
    createdAt: Date;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
}

const AssistantMessage = ({ content, fragment, createdAt, isActiveFragment, onFragmentClick, type }: AssistantMessageProps) => {
    return (
        <div className={cn("flex pb-4 pl-10",
        type === "ERROR" && "text-red-700 dark:text-red-500")}>
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image 
                src="/logo.svg"
                alt="Vibe"
                width={18}
                height={18}
                className="shrink-0"/>
                <span className="text-sm font-medium bg-linear-to-r from-red-900 to-red-800 bg-clip-text text-transparent">
                    Coco Ai
                </span>
                <span className="text-xs text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 font-medium">
                    {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
                </span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4">
                <span>
                    {content}
                </span>
                {fragment && type === "RESULT" && (
                    <FragmentCard
                        fragment={fragment}
                        isActiveFragment={isActiveFragment}
                        onFragmentClick={onFragmentClick}
                    />
                )}
            </div>
        </div>

    )
}

interface Messagecardprops {
    content: string;
    role: MessageRole;
    fragment: Fragment | null;
    createdAt: Date;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
}

export const MessageCard  = ({
    content,
    role,
    fragment,
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type,
}: Messagecardprops) => {
    if (role === "ASSISTANT") {
        return (
            <AssistantMessage 
            content={content}
            fragment={fragment}
            createdAt={createdAt}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
            type={type} />
        )
    }

    return (
        <UserMessage 
        content={content}
        />
    );
};