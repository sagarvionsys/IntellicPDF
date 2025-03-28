"use client";

import useGetUser from "@/features/user/useGetUser";
import TransactionTable from "@/components/account/TransactionTable";
import SubscriptionCard from "@/components/account/SubcriptionCard";
import ProfileCard from "@/components/account/ProfileCard";
import {
  Transaction,
  User as PrismaUser,
  File as PrismaFile,
  Chat as PrismaChat,
} from "@prisma/client";

type Plan = {
  FILES: number;
  QUESTIONSPERFILE: number;
};
export interface File extends PrismaFile {
  chats: PrismaChat[];
}

export interface ExtendedUser extends PrismaUser {
  files: File[];
  transactions: Transaction[];
}

export const PLANS: Record<"BASIC" | "PRO" | "PREMIUM", Plan> = {
  BASIC: { FILES: 3, QUESTIONSPERFILE: 5 },
  PRO: { FILES: 10, QUESTIONSPERFILE: 25 },
  PREMIUM: { FILES: 25, QUESTIONSPERFILE: 75 },
};

export default function AccountPage() {
  const { user, userPending, userError } = useGetUser();

  if (userPending) return <p className="text-center text-lg">Loading...</p>;
  if (userError)
    return <p className="text-center text-lg">Error loading user data</p>;

  const userData = user?.data as ExtendedUser;
  const userTransactions = userData.transactions ?? [];

  // Get user plan and ensure it's a valid option
  const userPlan = PLANS[userData?.plan as keyof typeof PLANS]
    ? (userData.plan as keyof typeof PLANS)
    : "BASIC";

  return (
    <div className="py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="grid gap-8 md:grid-cols-2 ">
          <ProfileCard userData={userData} />
          <SubscriptionCard userPlan={userPlan} userData={userData} />
        </section>
        <TransactionTable transactions={userTransactions} />
      </div>
    </div>
  );
}
