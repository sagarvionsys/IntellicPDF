"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropZone } from "@/components/DropZone";

function UploadingStatus({ status }: { status: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="font-medium">{status}</p>
    </div>
  );
}

const DropPage = () => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (file: File) => {
    if (file.type !== "application/pdf") return;
    console.log("Uploading file:", file);

    setUploading(true);

    setTimeout(() => {
      setUploading(false);
    }, 5000);
  };

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload PDF</CardTitle>
            <CardDescription>
              Drop your PDF file here or click to select
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploading ? (
              <UploadingStatus status="Uploading file..." />
            ) : (
              <DropZone onFileSelect={handleFileUpload} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DropPage;
