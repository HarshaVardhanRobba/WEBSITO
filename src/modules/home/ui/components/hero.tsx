"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Icon } from "@iconify/react";
import { HeroRibbon } from "./hero-ribbon";

const line1 = ["Build", "apps"];
const line2 = ["by", "vibe."];

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root) return;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set(".hero-word", { yPercent: 110, opacity: 0 });
      gsap.set(".hero-eyebrow, .hero-sub, .hero-cta, .hero-meta, .hero-float", {
        opacity: 0,
        y: 24,
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.6 })
        .to(
          ".hero-word",
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.06 },
          "-=0.3"
        )
        .to(".hero-sub", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 }, "-=0.3")
        .to(".hero-meta", { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .to(".hero-float", { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 }, "-=0.4");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative pt-36 md:pt-40 pb-24 md:pb-32 px-6"
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-6 relative z-10">
          <span className="eyebrow hero-eyebrow">
            AI website &amp; app builder
          </span>

          <h1
            className="mt-6 text-[52px] leading-[0.95] md:text-[76px] md:leading-[0.95] tracking-tight text-ink font-semibold"
            aria-label="Build apps by vibe."
          >
            <span className="block overflow-hidden" aria-hidden="true">
              <span className="inline-flex gap-x-4">
                {line1.map((w, i) => (
                  <span key={i} className="hero-word inline-block">
                    {w}
                  </span>
                ))}
              </span>
            </span>
            <span className="block overflow-hidden mt-1" aria-hidden="true">
              <span className="inline-flex gap-x-4 items-baseline">
                {line2.map((w, i) => (
                  <span
                    key={i}
                    className="hero-word inline-block serif-italic text-tangerine"
                  >
                    {w}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          <p className="hero-sub mt-6 max-w-md text-[17px] leading-relaxed text-muted-warm">
            Describe what you want. Websito drafts the pages, wires the logic,
            and ships a running project in minutes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#build" className="hero-cta btn-tangerine inline-flex items-center gap-2 px-5 py-3 text-[15px] font-medium">
              Start building
              <Icon icon="solar:arrow-right-linear" width={18} height={18} />
            </a>
            <a
              href="#how"
              className="hero-cta inline-flex items-center gap-2 px-5 py-3 text-[15px] text-ink border border-[rgba(14,14,16,0.14)] rounded-full hover:bg-white transition-colors"
            >
              <span className="inline-grid place-items-center h-6 w-6 rounded-full bg-ink text-white">
                <Icon icon="solar:play-bold" width={12} height={12} />
              </span>
              How it works
            </a>
          </div>

          <div className="hero-meta mt-10 flex items-center gap-6 text-[13px] text-muted-warm">
            <span className="inline-flex items-center gap-2">
              <Icon icon="solar:bolt-bold" width={16} height={16} className="text-tangerine" />
              Live preview in-browser
            </span>
            <span className="hidden sm:inline-flex items-center gap-2">
              <Icon icon="solar:code-square-bold" width={16} height={16} className="text-tangerine" />
              Real codebase, yours to export
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="relative mx-auto w-full max-w-[560px]">
            <HeroRibbon />

            <div className="hero-float glass-card absolute -left-2 md:-left-10 top-6 md:top-10 w-[220px] rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 h-9 w-9 rounded-xl bg-tangerine/10 text-tangerine grid place-items-center">
                  <Icon icon="solar:magic-stick-3-bold" width={18} height={18} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-ink">Prompt to page</div>
                  <div className="text-[12px] text-muted-warm leading-snug">
                    Turn an idea into a working app in a single conversation.
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-float glass-card absolute -right-2 md:-right-6 bottom-6 md:bottom-12 w-[240px] rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 h-9 w-9 rounded-xl bg-ink text-tangerine grid place-items-center">
                  <Icon icon="solar:cloud-upload-bold" width={18} height={18} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-ink">Ship, iterate, ship</div>
                  <div className="text-[12px] text-muted-warm leading-snug">
                    Preview, tweak, and keep the full source when you&rsquo;re happy.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-meta hidden lg:flex absolute right-2 -bottom-6 flex-col items-center gap-2 text-[11px] uppercase tracking-widest text-ink/60">
            <span>Scroll</span>
            <span className="scroll-ind" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
