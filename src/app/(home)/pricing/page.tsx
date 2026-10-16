"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SignedIn, SignedOut, SignInButton, PricingTable as ClerkPricingTable } from "@clerk/nextjs";
import { CheckoutButton } from "@clerk/nextjs/experimental";

const STARTER_PLAN_ID = "cplan_starter_example";
const PRO_PLAN_ID = "cplan_pro_example";

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Plans are month-to-month or annual. Cancel from your account; access continues until the end of the current period.",
  },
  {
    q: "Do I own the code my project generates?",
    a: "Yes. Projects you build with Websito are yours. Export the source whenever you want.",
  },
  {
    q: "What happens if I hit the plan limit?",
    a: "You'll be prompted to upgrade before you lose access. Existing projects stay available on every plan.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes. You can build a limited number of projects before a paid plan is required.",
  },
];

const starterFeatures = [
  "Unlimited drafts",
  "Live preview in-browser",
  "Export full source",
  "Community support",
];

const proFeatures = [
  "Everything in Starter",
  "Higher project limits",
  "Priority generation queue",
  "Email support",
  "Early access to new models",
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.from(".price-hero > *", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
      });
      gsap.from(".price-card", {
        opacity: 0,
        y: 32,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".price-cards", start: "top 80%" },
      });
      gsap.from(".faq-row", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".faq-wrap", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const period = billing === "monthly" ? "month" : "annual";

  return (
    <div ref={rootRef} className="px-6 pt-36 md:pt-40 pb-28">
      <section className="price-hero mx-auto max-w-4xl text-center">
        <span className="eyebrow mx-auto">Pricing</span>
        <h1 className="mt-6 text-[48px] md:text-[72px] leading-[0.98] tracking-tight text-ink font-semibold">
          Simple plans.{" "}
          <span className="serif-italic text-tangerine">Honest limits.</span>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-[17px] text-muted-warm">
          Start free. Upgrade when your workspace outgrows it. No lock-in &mdash;
          your projects stay yours either way.
        </p>

        <div className="mt-9 inline-flex p-1 rounded-full bg-white/70 border border-[rgba(14,14,16,0.1)]">
          {(["monthly", "yearly"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setBilling(v)}
              aria-pressed={billing === v}
              className={`px-4 py-2 rounded-full text-[13px] transition-colors ${
                billing === v
                  ? "bg-ink text-white"
                  : "text-ink-2 hover:bg-[rgba(14,14,16,0.05)]"
              }`}
            >
              {v === "monthly" ? "Monthly" : "Yearly · save 20%"}
            </button>
          ))}
        </div>
      </section>

      <section className="price-cards mx-auto max-w-6xl mt-16 grid grid-cols-1 md:grid-cols-2 gap-5">
        <article className="price-card rounded-[28px] bg-white/80 border border-[rgba(14,14,16,0.08)] p-8 md:p-10 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Starter</span>
            <Icon icon="solar:leaf-bold" width={22} height={22} className="text-tangerine" />
          </div>
          <h2 className="mt-6 text-[40px] font-semibold text-ink leading-none">
            Free
          </h2>
          <p className="mt-2 text-[14px] text-muted-warm">
            For first projects and weekend builds.
          </p>

          <ul className="mt-8 space-y-3 text-[14px] text-ink-2 flex-1">
            {starterFeatures.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" width={18} height={18} className="text-tangerine mt-0.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-3">
            <SignedOut>
              <SignInButton>
                <button className="inline-flex items-center gap-2 px-5 py-3 text-[14px] rounded-full border border-[rgba(14,14,16,0.14)] hover:bg-white">
                  Start free
                  <Icon icon="solar:arrow-right-linear" width={16} height={16} />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-3 text-[14px] rounded-full border border-[rgba(14,14,16,0.14)] hover:bg-white"
              >
                Go to builder
                <Icon icon="solar:arrow-right-linear" width={16} height={16} />
              </Link>
            </SignedIn>
          </div>
        </article>

        <article className="price-card relative rounded-[28px] bg-ink text-white p-8 md:p-10 flex flex-col overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-32 -right-20 h-72 w-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,91,46,0.5), transparent 65%)" }}
          />
          <div className="relative flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-tangerine" /> Pro
            </span>
            <Icon icon="solar:bolt-bold" width={22} height={22} className="text-tangerine" />
          </div>

          <div className="relative mt-6 flex items-baseline gap-2">
            <span className="text-[40px] font-semibold leading-none">
              ${billing === "monthly" ? 29 : 23}
            </span>
            <span className="text-[14px] text-white/60">
              / {billing === "monthly" ? "month" : "month, billed yearly"}
            </span>
          </div>
          <p className="relative mt-2 text-[14px] text-white/70">
            For regular builders shipping real projects.
          </p>

          <ul className="relative mt-8 space-y-3 text-[14px] text-white/90 flex-1">
            {proFeatures.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" width={18} height={18} className="text-tangerine mt-0.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="relative mt-10 flex items-center gap-3">
            <SignedIn>
              <CheckoutButton planId={PRO_PLAN_ID} planPeriod={period}>
                <button className="btn-tangerine inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium">
                  Upgrade to Pro
                  <Icon icon="solar:arrow-right-linear" width={16} height={16} />
                </button>
              </CheckoutButton>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <button className="btn-tangerine inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium">
                  Sign in to upgrade
                  <Icon icon="solar:arrow-right-linear" width={16} height={16} />
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          <SignedIn>
            {STARTER_PLAN_ID && (
              <CheckoutButton planId={STARTER_PLAN_ID} planPeriod={period}>
                <button className="relative mt-3 text-[12px] text-white/50 hover:text-white/80 self-start">
                  Or pick Starter checkout &rarr;
                </button>
              </CheckoutButton>
            )}
          </SignedIn>
        </article>
      </section>

      <section className="mx-auto max-w-6xl mt-20">
        <div className="hair-rule mb-10" />
        <div className="flex items-end justify-between gap-6 mb-8">
          <h2 className="text-[26px] md:text-[32px] font-semibold text-ink">
            Full plan comparison
          </h2>
          <span className="text-[12px] text-muted-warm">Powered by Clerk Billing</span>
        </div>
        <div className="rounded-[28px] bg-white/80 border border-[rgba(14,14,16,0.08)] p-6 md:p-8">
          <ClerkPricingTable />
        </div>
      </section>

      <section className="faq-wrap mx-auto max-w-4xl mt-24">
        <div className="hair-rule mb-10" />
        <div className="mb-8">
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-4 text-[30px] md:text-[38px] font-semibold text-ink">
            Still thinking{" "}
            <span className="serif-italic text-tangerine">about it?</span>
          </h2>
        </div>
        <dl className="divide-y divide-[rgba(14,14,16,0.08)]">
          {faqs.map((f) => (
            <div key={f.q} className="faq-row py-6">
              <dt className="text-[17px] font-semibold text-ink">{f.q}</dt>
              <dd className="mt-2 text-[14px] text-muted-warm leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
