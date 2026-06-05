// ============================================================
// FILE: langchain_chroma.js
// WHAT IT DOES: Stores documents in a vector database (Chroma) and searches them.
// WHY: A vector database stores document embeddings (numbers) so you can find
//      the most similar documents to any query — this powers semantic search & RAG.
// HOW:
//   1. Convert documents to embeddings (numbers)
//   2. Store them in Chroma (vector database)
//   3. Search for documents similar to your query
// ============================================================

import "dotenv/config";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

// Create the embedding model (converts text to numbers)
const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

// --- Create 6 sample documents ---
// Each document has content + metadata (like tags)
const documents = [
  new Document({ pageContent: "LangChain is a framework for building applications with large language models.", metadata: { source: "langchain-docs", topic: "langchain" } }),
  new Document({ pageContent: "Chroma is an open-source embedding database for AI applications.", metadata: { source: "chroma-docs", topic: "vector-db" } }),
  new Document({ pageContent: "OpenAI provides powerful language models like GPT-4 and embeddings APIs.", metadata: { source: "openai-docs", topic: "llm" } }),
  new Document({ pageContent: "Vector databases store embeddings and enable fast semantic similarity search.", metadata: { source: "ml-docs", topic: "vector-db" } }),
  new Document({ pageContent: "RAG combines retrieval from a knowledge base with LLM generation for accurate answers.", metadata: { source: "rag-guide", topic: "rag" } }),
  new Document({ pageContent: "Embeddings are dense vector representations of text that capture semantic meaning.", metadata: { source: "ml-docs", topic: "embeddings" } }),
];

// --- Build the vector store: embed all documents and store them ---
console.log("Creating Chroma vector store...");
const vectorStore = await Chroma.fromDocuments(documents, embeddings, {
  collectionName: "genai-roadmap", // name for this collection of documents
});

console.log("Vector store created with", documents.length, "documents.");

// --- Search: find documents most similar to a query ---
const query = "How do vector databases work?";
console.log(`\nSimilarity search for: "${query}"`);
const results = await vectorStore.similaritySearch(query, 3); // top 3 matches

results.forEach((doc, i) => {
  console.log(`\n[${i + 1}] ${doc.pageContent}`);
  console.log(`    Source: ${doc.metadata.source}`);
});

// --- Search with similarity score (lower score = more similar in some implementations) ---
console.log("\n--- Similarity Search with Scores ---");
const resultsWithScore = await vectorStore.similaritySearchWithScore(query, 3);
resultsWithScore.forEach(([doc, score], i) => {
  console.log(`\n[${i + 1}] Score: ${score.toFixed(4)}`);
  console.log(`    ${doc.pageContent}`);
});

// --- Filtered search: only return documents with topic = "vector-db" ---
console.log("\n--- Filtered Search (topic: vector-db only) ---");
const filteredResults = await vectorStore.similaritySearch("database", 3, { topic: "vector-db" });
filteredResults.forEach((doc, i) => {
  console.log(`\n[${i + 1}] ${doc.pageContent}`);
});
