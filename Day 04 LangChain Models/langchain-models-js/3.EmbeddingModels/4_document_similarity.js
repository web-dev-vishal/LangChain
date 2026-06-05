/**
 * Day 04 - Document Similarity using Cosine Similarity
 * Python equivalent: 4_document_similarity.py
 *
 * Full semantic similarity pipeline:
 *   1. Embed all documents
 *   2. Embed the query
 *   3. Compute cosine similarity between query and each doc
 *   4. Return the best match
 *
 * Python used scikit-learn's cosine_similarity — here we implement it manually.
 */

import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";

// --- Cosine similarity (replaces sklearn.metrics.pairwise.cosine_similarity) ---
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (normA === 0 || normB === 0) return 0;
  return dot / (normA * normB);
}

// --- Documents and query ---
const documents = [
  "Paris is the capital of France.",
  "Berlin is the capital of Germany.",
  "Tokyo is the capital of Japan.",
  "The Eiffel Tower is located in Paris.",
  "The Brandenburg Gate is in Berlin.",
];

const query = "What is the capital city of Germany?";

// --- Embed everything ---
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
  dimensions: 512,
});

console.log("Embedding documents...");
const docVectors = await embeddings.embedDocuments(documents);

console.log("Embedding query...");
const queryVector = await embeddings.embedQuery(query);

// --- Compute similarities ---
const similarities = docVectors.map((docVec, i) => ({
  document: documents[i],
  score: cosineSimilarity(queryVector, docVec),
}));

// Sort descending
similarities.sort((a, b) => b.score - a.score);

console.log("\nQuery:", query);
console.log("\nRanked Results:");
similarities.forEach((item, rank) => {
  console.log(`  ${rank + 1}. [${item.score.toFixed(4)}] ${item.document}`);
});

console.log("\nBest Match:", similarities[0].document);
