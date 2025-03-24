"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";

interface fileDate {
  fileId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  type: string;
}

export const fileSaveToDB = async (fileData: fileDate) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Please sign in to upload files.");

    const file = await prisma.file.create({
      data: {
        ...fileData,
        userId: session?.user.id,
      },
    });
    return file;
  } catch (error: any) {
    throw error;
  }
};
