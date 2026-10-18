"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { Icon } from "@iconify/react";

import { useTRPC } from "@/trpc/client";

export function UserProjects() {
  const trpc = useTRPC();
  const { user, isLoaded } = useUser();
  const { data: projects } = useQuery({
    ...trpc.projects.getMany.queryOptions(),
    enabled: !!user,
  });

  if (!isLoaded) return null;
  if (!user) return null;

  const sorted =
    projects?.toSorted(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ) ?? [];

  return (
    <section className="relative px-6 pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <span className="eyebrow">Your workspace</span>
            <h2 className="mt-4 text-[30px] md:text-[38px] leading-[1.05] tracking-tight text-ink font-semibold">
              Pick up where you left off,{" "}
              <span className="serif-italic text-tangerine">
                {user.firstName ?? "friend"}.
              </span>
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden md:inline-flex items-center gap-2 text-[13px] text-ink-2 border border-[rgba(14,14,16,0.14)] rounded-full px-4 py-2 hover:bg-white"
          >
            View all
            <Icon icon="solar:arrow-right-linear" width={14} height={14} />
          </Link>
        </div>

        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[rgba(14,14,16,0.18)] bg-white/60 p-10 text-center">
            <div className="inline-grid place-items-center h-12 w-12 rounded-full bg-tangerine/10 text-tangerine mb-4">
              <Icon icon="solar:add-square-bold" width={22} height={22} />
            </div>
            <p className="text-[15px] text-ink">No projects yet.</p>
            <p className="text-[13px] text-muted-warm mt-1">
              Scroll up and write your first prompt &mdash; it takes a sentence.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.slice(0, 6).map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.id}`}
                  className="group block rounded-2xl bg-white/80 border border-[rgba(14,14,16,0.08)] p-5 h-full transition-all hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-25px_rgba(14,14,16,0.3)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-warm">
                      <span className="h-1.5 w-1.5 rounded-full bg-tangerine" />
                      Project
                    </span>
                    <Icon
                      icon="solar:arrow-right-up-linear"
                      width={18}
                      height={18}
                      className="text-ink/40 group-hover:text-tangerine transition-colors"
                    />
                  </div>
                  <h3 className="mt-6 text-[18px] font-semibold text-ink leading-snug line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-[12px] text-muted-warm">
                    Updated{" "}
                    {formatDistanceToNow(new Date(p.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
