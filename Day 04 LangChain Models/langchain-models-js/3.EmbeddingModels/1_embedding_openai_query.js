/**
 * Day 04 - Embedding a single query with OpenAI
 * Python equivalent: 1_embedding_openai_query.py
 *
 * embed_query() → embedQuery() in JS
 * Returns a float array (vector) for a single string.
 */

import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
  dimensions: 32, // reduced for demo
});

const vector = await embeddings.embedQuery("What is the capital of France?");

console.log("Embedding dimensions:", vector.length);
console.log("First 5 values:", vector.slice(0, 5));
