import Link from "next/link";
import { Icon } from "@iconify/react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative px-6 pb-10 pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[28px] bg-ink text-white p-8 md:p-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-tangerine" />
                Final nudge
              </span>
              <h3 className="mt-5 text-[36px] md:text-[52px] leading-[1.02] tracking-tight font-semibold">
                Your next project is{" "}
                <span className="serif-italic text-tangerine">one sentence away.</span>
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="#build"
                className="btn-tangerine inline-flex items-center gap-2 px-5 py-3 text-[15px] font-medium"
              >
                Start building
                <Icon icon="solar:arrow-right-linear" width={18} height={18} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 text-white/90 hover:bg-white/5 text-[15px]"
              >
                See pricing
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-[13px] text-muted-warm">
          <div className="flex items-center gap-3">
            <span className="relative inline-block h-5 w-5 rounded-full bg-ink">
              <span className="absolute inset-[2px] rounded-full bg-tangerine" />
            </span>
            <span className="text-ink font-medium">websito</span>
            <span className="opacity-60">&copy; {year}</span>
          </div>
          <nav className="flex items-center gap-5">
            <Link href="/pricing" className="hover:text-ink">Pricing</Link>
            <Link href="#how" className="hover:text-ink">How it works</Link>
            <Link href="/sign-in" className="hover:text-ink">Sign in</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
