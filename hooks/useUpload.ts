"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { fileToBase64 } from "@/utils/fileToBase64";
import cloudinaryUpload from "@/utils/cloudinaryUpload";
import { useRouter } from "next/navigation";
import { fileSaveToDB } from "@/actions/file";
import generateEmbedding from "@/actions/generateEmbedding";

export enum statusText {
  CHECKING = "Checking file...",
  UPLOADING = "Uploading to cloud...",
  SAVINGTODB = "Saving File to database...",
  GENERATING = "Generating AI Embedding, This will only take a few seconds...",
}

export type Status = statusText[keyof statusText];

const useUpload = () => {
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);

  const uploadFile = async (file: File) => {
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to upload files.",
      });
      return;
    }

    //!....BASIC or PRO plan action

    if (file.type !== "application/pdf") {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Only PDF files are allowed.",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File size must be less than 10MB.",
      });
      return;
    }

    setUploading(true);
    setTimeout(() => setStatus(statusText.CHECKING), 1000);

    try {
      setStatus(statusText.UPLOADING);
      const baseImage = await fileToBase64(file);
      const { secure_url, uniqueFileName } = await cloudinaryUpload(
        baseImage,
        session.user.id
      );

      setStatus(statusText.SAVINGTODB);

      await fileSaveToDB({
        fileId: uniqueFileName,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: secure_url,
        type: file.type,
      });

      setFileId(uniqueFileName);
      setStatus(statusText.GENERATING);
      console.log("uniqueFileName--------", uniqueFileName);
      generateEmbedding(uniqueFileName);
      return secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Something went wrong. Please try again.",
      });
      setStatus("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, fileId, isPending: uploading, status };
};

export default useUpload;
