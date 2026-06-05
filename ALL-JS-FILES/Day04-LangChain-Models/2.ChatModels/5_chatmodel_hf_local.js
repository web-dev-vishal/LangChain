// ============================================================
// FILE: 5_chatmodel_hf_local.js
// WHAT IT DOES: Downloads and runs an AI model on YOUR computer (no API needed).
// WHY: Shows how to run AI completely offline on your own machine.
// NOTE: First run will download ~600MB. Set HF_HOME env var to choose download folder.
// ============================================================

import "dotenv/config";

// Tell the system where to save downloaded models
process.env.TRANSFORMERS_CACHE = process.env.HF_HOME ?? "./hf_cache";

// Dynamically import the transformers library (runs locally on your CPU/GPU)
const { pipeline } = await import("@xenova/transformers");

console.log("Loading TinyLlama locally — first run will download the model...");

// Download and load the model onto your computer
// "text-generation" = this model can write text
const generator = await pipeline(
  "text-generation",
  "Xenova/TinyLlama-1.1B-Chat-v1.0", // ONNX version for browsers/Node
  { quantized: true } // smaller file size = faster download
);

// The conversation — just one message from the user
const messages = [
  { role: "user", content: "What is the capital of France?" },
];

// Run the model on your machine and get a reply
const result = await generator(messages, {
  max_new_tokens: 64,  // max words to generate
  temperature: 0.7,    // creativity level
  do_sample: true,     // use random sampling for more natural replies
});

// Print the generated text
console.log("Local HuggingFace Result:", result[0].generated_text);
