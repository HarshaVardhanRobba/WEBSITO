"use client";

import { SignUp } from "@clerk/nextjs";
import { Icon } from "@iconify/react";

const Page = () => {
  return (
    <div className="relative min-h-screen px-6 pt-32 pb-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <aside className="lg:col-span-5 relative">
          <span className="eyebrow">Create your account</span>
          <h1 className="mt-6 text-[44px] md:text-[60px] leading-[0.98] tracking-tight text-ink font-semibold">
            One sentence away from{" "}
            <span className="serif-italic text-tangerine">a running app.</span>
          </h1>
          <p className="mt-6 max-w-md text-[16px] text-muted-warm">
            Create a free account to save projects, resume drafts, and export the
            source whenever you want.
          </p>

          <ul className="mt-10 space-y-4 text-[14px] text-ink-2">
            {[
              { i: "solar:gift-bold", t: "Free to start, no credit card required" },
              { i: "solar:code-square-bold", t: "Keep the real codebase, not a lock-in" },
              { i: "solar:settings-bold", t: "Deploy anywhere, when you're ready" },
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
            <SignUp
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
