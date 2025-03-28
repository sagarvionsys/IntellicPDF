"use client";

import FileCards from "@/components/account/FileCards";
import useGetUser from "@/features/user/useGetUser";
import React from "react";
import { ExtendedUser, PLANS } from "../account/page";

const page = () => {
  const { user, userPending, userError } = useGetUser();

  const userData = user?.data as ExtendedUser;
  const userPlan = PLANS[userData?.plan as keyof typeof PLANS]
    ? (userData.plan as keyof typeof PLANS)
    : "BASIC";

  if (userPending) return <h1>loading</h1>;

  return (
    <div className="py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <FileCards
          files={userData?.files ?? []}
          maxQuestionsPerFile={PLANS[userPlan].QUESTIONSPERFILE}
          userPlan={userPlan}
        />
      </div>
    </div>
  );
};

export default page;
