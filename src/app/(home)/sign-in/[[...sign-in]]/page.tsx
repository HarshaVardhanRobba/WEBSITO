"use client"

import { SignIn } from '@clerk/nextjs'

import { useCurrentTheme } from "@/hooks/use-current-theme";

import { dark } from "@clerk/themes"

/**
 * Page component that displays a sign in form.
 * 
 * @returns {JSX.Element} A JSX element representing the sign in form.
 */
const Page = () => {
  const currentTheme = useCurrentTheme();


  return (
    <div className="flex flex-col items-center  justify-center max-w-3xl mx-auto w-full">
        <section className='space-y-6 pt-[16vh] 2xl:pt-48'>
            <div>
              <SignIn
                appearance={{
                  baseTheme: currentTheme === "dark" ? dark : undefined,
                  elements: {
                    cardBox: "border! shadow-none! rounded-ld! border-slate-200 dark:border-slate-800",
                  }
                }}/>
            </div>
        </section>
    </div>
  )
}

export default Page
