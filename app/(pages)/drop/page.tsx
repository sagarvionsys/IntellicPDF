"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropZone } from "@/components/DropZone";
import useUpload from "@/hooks/useUpload";
import { useRouter } from "next/navigation";

function UploadingStatus({ status }: { status: string | null }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="font-medium">{status}</p>
    </div>
  );
}

const DropPage = () => {
  const router = useRouter();
  const { uploadFile, isPending, status, fileId } = useUpload();

  useEffect(() => {
    if (fileId) return router.push(`pdf/${fileId}`);
  }, [router, fileId]);

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="space-y-4">
            {isPending ? (
              <UploadingStatus status={status as string} />
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Upload PDF</CardTitle>
                  <CardDescription>
                    Drop your PDF file here or click to select
                  </CardDescription>
                </CardHeader>
                <DropZone onFileSelect={(file: File) => uploadFile(file)} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DropPage;
