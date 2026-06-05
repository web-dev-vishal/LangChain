// ============================================================
// FILE: 1_llm_demo.js
// WHAT IT DOES: Sends a plain text question to OpenAI and gets a plain text answer.
// WHY: Shows how a basic LLM (text-in, text-out) works in LangChain.
// ============================================================

// Load your API keys from the .env file
import "dotenv/config";

// Import the OpenAI LLM class
import { OpenAI } from "@langchain/openai";

// Create a new LLM — like hiring an AI brain
// model: which OpenAI model to use
// temperature: 0.7 means medium creativity (0 = boring/safe, 2 = very random)
const llm = new OpenAI({
  model: "gpt-3.5-turbo-instruct",
  temperature: 0.7,
});

// This is the question we are asking the AI
const prompt = "What is the capital of France?";

// Send the question to the AI and wait for the answer
const result = await llm.invoke(prompt);

// Print the answer
console.log("LLM Result (string):", result);
