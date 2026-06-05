/**
 * Day 04 - Embedding multiple documents with OpenAI
 * Python equivalent: 2_embedding_openai_docs.py
 *
 * embed_documents() → embedDocuments() in JS
 * Returns an array of float arrays (one vector per document).
 */

import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
  dimensions: 32,
});

const documents = [
  "Paris is the capital of France.",
  "Berlin is the capital of Germany.",
  "Tokyo is the capital of Japan.",
  "Delhi is the capital of India.",
];

const vectors = await embeddings.embedDocuments(documents);

console.log("Number of documents:", vectors.length);
console.log("Dimensions per vector:", vectors[0].length);

documents.forEach((doc, i) => {
  console.log(`\nDoc ${i + 1}: "${doc}"`);
  console.log("  Vector (first 5):", vectors[i].slice(0, 5));
});
