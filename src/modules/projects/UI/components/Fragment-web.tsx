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
        <div className="flex flex-col gap-0 h-screen bg-white">
            <div className="p-2 border-b border-[rgba(14,14,16,0.08)] bg-white flex items-center gap-x-2">
                <Hint text="Refresh" side="left" align="start">
                <Button
                    variant="ghost" size="sm" className="text-sm rounded-full border border-[rgba(14,14,16,0.1)] hover:bg-[rgba(14,14,16,0.03)]"
                    onClick={onRefresh}>
                        <RefreshCcwIcon className="w-3.5 h-3.5 mr-1.5" />
                    Refresh
                </Button>
                </Hint>
                <Hint text="Copy link" side="right" align="start">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        disabled={!data.sandboxUrl|| copied}
                        className="flex-1 justify-start text-start font-normal rounded-full border border-[rgba(14,14,16,0.1)] hover:bg-[rgba(14,14,16,0.03)] text-ink-2"
                    >
                        <span className="text-tangerine mr-2 text-[11px] uppercase tracking-widest">
                            {copied ? "Copied" : "URL"}
                        </span>
                        <span className="truncate">
                            {data.sandboxUrl}
                        </span>
                    </Button>
                </Hint>
                <Hint text="Open in new tab" side="right" align="start">
                    <Button
                        size="sm"
                        disabled={!data.sandboxUrl}
                        variant="ghost"
                        className="rounded-full border border-[rgba(14,14,16,0.1)] hover:bg-[rgba(14,14,16,0.03)]"
                        onClick={() => {
                            if (!data.sandboxUrl) return;
                            window.open(data.sandboxUrl, "_blank");
                        }}
                    >
                        <ExternalLinkIcon className="w-3.5 h-3.5" />
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
