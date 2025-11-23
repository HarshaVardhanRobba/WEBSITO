// app/layout.tsx;
import { Navbar } from "@/modules/home/ui/components/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vibe — Build something",
  description: "Create apps and websites by chatting with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Use the uploaded dotted image as a repeating background wallpaper.
  // The path below is the local path you uploaded; your deployment pipeline
  // should serve it from /public or adapt the path accordingly.

  return (
    <html lang="en" className="bg-white">
      <body className="min-h-screen font-sans text-slate-900 antialiased">
        <Navbar />
        <div
            className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#dadde2_1px,transparent_1px)]
            [bg-size:16px_16px]dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)]"/>

        {/* page container */}
        <div className="min-h-screen w-full flex flex-col">
          {/* top spacing so hero sits centered-ish like screenshot */}
          <div className="w-full max-w-6xl mx-auto px-6 py-16">{children}</div>
        </div>
      </body>
    </html>
  );
}
