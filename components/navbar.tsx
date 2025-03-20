"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

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
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href={"/account"}>
              <Avatar className="h-10 w-10">
                <Image
                  alt={session?.user.email!}
                  src={session?.user?.image!}
                  width={100}
                  height={100}
                />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
