import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
// import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { createRetrievalChain } from "langchain/chains/retrieval";
// import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
// import { HumanMessage, AIMessage } from "@langchain/core/messages";
// import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import pineConeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export const indexName = "majestic-acacia";

const getSessionOrThrow = async () => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Please sign in to upload files.");
  return session;
};

const nameSpaceExists = async (
  index: Index<RecordMetadata>,
  nameSpace: string
) => {
  if (!nameSpace) throw new Error("No nameSpace value provided");
  const { namespaces } = await index.describeIndexStats();
  return Boolean(namespaces?.[nameSpace]);
};

const generateFile = async (fileId: string) => {
  const session = await getSessionOrThrow();
  const downloadUrl = `https://res.cloudinary.com/dcdtjkvdv/image/upload/v1742798237/user_${session.user.id}/${fileId}.pdf`;

  console.log("Downloading PDF...");
  const response = await fetch(downloadUrl);
  if (!response.ok) throw new Error("Failed to download file.");

  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });

  console.log("Loading PDF...");
  const loader = new PDFLoader(blob);
  const files = await loader.load();

  console.log("Splitting PDF into chunks...");
  const splitter = new RecursiveCharacterTextSplitter();
  const splitFile = await splitter.splitDocuments(files);

  console.log(`Split into ${splitFile.length} parts`);
  return splitFile;
};

export const generateEmbeddingInPineconeVectorStore = async (
  fileId: string
) => {
  await getSessionOrThrow();

  console.log("Initializing Pinecone index...");
  const index = await pineConeClient.index(indexName);

  const embedding = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    batchSize: 100,
    model: "text-embedding-3-large",
  });

  if (await nameSpaceExists(index, fileId)) {
    console.log("Embedding already exists, reusing...");
    return PineconeStore.fromExistingIndex(embedding, {
      pineconeIndex: index,
      namespace: fileId,
    });
  }

  console.log("Generating new embeddings...");
  const splitFile = await generateFile(fileId);
  console.log("Saving embeddings into Pinecone...");

  return PineconeStore.fromDocuments(splitFile, embedding, {
    pineconeIndex: index,
    namespace: fileId,
  });
};
