// ============================================================
// FILE: 1_embedding_openai_query.js
// WHAT IT DOES: Converts a sentence into a list of numbers (called an "embedding").
// WHY: AI doesn't understand words — it understands numbers.
//      Embeddings let AI compare texts by how similar their numbers are.
// ============================================================

import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";

// Create the embedding model
// dimensions: 32 → make only 32 numbers per sentence (small, just for demo; usually 1536)
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
  dimensions: 32,
});

// Convert this sentence into a list of 32 numbers
const vector = await embeddings.embedQuery("What is the capital of France?");

// Print how many numbers we got (should be 32)
console.log("Embedding dimensions:", vector.length);

// Print just the first 5 numbers to see what they look like
console.log("First 5 values:", vector.slice(0, 5));
