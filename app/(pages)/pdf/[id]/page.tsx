"use client";

import PdfChats from "@/components/PdfChats";
import PdfHeader from "@/components/PdfHeader";
import PdfPreview from "@/components/PdfPreview";
import getPdfUrl from "@/utils/getPdfUrl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") return "loading";
  if (!session?.user) return router.push("/sign-in");

  const pdfUrl = getPdfUrl(session?.user.id, id);

  return (
    <div className="w-full h-full overflow-hidden my-3 rounded-lg">
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border overflow-hidden">
          <PdfHeader />
          <div className="grid grid-cols-1 md:grid-cols-2 h-[500px] overflow-hidden">
            <PdfPreview pdfUrl={pdfUrl} />
            <PdfChats />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
