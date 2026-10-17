import { formatDuration, intervalToDuration } from "date-fns";
import Link from "next/link";
import { Icon } from "@iconify/react";

interface UsageProps {
  points: number;
  msBeforeNext: number;
}

export const Usage = ({ points, msBeforeNext }: UsageProps) => {
  const resetsIn = formatDuration(
    intervalToDuration({
      start: new Date(),
      end: new Date(Date.now() + msBeforeNext),
    }),
    { format: ["months", "days", "hours", "minutes"] }
  );

  return (
    <div className="rounded-t-2xl bg-white border border-b-0 border-[rgba(14,14,16,0.1)] p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-grid place-items-center h-7 w-7 rounded-full bg-tangerine/10 text-tangerine">
            <Icon icon="solar:bolt-bold" width={14} height={14} />
          </span>
          <div className="leading-tight">
            <div className="text-[13px] font-medium text-ink">
              {points} free credits left
            </div>
            <div className="text-[11px] text-muted-warm">
              Resets in {resetsIn || "a moment"}
            </div>
          </div>
        </div>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 text-[12px] text-tangerine hover:text-[#E64518] font-medium"
        >
          Upgrade
          <Icon icon="solar:arrow-right-linear" width={14} height={14} />
        </Link>
      </div>
    </div>
  );
};
