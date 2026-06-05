// ============================================================
// FILE: rag_pipeline.js
// WHAT IT DOES: Full RAG pipeline — AI answers questions using a knowledge base.
// WHY: RAG (Retrieval Augmented Generation) stops AI from making things up.
//      Instead of guessing, AI finds real info from your documents, then answers.
// HOW (2 phases):
//   PHASE 1 - INDEXING:   Load text → Split into chunks → Embed → Store in Chroma
//   PHASE 2 - RETRIEVAL:  User asks question → Find relevant chunks → AI answers using them
// ============================================================

import "dotenv/config";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";

// ============================================
// PHASE 1: INDEXING
// ============================================

// Our "knowledge base" — the information we want AI to use when answering
const knowledgeBase = `
LangChain is an open-source framework that simplifies building applications powered by large language models (LLMs). 
It provides modular components like prompts, chains, retrievers, and agents, allowing developers to compose them into powerful pipelines.

LangChain supports multiple LLM providers including OpenAI, Anthropic, Google, HuggingFace, and many others.
The LangChain Expression Language (LCEL) uses a pipe syntax to chain components together declaratively.

Retrieval Augmented Generation (RAG) is a technique that enhances LLM responses by retrieving relevant context 
from a knowledge base before generating an answer. This reduces hallucinations and enables up-to-date information.

The RAG pipeline consists of two main phases:
1. Indexing: Documents are loaded, split into chunks, embedded into vectors, and stored in a vector database.
2. Retrieval and Generation: A user query is embedded, similar chunks are retrieved, and the LLM generates an answer.

Vector stores like Chroma, FAISS, and Pinecone store document embeddings for fast similarity search.
Chroma is a lightweight open-source vector database that runs in-memory or as a persistent server.
FAISS (Facebook AI Similarity Search) is a highly efficient library for vector similarity search.

Text splitters divide long documents into manageable chunks for embedding.
The RecursiveCharacterTextSplitter is the most commonly used splitter in LangChain.
Chunk size and overlap are important parameters that affect retrieval quality.

Embeddings are dense vector representations of text that capture semantic meaning.
OpenAI's text-embedding-3-small and text-embedding-3-large are popular embedding models.
Similar texts have embeddings that are close together in vector space.

LangChain agents use LLMs to reason about which tools to use to accomplish tasks.
The ReAct (Reasoning + Acting) framework is a popular agent architecture.
Agents can use tools like web search, calculators, and code execution.
`;

// Step 1a: Split the knowledge base into small chunks (AI can't process all at once)
console.log("Indexing: Splitting documents...");
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 300,    // max 300 characters per chunk
  chunkOverlap: 50,  // 50 chars repeated between chunks for better context
});
const chunks = await splitter.createDocuments([knowledgeBase]);
console.log(`Created ${chunks.length} chunks.`);

// Step 1b: Convert chunks to embeddings (numbers) and store in Chroma vector database
console.log("Indexing: Embedding and storing in Chroma...");
const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
const vectorStore = await Chroma.fromDocuments(chunks, embeddings, {
  collectionName: "rag-knowledge-base",
});
console.log("Vector store ready.\n");

// ============================================
// PHASE 2: RETRIEVAL + GENERATION
// ============================================

// retriever = the search engine that finds relevant chunks
const retriever = vectorStore.asRetriever({ k: 3 }); // find top 3 matching chunks
const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });
const parser = new StringOutputParser();

// The RAG prompt: tell AI to use ONLY the context (retrieved chunks) to answer
const ragPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful assistant. Answer the question using ONLY the provided context.
If the context doesn't contain enough information, say so.

Context:
{context}`,
  ],
  ["human", "{question}"],
]);

// Helper: join all retrieved chunks into one string
function formatDocs(docs) {
  return docs.map((doc) => doc.pageContent).join("\n\n");
}

// Full RAG chain:
// 1. Retrieve relevant chunks for the question
// 2. Format chunks into context text
// 3. Fill prompt with context + question
// 4. Send to AI
// 5. Extract text answer
const ragChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocs), // retrieve → format as text
    question: new RunnablePassthrough(),  // pass question through unchanged
  },
  ragPrompt,
  model,
  parser,
]);

// ============================================
// ASK QUESTIONS
// ============================================
const questions = [
  "What is LangChain and what does it do?",
  "How does RAG reduce hallucinations?",
  "What is the difference between Chroma and FAISS?",
  "What is LCEL?",
];

for (const question of questions) {
  console.log(`Q: ${question}`);
  const answer = await ragChain.invoke(question);
  console.log(`A: ${answer}`);
  console.log("-".repeat(60));
}
