// ============================================================
// FILE: 2_embedding_openai_docs.js
// WHAT IT DOES: Converts MULTIPLE sentences into numbers all at once.
// WHY: When you have many documents, you embed them all together (faster).
//      embedQuery = 1 sentence, embedDocuments = many sentences.
// ============================================================

import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
  dimensions: 32, // 32 numbers per sentence (small, just for demo)
});

// A list of 4 documents (sentences)
const documents = [
  "Paris is the capital of France.",
  "Berlin is the capital of Germany.",
  "Tokyo is the capital of Japan.",
  "Delhi is the capital of India.",
];

// Convert ALL documents to numbers in one API call (more efficient)
const vectors = await embeddings.embedDocuments(documents);

// How many documents did we embed?
console.log("Number of documents:", vectors.length);

// How many numbers per document?
console.log("Dimensions per vector:", vectors[0].length);

// Show each document and its first 5 numbers
documents.forEach((doc, i) => {
  console.log(`\nDoc ${i + 1}: "${doc}"`);
  console.log("  Vector (first 5):", vectors[i].slice(0, 5));
});
