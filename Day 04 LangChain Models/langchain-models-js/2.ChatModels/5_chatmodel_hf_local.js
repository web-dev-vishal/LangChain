/**
 * Day 04 - ChatModel with HuggingFace Locally (via Transformers.js)
 * Python equivalent: 5_chatmodel_hf_local.py
 *
 * In Python: HuggingFacePipeline.from_model_id() runs the model locally.
 * In JS: We use @xenova/transformers (Transformers.js) for local inference.
 *
 * Install extra dep: npm install @xenova/transformers
 * Note: First run downloads the model (~600MB). Set HF_HOME env var to control cache.
 */

import "dotenv/config";

// Set cache directory before importing transformers
process.env.TRANSFORMERS_CACHE = process.env.HF_HOME ?? "./hf_cache";

const { pipeline } = await import("@xenova/transformers");

console.log("Loading TinyLlama locally — first run will download the model...");

const generator = await pipeline(
  "text-generation",
  "Xenova/TinyLlama-1.1B-Chat-v1.0", // Xenova-converted ONNX version
  { quantized: true }
);

const messages = [
  { role: "user", content: "What is the capital of France?" },
];

const result = await generator(messages, {
  max_new_tokens: 64,
  temperature: 0.7,
  do_sample: true,
});

console.log("Local HuggingFace Result:", result[0].generated_text);
