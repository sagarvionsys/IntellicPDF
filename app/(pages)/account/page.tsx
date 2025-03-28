import AccountPage from "@/components/account/Account";
import { Metadata } from "next";
import React from "react";
import { PORT } from "../layout";

export const metadata: Metadata = {
  title: "Account - IntellicPDF - Smart AI for Document Conversations",
  description:
    "Chat with your documents using advanced AI. Extract insights, summarize, and interact with your PDFs intelligently.",
  keywords:
    "AI PDF chat, document AI, smart PDF assistant, AI-powered document analysis",

  alternates: {
    canonical: `${PORT}/account`,
  },
};
const page = () => {
  return <AccountPage />;
};

export default page;
