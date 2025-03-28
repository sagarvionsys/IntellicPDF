"use client";

import { CreditCard, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import useGetUser from "@/features/user/useGetUser";
import FileCard from "@/components/FileCard";
import { File } from "@prisma/client";
import { Button } from "@/components/ui/button";

// Define plan structure
type Plan = {
  FILES: number;
  QUESTIONSPERFILE: number;
};

// Define available plans
export const PLANS: Record<"BASIC" | "PRO" | "PREMIUM", Plan> = {
  BASIC: { FILES: 3, QUESTIONSPERFILE: 5 },
  PRO: { FILES: 10, QUESTIONSPERFILE: 25 },
  PREMIUM: { FILES: 25, QUESTIONSPERFILE: 75 },
};

export default function AccountPage() {
  const { user, userPending, userError } = useGetUser();
  console.log({ user });

  if (userPending) return <p className="text-center">Loading...</p>;
  if (userError)
    return <p className="text-center text-red-500">Error loading user data</p>;

  const userData = user?.data;

  // Ensure userPlan is a valid key of PLANS
  const userPlan = (
    userData?.plan && Object.keys(PLANS).includes(userData.plan)
      ? (userData.plan as keyof typeof PLANS)
      : "BASIC"
  ) as keyof typeof PLANS;

  const { FILES: maxFiles, QUESTIONSPERFILE: maxQuestionsPerFile } =
    PLANS[userPlan];

  const hasReachedFileLimit = (userData?.files?.length ?? 0) >= maxFiles;

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  {userData?.image ? (
                    <Image
                      alt={userData?.email}
                      src={userData.image}
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                  ) : (
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{userData?.email}</h3>
                  <Button
                    variant={"destructive"}
                    onClick={() => signOut({ callbackUrl: "/sign-in" })}
                  >
                    LogOut
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Your plan and usage limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-6 w-6" />
                  <div>
                    <h4 className="font-medium">{userPlan} Plan</h4>
                    {userData.nextBilling && (
                      <h4 className="font-medium">
                        Next Billing Date - {userData.nextBilling}
                      </h4>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Limited to {maxFiles} files & {maxQuestionsPerFile}{" "}
                      questions per file
                    </p>
                  </div>
                </div>

                {/* File Upload Limit Indicator */}
                <div>
                  <p className="text-sm font-medium mb-1">File Uploads</p>
                  <div className="h-2 bg-secondary rounded-full relative">
                    <div
                      className={`h-full rounded-full ${
                        hasReachedFileLimit ? "bg-red-600" : "bg-primary"
                      }`}
                      style={{
                        width: `${(userData?.files?.length / maxFiles) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {userData?.files?.length} of {maxFiles} files uploaded
                  </p>
                  {hasReachedFileLimit && (
                    <p className="text-xs text-red-500 mt-1">
                      ⚠️ You have reached your file upload limit.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Files & Questions Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">
            Uploaded PDFs & Questions
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userData?.files?.map((file: File) => (
              <FileCard
                key={file.id}
                file={file}
                maxQuestionsPerFile={maxQuestionsPerFile}
                userPlan={userPlan}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
