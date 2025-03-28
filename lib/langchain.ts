import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineConeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import getPdfUrl from "@/utils/getPdfUrl";
import prisma from "@/prisma/db";

export const indexName = "intellic-pdf";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o",
  temperature: 1,
  maxTokens: 500,
  configuration: { baseURL: process.env.OPENAI_API_BASE_URL },
});

const getSessionOrThrow = async () => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Please sign in to upload files.");
  return session;
};

const fetchMessageFromDB = async (fileId: string) => {
  const session = await getSessionOrThrow();
  const chats = await prisma.chat.findMany({
    where: {
      userId: session.user.id,
      fileId,
    },
    select: {
      role: true,
      message: true,
      createdAt: true,
    },
  });

  const chatHistory = chats.map((doc) =>
    doc.role === "HUMAN"
      ? new HumanMessage(doc.message)
      : new AIMessage(doc.message)
  );
  console.log(`fetched last ${chatHistory?.length} messages`);
  return chatHistory;
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

  console.log("Downloading PDF...");
  const response = await fetch(getPdfUrl(session.user.id, fileId));
  if (!response.ok) throw new Error("Failed to download file.");

  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });

  console.log("Loading PDF...");
  const loader = new PDFLoader(blob);
  const files = await loader.load();

  console.log("Splitting PDF into chunks...");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 200,
  });
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
    batchSize: 500,
    model: "text-embedding-3-large",
    configuration: { baseURL: process.env.OPENAI_API_BASE_URL },
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

const generateLangChainCompletion = async (fileId: string, input: string) => {
  let pineconeVectorStore;

  pineconeVectorStore = await generateEmbeddingInPineconeVectorStore(fileId);

  if (!pineconeVectorStore) throw new Error("Pinecone vector store");

  const retriever = pineconeVectorStore.asRetriever();

  console.log("fetching the user chat history from DB");
  const chatHistory = await fetchMessageFromDB(fileId);

  console.log("defining a prompt template for ai");

  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory,
    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
  ]);

  console.log("creating a history-aware retriever chain");
  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  console.log("defining a prompt template for answering question");
  const historyAwareRetrieverPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user's question based on the below context:\n\n{context}",
    ],
    ...chatHistory,

    ["user", "{input}"],
  ]);

  console.log("creating a document combining chain");
  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrieverPrompt,
  });

  console.log("creating main retriever chain");
  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyAwareCombineDocsChain,
  });

  console.log("..running the chain with a simple conversation.");

  const reply = await conversationalRetrievalChain.invoke({
    chat_history: chatHistory,
    input,
  });

  return reply.answer;
};

export { model, generateLangChainCompletion };
