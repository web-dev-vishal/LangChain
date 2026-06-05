// ============================================================
// FILE: 3_embedding_hf_local.js
// WHAT IT DOES: Converts sentences to numbers using a FREE local model (no API cost).
// WHY: HuggingFace has free embedding models you can run on your own computer.
// NOTE: First run downloads the model. Uses @xenova/transformers library.
// ============================================================

import "dotenv/config";

// Load the transformers library (runs locally)
const { pipeline, env } = await import("@xenova/transformers");

// Where to save the downloaded model files
env.cacheDir = process.env.HF_HOME ?? "./hf_cache";

console.log("Loading all-MiniLM-L6-v2 locally...");

// Load a sentence embedding model
// "feature-extraction" = converts text to numbers (embeddings)
const extractor = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2", // a popular, small, fast embedding model
  { quantized: true } // smaller/faster version
);

const texts = [
  "Paris is the capital of France.",
  "Berlin is the capital of Germany.",
];

// Convert each text to a vector (list of numbers)
for (const text of texts) {
  const output = await extractor(text, {
    pooling: "mean",    // average all word embeddings into one sentence embedding
    normalize: true,    // make the numbers range between -1 and 1
  });
  const vector = Array.from(output.data); // convert to regular JS array
  console.log(`\nText: "${text}"`);
  console.log("  Dimensions:", vector.length); // how many numbers
  console.log("  First 5 values:", vector.slice(0, 5));
}
