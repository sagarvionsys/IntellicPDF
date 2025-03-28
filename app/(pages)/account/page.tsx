"use client";

import useGetUser from "@/features/user/useGetUser";
import TransactionTable from "@/components/account/TransactionTable";
import FileCards from "@/components/account/FileCards";
import SubscriptionCard from "@/components/account/SubcriptionCard";
import ProfileCard from "@/components/account/ProfileCard";

type Plan = {
  FILES: number;
  QUESTIONSPERFILE: number;
};

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

  const userData = user?.data ?? {};
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
        <FileCards
          files={userData.files ?? []}
          maxQuestionsPerFile={PLANS[userPlan].QUESTIONSPERFILE}
          userPlan={userPlan}
        />
        <TransactionTable transactions={userTransactions} />
      </div>
    </div>
  );
}
