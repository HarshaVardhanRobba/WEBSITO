import { formatDuration, intervalToDuration } from "date-fns";
import { CrownIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";


interface UsageProps {
    points: number;
    msBeforeNext: number;
};

export const Usage = ({ points, msBeforeNext }: UsageProps) => {
    return (
        <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
            <div className="flex flex-row items-center justify-between gap-x-2">
                <span className="text-sm font-medium">{points} free credits remaining</span>
                <span className="text-xs text-muted-foreground">Resets in{" "}
                    {formatDuration(
                        intervalToDuration({
                            start: new Date(),
                            end: new Date(Date.now() + msBeforeNext),
                        }),
                        { format: [ "months" ,"days" , "hours", "minutes"] }
                    )} </span>
            </div>
            <Button
                asChild
                className="flex flex-row items-center justify-center gap-2"
                variant="tertiary"
                size="sm"
                disabled
            >
            <Link href="/pricing">
                <CrownIcon/> Upgrade
            </Link>
            </Button>
        </div>
    )
}