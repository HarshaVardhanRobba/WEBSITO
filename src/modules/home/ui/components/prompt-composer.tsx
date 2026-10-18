"use client";

import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useTRPC } from "@/trpc/client";

const templates = [
  { label: "Netflix clone", prompt: "Build a Netflix clone", icon: "solar:play-circle-bold" },
  { label: "Admin dashboard", prompt: "Build an admin dashboard", icon: "solar:chart-square-bold" },
  { label: "Kanban board", prompt: "Build a kanban board", icon: "solar:clipboard-list-bold" },
  { label: "File manager", prompt: "Build a file manager", icon: "solar:folder-with-files-bold" },
  { label: "YouTube clone", prompt: "Build a YouTube clone", icon: "solar:videocamera-bold" },
  { label: "Store page", prompt: "Build a store page", icon: "solar:bag-4-bold" },
  { label: "Airbnb clone", prompt: "Build an Airbnb clone", icon: "solar:home-bold" },
  { label: "Spotify clone", prompt: "Build a Spotify clone", icon: "solar:music-notes-bold" },
];

export function PromptComposer() {
  const router = useRouter();
  const trpc = useTRPC();
  const { user } = useUser();
  const [prompt, setPrompt] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const { mutate: createProject, isPending } = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data: { id: string }) => {
        trpc.usage.status.queryOptions();
        router.push(`/projects/${data.id}`);
      },
      onError: (err: unknown) => {
        console.error(err);
        toast.error(
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : "Failed to create project"
        );
        if (
          err &&
          typeof err === "object" &&
          "data" in err &&
          (err as { data?: { code?: string } }).data?.code === "TOO_MANY_REQUESTS"
        ) {
          router.push("/pricing");
        }
      },
    })
  );

  const submit = () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Describe what you want to build.");
      return;
    }
    if (isPending) return;
    createProject({ value: prompt });
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.from(".composer-reveal", {
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 80%" },
      });
      gsap.from(".composer-chip", {
        opacity: 0,
        y: 14,
        duration: 0.5,
        stagger: 0.04,
        ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="build" ref={rootRef} className="relative px-6 pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between gap-6 mb-6 composer-reveal">
          <div>
            <span className="eyebrow">The composer</span>
            <h2 className="mt-4 text-[34px] md:text-[44px] leading-[1.02] tracking-tight text-ink font-semibold">
              Describe it. <span className="serif-italic text-tangerine">We draft it.</span>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[12px] text-muted-warm">
            <kbd className="px-2 py-1 rounded-md bg-white border border-[rgba(14,14,16,0.1)] text-ink">⌘</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 rounded-md bg-white border border-[rgba(14,14,16,0.1)] text-ink">Enter</kbd>
            <span>to send</span>
          </div>
        </div>

        <div className="composer-shell rounded-[28px] p-4 md:p-6 composer-reveal">
          <div className="flex items-center justify-between px-2 pb-3">
            <div className="flex items-center gap-2 text-[12px] text-muted-warm">
              <span className="inline-flex h-2 w-2 rounded-full bg-tangerine" />
              <span>Ready when you are</span>
            </div>
            <div className="text-[12px] text-muted-warm">
              Draft {prompt.length} / 2000
            </div>
          </div>

          <div className="relative rounded-2xl border border-[rgba(14,14,16,0.1)] bg-white">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 2000))}
              onKeyDown={onKey}
              placeholder="A dashboard for a small coffee roastery — inventory, orders, and a storefront."
              className="w-full min-h-[180px] md:min-h-[200px] resize-none bg-transparent rounded-2xl p-5 pr-16 text-[16px] md:text-[17px] text-ink placeholder:text-[rgba(14,14,16,0.35)] focus:outline-none"
              aria-label="Describe what you want to build"
            />
            <button
              onClick={submit}
              disabled={isPending || !prompt.trim()}
              className="btn-tangerine absolute right-3 bottom-3 h-11 w-11 grid place-items-center disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Create project"
            >
              {isPending ? (
                <Icon icon="solar:refresh-bold" width={18} height={18} className="animate-spin" />
              ) : (
                <Icon icon="solar:arrow-right-linear" width={20} height={20} />
              )}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {templates.map((t) => (
              <button
                key={t.label}
                onClick={() => setPrompt(t.prompt)}
                className="composer-chip chip-ghost inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px]"
              >
                <Icon icon={t.icon} width={14} height={14} className="text-tangerine" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-[12px] text-muted-warm px-1">
          Not signed in? You&rsquo;ll be asked to sign in before your first build.
        </p>
      </div>
    </section>
  );
}
