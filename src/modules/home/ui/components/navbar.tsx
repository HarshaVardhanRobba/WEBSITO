"use client"

import Link from "next/link"
import Image from "next/image"
import { SignInButton, SignedOut, SignUpButton, SignedIn } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import { UserControl } from "@/components/user-control"
import { useScroll } from "@/hooks/use-scroll"
import { cn } from "@/lib/utils"

export const Navbar = () => {
    const Scroll = useScroll();

    return (
        <nav className={cn("p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200", Scroll && "bg-background border-border")}>
            <div className="max-w-5xl mx-auto w-full flex items-start justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image 
                        src="/logo.svg" alt="websito logo" 
                        width={24} 
                        height={24} 
                    />
                    <span className="text-4xl  font-bold bg-linear-to-r bg-red-600 to to-blue-600 bg-clip-text text-transparent">websito</span>
                </Link>
                <Link href="/pricing" className="text-3xl justify-end items-end font-bold">
                <Button className="bg-blue-600 text-white font-semibold hover:bg-blue-800" variant="secondary" size="sm">Pricing </Button>
                </Link>
                <SignedOut>
                    <div className="flex flex-row gap-2 justify-end items-end">
                        <SignUpButton>
                            <Button variant="outline" size="sm">Sign Up</Button>
                        </SignUpButton>
                        <SignInButton>
                            <Button size="sm">Sign In</Button>
                        </SignInButton>
                    </div>
                </SignedOut>
                <SignedIn>
                    <UserControl showname = {true}/>
                </SignedIn>
            </div>
        </nav>
    )
}