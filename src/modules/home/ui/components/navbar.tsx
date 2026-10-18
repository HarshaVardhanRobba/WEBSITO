"use client";

import Link from "next/link";
import { SignInButton, SignedOut, SignUpButton, SignedIn } from "@clerk/nextjs";
import { Icon } from "@iconify/react";

import { UserControl } from "@/components/user-control";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

const links = [
  { href: "#build", label: "Build" },
  { href: "#how", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

export const Navbar = () => {
  const scrolled = useScroll();

  return (
    <div
      className={cn(
        "fixed top-4 left-0 right-0 z-50 px-4 transition-all duration-300",
        scrolled && "top-2"
      )}
    >
      <nav className="mx-auto max-w-6xl pill-nav rounded-full px-3 py-2 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 pl-2">
          <span className="inline-flex items-center gap-2">
            <span className="relative inline-block h-6 w-6 rounded-full bg-ink">
              <span className="absolute inset-[3px] rounded-full bg-tangerine" />
            </span>
            <span className="text-[17px] font-semibold tracking-tight text-ink">
              websito
            </span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1 text-[14px] text-ink-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="px-3 py-2 rounded-full hover:bg-[rgba(14,14,16,0.05)] transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 pr-1">
          <SignedOut>
            <SignUpButton>
              <button className="hidden sm:inline-flex text-[14px] text-ink-2 px-3 py-2 rounded-full hover:bg-[rgba(14,14,16,0.05)]">
                Sign up
              </button>
            </SignUpButton>
            <SignInButton>
              <button className="btn-tangerine inline-flex items-center gap-2 px-4 py-2 text-[14px] font-medium">
                Get started
                <Icon icon="solar:arrow-right-linear" width={16} height={16} />
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserControl showname={true} />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};
