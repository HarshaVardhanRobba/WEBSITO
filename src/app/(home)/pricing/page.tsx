"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

// Clerk components
import { SignedIn } from "@clerk/nextjs";
import { CheckoutButton } from "@clerk/nextjs/experimental";
import { PricingTable as ClerkPricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  // Replace these with your real Clerk plan IDs (found in Clerk Dashboard -> Billing -> Plans)
  const STARTER_PLAN_ID = "cplan_starter_example";   // monthly/annual variants in Clerk can share one plan id; use `planPeriod` to choose month/annual
  const PRO_PLAN_ID = "cplan_pro_example";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1220] text-slate-900 dark:text-slate-100">
      <header className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-linear-to-br from-rose-500 to-yellow-400 flex items-center justify-center text-white font-semibold">K</div>
          <div>
            <span className="font-bold">Harsha</span>
            <div className="text-xs text-slate-500 dark:text-slate-400 -mt-1">Websito Billing</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/" className="text-sm hover:underline">Home</Link>
          <a href="/menu" className="text-sm hover:underline">Menu</a>
          <a href="/contact" className="text-sm hover:underline">Contact</a>
          <Link href="../sign-in">
            <Button size="sm">Sign in</Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Simple pricing our self building websites
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-xl">
            Pick a plan that fits your website — whether you’re testing a popup or scaling a national chain. Transparent billing, no surprise fees.
          </p>

          <div className="mt-6 flex items-center gap-4 bg-white dark:bg-[#061022] p-1 rounded-full w-max border">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 rounded-full text-sm transition ${billing === "monthly" ? 'bg-linear-to-r from-rose-500 to-yellow-400 text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
              aria-pressed={billing === "monthly"}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-2 rounded-full text-sm transition ${billing === "yearly" ? 'bg-linear-to-r from-rose-500 to-yellow-400 text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
              aria-pressed={billing === "yearly"}
            >
              Yearly (save 20%)
            </button>
          </div>

          <div className="mt-6 flex gap-3">
            {/* GET STARTED -> Checkout for Starter plan */}
            <SignedIn>
              <CheckoutButton
                planId={STARTER_PLAN_ID}
                planPeriod={billing === "monthly" ? "month" : "annual"}
                // optional: newSubscriptionRedirectUrl="/dashboard"
              >
                <button className="inline-flex items-center text-l font-bold px-4 py-2 bg-rose-500 text-white rounded">Get started</button>
              </CheckoutButton>
            </SignedIn>

            <a href="#compare" className="inline-flex items-center text-sm underline">Compare plans</a>
          </div>

          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 mt-1 text-emerald-500" />
              <span>30-day money back guarantee</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 mt-1 text-emerald-500" />
              <span>PCI-compliant payments</span>
            </li>
          </ul>
        </div>

        <div className="relative order-first md:order-last">
          <div className="rounded-2xl overflow-hidden shadow-lg bg-linear-to-br from-[#0f172a] to-[#071126] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-75">Popular</div>
                <div className="text-xl font-bold mt-2">Pro — Team</div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-70">Starting at</div>
                <div className="text-3xl font-extrabold">${billing === "monthly" ? 39 : 36}</div>
                <div className="text-xs opacity-60">{billing === "monthly" ? "/mo" : "/yr"}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">🍽️</div>
                <div>
                  <div className="text-sm font-semibold">Orders / month</div>
                  <div className="text-xs opacity-80">Unlimited</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">⚡</div>
                <div>
                  <div className="text-sm font-semibold">Priority support</div>
                  <div className="text-xs opacity-80">1-hour response time</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <SignedIn>
                <CheckoutButton
                  planId={PRO_PLAN_ID}
                  planPeriod={billing === "monthly" ? "month" : "annual"}
                >
                  <button
                    type="button"
                    className="inline-flex items-center text-l font-bold px-4 py-2 bg-white text-slate-900 rounded cursor-pointer"
                  >
                    Start Trial
                  </button>
                </CheckoutButton>
              </SignedIn>
              <Button variant="ghost">Contact sales</Button>
            </div>
          </div>

          {/* subtle decor */}
          <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-rose-400 opacity-20 blur-3xl"></div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold">Choose a plan</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">No contracts. Upgrade, downgrade, or cancel anytime.</p>

        <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-3">
          <div className="rounded-2xl border p-6 bg-white dark:bg-[#041022]">
            <div id="clerk-pricing-table">
              <ClerkPricingTable />
            </div>
          </div>
          {/* you can duplicate or layout as needed */}
        </div>

        <div id="compare" className="mt-10 bg-white dark:bg-[#041022] p-6 rounded-2xl">
          <h4 className="font-semibold">Compare features</h4>
          <div className="mt-4 overflow-auto">
            {/* table omitted for brevity — keep your existing compare table */}
          </div>
        </div>

        <div className="mt-8">
          <h4 className="font-extrabold text-2xl"> Compare our pricing</h4>
          <div className="mt-4">
            <ClerkPricingTable />
          </div>
        </div>
      </section>

      <footer className="mt-12 border-t pt-8 pb-12">
        <div className="max-w-6xl mx-auto px-6 text-sm text-slate-600 dark:text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} Harsha. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
