"use client";

import React, { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/nextjs";

const templateOptions = [
  "Build a Netflix clone",
  "Build an admin dashboard",
  "Build a kanban board",
  "Build a file manager",
  "Build a YouTube clone",
  "Build a store page",
  "Build an Airbnb clone",
  "Build a Spotify clone",
];

export default function Page() {
  const router = useRouter();
  const trpc = useTRPC();
  const { user } = useUser();
  const [prompt, setPrompt] = useState("");

  // Only fetch projects if the user is signed in
  const { data: projects } = useQuery({
    ...trpc.projects.getMany.queryOptions(),
    enabled: !!user,
  });

  const sorted =
    projects?.toSorted(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ) ?? [];

  const { mutate: createProject, isPending } = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (err: unknown) => {
        console.error(err);
        toast.error(
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : "Failed to create project"
        );
      },
      onSuccess: (data: { id: string }) => router.push(`/projects/${data.id}`),
    })
  );

  const handleSubmit = () => {
    // If user is not signed in, redirect to sign-in page
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please describe what you want to build.");
      return;
    }
    if (isPending) return;
    createProject({ value: prompt });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const isMetaEnter = (e.metaKey || e.ctrlKey) && e.key === "Enter";
    if (isMetaEnter) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main className="w-full py-16">
      {/* Hero */}
      <header className="max-w-4xl mx-auto text-center mt-6">
        <Image
          src="/logo.svg"
          alt="websito logo"
          width={40}
          height={40}
          className="mx-auto"
        />
        <h1 className="text-5xl font-extrabold tracking-tight bg-linear-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
          Build something with Vibe
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Create apps and websites by chatting with AI
        </p>
      </header>

      {/* Big prompt card */}
      <section className="max-w-4xl mx-auto mt-10">
        <div className="rounded-xl border border-slate-200 bg-white/75 p-6 shadow-sm py-4">
          <label className="text-slate-500 block mb-3 ">
            What would you like to build?
          </label>

          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Try: Build a simple weather app with React and Tailwind"
              className="w-full min-h-[150px] resize-none rounded-lg border border-slate-100 bg-white p-4 placeholder:text-slate-300 text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            <div className="absolute bottom-3 left-4 text-xs text-slate-400">
              ⌘ / Ctrl + Enter to submit
            </div>

            <div className="absolute right-4 bottom-3">
              <button
                onClick={handleSubmit}
                disabled={isPending || !prompt.trim()}
                className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shadow-sm hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
                aria-label="submit"
              >
                {isPending ? "…" : "➤"}
              </button>
            </div>
          </div>

          {/* chips */}
          <div className="mt-6 flex flex-wrap gap-3 justify-end">
            {templateOptions.map((t) => (
              <button
                key={t}
                onClick={() => setPrompt(t)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-xs hover:shadow-md transition"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Saved Vibes */}
      <section className="max-w-5xl mx-auto mt-12">
        <div className="rounded-2xl bg-white p-8 border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            {user ? `${user.firstName} Projects` : "Your Projects"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {user && projects && projects.length === 0 && (
              <div className="col-span-full text-center">
                <p className="text-sm text-muted-foreground">
                  NO PROJECTS FOUND
                </p>
              </div>
            )}

            {user &&
              sorted
                ?.slice(0, 6)
                .map((project) => (
                  <Button
                    key={project.id}
                    variant="outline"
                    className="font-normal h-auto justify-start w-full text-left p-4"
                    asChild
                  >
                    <Link href={`/projects/${project.id}`}>
                      <div className="flex items-center gap-x-4">
                        <Image
                          src="/logo.svg"
                          alt={project.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                        <div className="flex-1">
                          {/* Gradient Background Pill */}
                          <h3 className="inline-block text-sm font-semibold leading-none text-white rounded-md px-2 py-1 bg-linear-to-r from-blue-500 to-red-500">
                            {project.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(project.updatedAt),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </Button>
                ))}
          </div>
        </div>
      </section>

      <div className="h-24" />
    </main>
  );
}
