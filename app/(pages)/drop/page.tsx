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
import { fileToBase64 } from "@/utils/fileToBase64";
import cloudinaryUpload from "@/utils/cloudinaryUpload";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

function UploadingStatus({ status }: { status: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="font-medium">{status}</p>
    </div>
  );
}

const DropPage = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploading(true);

    try {
      console.log("image is selected");
      if (file.type !== "application/pdf") return;

      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Uh oh! Large file not allowed.",
          description: "File size must be less than 10MB.",
        });

        return;
      }

      const baseImage = await fileToBase64(file);
      const { secure_url } = await cloudinaryUpload(baseImage, userId);

      console.log(secure_url);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
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
