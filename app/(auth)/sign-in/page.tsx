import { PORT } from "@/app/(pages)/layout";
import { SignInForm } from "@/components/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "signIn - IntellicPDF - Smart AI for Document Conversations",
  description:
    "Chat with your documents using advanced AI. Extract insights, summarize, and interact with your PDFs intelligently.",
  keywords:
    "AI PDF chat, document AI, smart PDF assistant, AI-powered document analysis",
  openGraph: {
    title: "IntellicPDF - Smart AI for Document Conversations",
    description:
      "Engage with your PDFs like never before using AI-powered document conversations.",
    type: "website",
    images: [
      {
        url: "https://intellicpdf.com/og-image.jpg",
        alt: "IntellicPDF Preview",
      },
    ],
  },
  alternates: {
    canonical: `${PORT}/sign-in`,
  },
};

const sign_in = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  );
};

export default sign_in;
