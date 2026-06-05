/**
 * Day 12 - Vector Stores with Chroma
 * Python equivalent: langchain_chroma.ipynb
 *
 * Creating Chroma collections, adding documents,
 * and performing similarity search.
 *
 * Requires Chroma server running locally:
 *   docker run -p 8000:8000 chromadb/chroma
 * OR use in-memory ephemeral client (no server needed):
 *   npm install chromadb
 */

import "dotenv/config";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

// --- Sample documents ---
const documents = [
  new Document({
    pageContent: "LangChain is a framework for building applications with large language models.",
    metadata: { source: "langchain-docs", topic: "langchain" },
  }),
  new Document({
    pageContent: "Chroma is an open-source embedding database for AI applications.",
    metadata: { source: "chroma-docs", topic: "vector-db" },
  }),
  new Document({
    pageContent: "OpenAI provides powerful language models like GPT-4 and embeddings APIs.",
    metadata: { source: "openai-docs", topic: "llm" },
  }),
  new Document({
    pageContent: "Vector databases store embeddings and enable fast semantic similarity search.",
    metadata: { source: "ml-docs", topic: "vector-db" },
  }),
  new Document({
    pageContent: "RAG combines retrieval from a knowledge base with LLM generation for accurate answers.",
    metadata: { source: "rag-guide", topic: "rag" },
  }),
  new Document({
    pageContent: "Embeddings are dense vector representations of text that capture semantic meaning.",
    metadata: { source: "ml-docs", topic: "embeddings" },
  }),
];

// --- Create Chroma vector store (in-memory, no server needed) ---
console.log("Creating Chroma vector store...");
const vectorStore = await Chroma.fromDocuments(documents, embeddings, {
  collectionName: "genai-roadmap",
  // To use persistent storage with Chroma server:
  // url: "http://localhost:8000",
});

console.log("Vector store created with", documents.length, "documents.");

// --- Similarity Search ---
const query = "How do vector databases work?";
console.log(`\nSimilarity search for: "${query}"`);
const results = await vectorStore.similaritySearch(query, 3);

results.forEach((doc, i) => {
  console.log(`\n[${i + 1}] ${doc.pageContent}`);
  console.log(`    Source: ${doc.metadata.source}`);
});

// --- Similarity Search with Score ---
console.log("\n--- Similarity Search with Scores ---");
const resultsWithScore = await vectorStore.similaritySearchWithScore(query, 3);
resultsWithScore.forEach(([doc, score], i) => {
  console.log(`\n[${i + 1}] Score: ${score.toFixed(4)}`);
  console.log(`    ${doc.pageContent}`);
});

// --- Metadata Filtering ---
console.log("\n--- Filtered Search (topic: vector-db only) ---");
const filteredResults = await vectorStore.similaritySearch(
  "database",
  3,
  { topic: "vector-db" }
);
filteredResults.forEach((doc, i) => {
  console.log(`\n[${i + 1}] ${doc.pageContent}`);
});
