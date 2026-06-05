/**
 * Day 04 - ChatModel with Google Gemini
 * Python equivalent: 3_chatmodel_google.py
 */

import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  temperature: 0.7,
});

const result = await model.invoke([new HumanMessage("What is the capital of France?")]);

console.log("Google Gemini Result:", result.content);
