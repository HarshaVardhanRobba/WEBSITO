import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
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
    const { data: project } = useSuspenseQuery (trpc.projects.getOne.queryOptions({ id: projectId })
    );

    const { setTheme, theme } = useTheme();

    return (
    <header className="flex items-center justify-between px-4 py-4 border-b">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost"
                    size="sm" 
                    className="focus-visible:ring-0hover:bg-trasparent hover:opacity-100">
                        <Image src="/logo.svg" alt="Coco Ai" width={18} height={18} className="shrink-0" />
                        <span className="text-sm font-medium bg-linear-to-r from-red-900 to-red-800 bg-clip-text text-transparent">{project?.name}</span>
                        <ChevronDownIcon className="w-4 h-4 ml-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start">
                <DropdownMenuItem asChild>
                    <Link href="/">
                    <ChevronLeftIcon />
                    <span>Back to Home</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="gap-2">
                        <SunMoonIcon className="w-4 h-4 text-muted-foreground"/>
                        <span>Appear</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent sideOffset={5}>
                            <DropdownMenuRadioGroup value={theme}  onValueChange={() => setTheme(theme === "light" ? "dark" : "light")}>
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
    </header>
    );
};