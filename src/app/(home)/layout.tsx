import { Navbar } from "@/modules/home/ui/components/navbar";
import { SmoothScroll } from "@/modules/home/ui/components/smooth-scroll";
import { SiteFooter } from "@/modules/home/ui/components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Websito — Build apps by vibe",
  description: "Create apps and websites by chatting with AI.",
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="home-surface min-h-screen w-full">
      <SmoothScroll />
      <Navbar />
      <main className="relative">{children}</main>
      <SiteFooter />
    </div>
  );
}
