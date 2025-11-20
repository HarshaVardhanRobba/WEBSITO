import { Fragment } from "@/generated/prisma/client";
import { useState } from "react";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";

interface fragmentWebProps {
    data: Fragment;
}

export function FragmentWeb({ data }: fragmentWebProps) {

    const [fragmentKey, setFragmentKey] = useState(0);

    const [copied, setcopied] = useState(false);

    const onRefresh = () => {
        setFragmentKey((prev) => prev + 1);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(data.sandboxUrl);
        setcopied(true);
        setTimeout(() => {
            setcopied(false);
        }, 2000);
    }


    return (
        <div className="flex flex-col gap-3 h-screen">
            <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
                <Hint text="Refresh" side="left" align="start">
                <Button 
                    variant="secondary" size="sm" className="text-sm cursor-pointer"
                    onClick={onRefresh}>
                        <RefreshCcwIcon className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
                </Hint>
                <Hint text="Copy link" side="right" align="start">
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={handleCopy}
                        disabled={!data.sandboxUrl|| copied}
                        className="flex-1 justify-start text-start font-normal"
                    >
                        {copied ? "Copied!" : "Copy link"}
                        <span className="truncate">
                            {data.sandboxUrl}
                        </span>
                    </Button>
                </Hint>
                <Hint text="Open in new tab" side="right" align="start">
                    <Button 
                        size="sm"
                        disabled={!data.sandboxUrl}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => {
                            if (!data.sandboxUrl) return; 
                            window.open(data.sandboxUrl, "_blank");
                        }}
                    >
                        <ExternalLinkIcon className="w-4 h-4" />
                    </Button>
                </Hint>
            </div>
            <iframe
                key={fragmentKey}
                className="flex-1 w-full"
                sandbox="allow-forms allow-scripts allow-same-origin" 
                loading="lazy"
                src={data.sandboxUrl}
            /> 
        </div>
    )
}
