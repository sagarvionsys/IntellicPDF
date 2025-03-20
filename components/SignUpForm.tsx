"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { handleOAuth } from "@/actions/authentication";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your email and password below to create an Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </div>
          </form>
          <Button
            onClick={() => handleOAuth("google")}
            variant="outline"
            className="w-full mt-4"
          >
            Continue with Google
          </Button>
          <div className="mt-4 text-center text-sm space-y-2">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline underline-offset-4">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
