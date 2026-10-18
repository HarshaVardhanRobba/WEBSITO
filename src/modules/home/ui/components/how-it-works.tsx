"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
  {
    k: "01",
    icon: "solar:chat-round-dots-bold",
    title: "Describe",
    body: "Write a sentence. A paragraph. A product spec. The composer accepts whatever you&rsquo;ve got.",
  },
  {
    k: "02",
    icon: "solar:programming-bold",
    title: "Draft",
    body: "Websito generates a real codebase, scaffolds routes, and wires the logic to a live preview.",
  },
  {
    k: "03",
    icon: "solar:cloud-upload-bold",
    title: "Ship",
    body: "Iterate inside the preview, export the source, or keep building. The project is yours.",
  },
];

export function HowItWorks() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.from(".how-step", {
        opacity: 0,
        y: 32,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how" ref={rootRef} className="relative px-6 pb-28">
      <div className="mx-auto max-w-6xl">
        <div className="hair-rule mb-14" />
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="eyebrow">How it works</span>
            <h2 className="mt-4 text-[34px] md:text-[46px] leading-[1.02] tracking-tight text-ink font-semibold max-w-xl">
              Three steps between an idea and{" "}
              <span className="serif-italic text-tangerine">a running app.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[15px] text-muted-warm">
            No boilerplate, no setup. Describe the thing. Watch it draft. Keep what works.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s) => (
            <article
              key={s.k}
              className="how-step rounded-2xl bg-white/80 border border-[rgba(14,14,16,0.08)] p-6 h-full"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] tracking-[0.18em] text-muted-warm">
                  {s.k}
                </span>
                <span className="inline-grid place-items-center h-10 w-10 rounded-full bg-tangerine/10 text-tangerine">
                  <Icon icon={s.icon} width={20} height={20} />
                </span>
              </div>
              <h3 className="mt-10 text-[22px] font-semibold text-ink">{s.title}</h3>
              <p
                className="mt-3 text-[14px] text-muted-warm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: s.body }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
