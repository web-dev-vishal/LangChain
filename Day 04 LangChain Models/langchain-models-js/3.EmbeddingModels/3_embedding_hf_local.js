/**
 * Day 04 - Local Embeddings with HuggingFace (Transformers.js)
 * Python equivalent: 3_embedding_hf_local.py
 *
 * Python uses: HuggingFaceEmbeddings("sentence-transformers/all-MiniLM-L6-v2")
 * JS uses: @xenova/transformers pipeline for feature-extraction
 *
 * Install: npm install @xenova/transformers
 */

import "dotenv/config";

const { pipeline, env } = await import("@xenova/transformers");

// Control cache directory (equivalent to HF_HOME in Python)
env.cacheDir = process.env.HF_HOME ?? "./hf_cache";

console.log("Loading all-MiniLM-L6-v2 locally...");

const extractor = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2",
  { quantized: true }
);

const texts = [
  "Paris is the capital of France.",
  "Berlin is the capital of Germany.",
];

for (const text of texts) {
  const output = await extractor(text, { pooling: "mean", normalize: true });
  const vector = Array.from(output.data);
  console.log(`\nText: "${text}"`);
  console.log("  Dimensions:", vector.length);
  console.log("  First 5 values:", vector.slice(0, 5));
}
