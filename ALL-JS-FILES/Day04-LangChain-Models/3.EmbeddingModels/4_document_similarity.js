// ============================================================
// FILE: 4_document_similarity.js
// WHAT IT DOES: Finds which document is most similar to your question.
// WHY: This is the core idea behind search engines and chatbots that find
//      relevant information — compare your question to stored documents.
// HOW:
//   1. Convert all documents to numbers (embeddings)
//   2. Convert your question to numbers
//   3. Measure how "close" the numbers are (cosine similarity)
//   4. The closest document is the best match
// ============================================================

import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";

// --- Cosine Similarity: measures how similar two vectors are ---
// Score of 1 = identical, 0 = unrelated, -1 = opposite meaning
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (normA === 0 || normB === 0) return 0;
  return dot / (normA * normB);
}

// Our "knowledge base" — 5 documents stored
const documents = [
  "Paris is the capital of France.",
  "Berlin is the capital of Germany.",
  "Tokyo is the capital of Japan.",
  "The Eiffel Tower is located in Paris.",
  "The Brandenburg Gate is in Berlin.",
];

// The user's question
const query = "What is the capital city of Germany?";

// Create embedding model
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
  dimensions: 512, // more dimensions = more accurate similarity
});

// Step 1: Convert all documents to numbers
console.log("Embedding documents...");
const docVectors = await embeddings.embedDocuments(documents);

// Step 2: Convert the question to numbers
console.log("Embedding query...");
const queryVector = await embeddings.embedQuery(query);

// Step 3: Compare the question to each document
const similarities = docVectors.map((docVec, i) => ({
  document: documents[i],
  score: cosineSimilarity(queryVector, docVec), // higher = more similar
}));

// Sort from most similar to least similar
similarities.sort((a, b) => b.score - a.score);

// Step 4: Show results ranked by similarity
console.log("\nQuery:", query);
console.log("\nRanked Results:");
similarities.forEach((item, rank) => {
  console.log(`  ${rank + 1}. [${item.score.toFixed(4)}] ${item.document}`);
});

// The top result is the best answer!
console.log("\nBest Match:", similarities[0].document);
