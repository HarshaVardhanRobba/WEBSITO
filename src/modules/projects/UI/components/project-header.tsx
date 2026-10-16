"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  MoonIcon,
  SunIcon,
  SunMoonIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
} from "@/components/ui/dropdown-menu";
import { useSuspenseQuery } from "@tanstack/react-query";

interface ProjectHeaderProps {
  projectId: string;
}

export const ProjectHeader = ({ projectId }: ProjectHeaderProps) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );
  const { setTheme, theme } = useTheme();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-[rgba(14,14,16,0.08)] bg-white/80 backdrop-blur-md">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="focus-visible:ring-0 hover:bg-[rgba(14,14,16,0.05)] gap-2"
          >
            <span className="relative inline-block h-5 w-5 rounded-full bg-ink shrink-0">
              <span className="absolute inset-[2px] rounded-full bg-tangerine" />
            </span>
            <span className="text-[13px] font-medium text-ink max-w-[220px] truncate">
              {project?.name}
            </span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-ink/50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="min-w-[200px]">
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center gap-2">
              <ChevronLeftIcon className="w-4 h-4" />
              <span>Back to home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/pricing" className="flex items-center gap-2">
              <Icon icon="solar:bolt-bold" width={14} height={14} className="text-tangerine" />
              <span>Upgrade plan</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <SunMoonIcon className="w-4 h-4 text-muted-foreground" />
              <span>Appearance</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={5}>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(v) => setTheme(v)}
                >
                  <DropdownMenuRadioItem value="light">
                    <SunIcon className="w-4 h-4 mr-2" />
                    <span>Light</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <MoonIcon className="w-4 h-4 mr-2" />
                    <span>Dark</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <SunMoonIcon className="w-4 h-4 mr-2" />
                    <span>System</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-warm">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-tangerine" />
        Live preview
      </div>
    </header>
  );
};
