// ============================================================
// FILE: 4_chatmodel_hf_api.js
// WHAT IT DOES: Uses a free AI model from HuggingFace (runs on their servers).
// WHY: HuggingFace has thousands of free models — this shows how to use them via API.
// NOTE: You need HUGGINGFACEHUB_API_TOKEN in your .env file.
// ============================================================

import "dotenv/config";

// Import HuggingFace classes from LangChain
import { ChatHuggingFace, HuggingFaceInference } from "@langchain/community/chat_models/huggingface";
import { HumanMessage } from "@langchain/core/messages";

// Step 1: Create a connection to HuggingFace's API
// This says: "use TinyLlama model on HuggingFace's servers"
const llm = new HuggingFaceInference({
  model: "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
  apiKey: process.env.HUGGINGFACEHUB_API_TOKEN, // your HF token from .env
});

// Step 2: Wrap it in ChatHuggingFace so we can send chat messages to it
const model = new ChatHuggingFace({ llm });

// Ask a question
const result = await model.invoke([new HumanMessage("What is the capital of France?")]);

// Print the answer
console.log("HuggingFace API Result:", result.content);
