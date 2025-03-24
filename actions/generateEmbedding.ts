"use server";

import { authOptions } from "@/lib/auth";
import { generateEmbeddingInPineconeVectorStore } from "@/lib/langchain";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

const generateEmbedding = async (fileId: string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Please sign in to upload files.");

    await generateEmbeddingInPineconeVectorStore(fileId);

    revalidatePath("/account");
    return { completed: true };
  } catch (error) {
    throw error;
  }
};

export default generateEmbedding;
