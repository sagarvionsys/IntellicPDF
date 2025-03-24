"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { fileToBase64 } from "@/utils/fileToBase64";
import cloudinaryUpload from "@/utils/cloudinaryUpload";
import { fileSaveToDB } from "@/actions/file";
import generateEmbedding from "@/actions/generateEmbedding";

export enum StatusText {
  CHECKING = "Checking file...",
  UPLOADING = "Uploading to cloud...",
  SAVING_TO_DB = "Saving file to database...",
  GENERATING = "Generating AI embedding, this will only take a few seconds...",
}

export type Status = StatusText | null;

const useUpload = () => {
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(null);

  const uploadFile = async (file: File) => {
    if (!session?.user?.id) {
      return toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to upload files.",
      });
    }

    // Validate file type and size
    if (file.type !== "application/pdf") {
      return toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Only PDF files are allowed.",
      });
    }

    if (file.size > 10 * 1024 * 1024) {
      return toast({
        variant: "destructive",
        title: "File too large",
        description: "File size must be less than 10MB.",
      });
    }

    try {
      setUploading(true);
      setStatus(StatusText.UPLOADING);

      const baseImage = await fileToBase64(file);
      const { secure_url, uniqueFileName } = await cloudinaryUpload(
        baseImage,
        session.user.id
      );

      setStatus(StatusText.SAVING_TO_DB);
      await fileSaveToDB({
        fileId: uniqueFileName,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: secure_url,
        type: file.type,
      });

      setFileId(uniqueFileName);
      setStatus(StatusText.GENERATING);

      await generateEmbedding(uniqueFileName);

      return secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setUploading(false);
      setStatus(null);
    }
  };

  return { uploadFile, fileId, isPending: uploading, status };
};

export default useUpload;
