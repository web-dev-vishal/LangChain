// ============================================================
// FILE: 3_chatmodel_google.js
// WHAT IT DOES: Uses Google's Gemini AI model to answer a question.
// WHY: Shows LangChain also works with Google AI (Gemini).
// ============================================================

import "dotenv/config";

// Import Google's Gemini chat model
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

// Create the Gemini model
const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  temperature: 0.7,
});

// Ask a question
const result = await model.invoke([new HumanMessage("What is the capital of France?")]);

// Print the answer
console.log("Google Gemini Result:", result.content);
