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

// const model = new ChatOpenAI({
//   apiKey: process.env.OPEN_AI_KEY,
//   model: "gpt-4o",
// });

export const indexName = "majestic-acacia";

const nameSpaceExists = async (
  index: Index<RecordMetadata>,
  nameSpace: string
) => {
  if (nameSpace === null) throw new Error("No nameSpace value provided");
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[nameSpace] !== undefined;
};

const generateFile = async (fileId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Please sign in to upload files.");
  const downloadUrl = ` https://res.cloudinary.com/dcdtjkvdv/image/upload/v1742798237/user_${session.user.id}/${fileId}.pdf`;

  const result = await fetch(downloadUrl);
  const data = await result.blob();

  console.log("loading pdf format.......");
  const loader = new PDFLoader(data);
  const files = await loader.load();

  console.log("splitting the pdf into chunks");

  const splitter = new RecursiveCharacterTextSplitter();
  const spiltFile = await splitter.splitDocuments(files);

  console.log(`splitted into ${spiltFile.length} parts`);
  return spiltFile;
};

export const generateEmbeddingInPineconeVectorStore = async (
  fileId: string
) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Please sign in to upload files.");

  let pinConeVectorStore;
  console.log(".....Generating embedding for the split documents");

  const embedding = new OpenAIEmbeddings({ apiKey: process.env.OPEN_AI_KEY });
  const index = await pineConeClient.index(indexName);

  const nameSpaceAlreadyExists = await nameSpaceExists(index, fileId);

  if (nameSpaceAlreadyExists) {
    console.log("emedding already exist , reusing");

    pinConeVectorStore = await PineconeStore.fromExistingIndex(embedding, {
      pineconeIndex: index,
      namespace: fileId,
    });
    return pinConeVectorStore;
  } else {
    const splitFile = await generateFile(fileId);
    console.log("saving embedding into store");
    pinConeVectorStore = await PineconeStore.fromDocuments(
      splitFile,
      embedding,
      {
        pineconeIndex: index,
        namespace: fileId,
      }
    );
    return pinConeVectorStore;
  }
};
