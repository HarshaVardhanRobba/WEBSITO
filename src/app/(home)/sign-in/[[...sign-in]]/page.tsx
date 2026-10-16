"use client";

import { SignIn } from "@clerk/nextjs";
import { Icon } from "@iconify/react";

const Page = () => {
  return (
    <div className="relative min-h-screen px-6 pt-32 pb-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <aside className="lg:col-span-5 relative">
          <span className="eyebrow">Welcome back</span>
          <h1 className="mt-6 text-[44px] md:text-[60px] leading-[0.98] tracking-tight text-ink font-semibold">
            Pick up where you{" "}
            <span className="serif-italic text-tangerine">left off.</span>
          </h1>
          <p className="mt-6 max-w-md text-[16px] text-muted-warm">
            Sign in to open your workspace and keep building. Your projects stay
            exactly as you left them.
          </p>

          <ul className="mt-10 space-y-4 text-[14px] text-ink-2">
            {[
              { i: "solar:bolt-bold", t: "Resume any draft in seconds" },
              { i: "solar:shield-check-bold", t: "Signed in and encrypted end-to-end" },
              { i: "solar:magic-stick-3-bold", t: "Same prompt, same vibe" },
            ].map((f) => (
              <li key={f.t} className="flex items-center gap-3">
                <span className="inline-grid place-items-center h-8 w-8 rounded-full bg-tangerine/10 text-tangerine">
                  <Icon icon={f.i} width={16} height={16} />
                </span>
                {f.t}
              </li>
            ))}
          </ul>
        </aside>

        <section className="lg:col-span-7">
          <div className="composer-shell rounded-[28px] p-4 md:p-6 w-full">
            <SignIn
              appearance={{
                variables: {
                  colorPrimary: "#FF5B2E",
                  colorText: "#0E0E10",
                  colorBackground: "#ffffff",
                  colorInputBackground: "#ffffff",
                  colorInputText: "#0E0E10",
                  borderRadius: "14px",
                  fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                },
                elements: {
                  rootBox: "w-full",
                  cardBox: "shadow-none! border-0! bg-transparent! w-full",
                  card: "shadow-none! border-0! bg-transparent! p-0!",
                  headerTitle: "text-ink text-[22px] font-semibold",
                  headerSubtitle: "text-muted-warm text-[14px]",
                  formButtonPrimary:
                    "bg-tangerine! hover:bg-[#E64518]! shadow-[0_10px_25px_-12px_rgba(255,91,46,0.6)]! normal-case! font-medium!",
                  socialButtonsBlockButton:
                    "border-[rgba(14,14,16,0.14)]! hover:bg-[rgba(14,14,16,0.03)]!",
                  footerActionLink: "text-tangerine! hover:text-[#E64518]!",
                },
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
