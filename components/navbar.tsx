"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const pathname = usePathname()
  
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">MyApp</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/pricing"
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium",
                  pathname === "/pricing"
                    ? "border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Pricing
              </Link>
              <Link
                href="/account"
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium",
                  pathname === "/account"
                    ? "border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Account
              </Link>
              <Link
                href="/drop"
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium",
                  pathname === "/drop"
                    ? "border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Drop PDF
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}