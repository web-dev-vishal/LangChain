/**
 * Day 04 - ChatModel with HuggingFace Inference API (remote)
 * Python equivalent: 4_chatmodel_hf_api.py
 *
 * Uses HuggingFace Inference API — the model runs on HF servers.
 * Requires HUGGINGFACEHUB_API_TOKEN in .env
 */

import "dotenv/config";
import { ChatHuggingFace, HuggingFaceInference } from "@langchain/community/chat_models/huggingface";
import { HumanMessage } from "@langchain/core/messages";

// Step 1: Create the HuggingFace endpoint (LLM wrapper)
const llm = new HuggingFaceInference({
  model: "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
  apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
});

// Step 2: Wrap in ChatHuggingFace for message-based interface
const model = new ChatHuggingFace({ llm });

const result = await model.invoke([new HumanMessage("What is the capital of France?")]);

console.log("HuggingFace API Result:", result.content);
