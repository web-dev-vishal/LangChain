// ============================================================
// FILE: message_placeholder.js
// WHAT IT DOES: Loads past chat history from a file and injects it into a prompt.
// WHY: Instead of hardcoding chat history, you read it from a file and slot it
//      into the prompt using MessagesPlaceholder — like a "slot" in the template.
// ============================================================

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

// __dirname trick for ES modules (gets the current folder path)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Read chat history from a .txt file ---
// Each line should start with "Human:" or "AI:"
// Example line: "Human: What is Python?"
function loadChatHistory(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn("chat_history.txt not found, using empty history.");
    return []; // return empty array if file doesn't exist
  }
  const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
  return lines.map((line) => {
    if (line.startsWith("Human:")) return new HumanMessage(line.replace("Human:", "").trim());
    if (line.startsWith("AI:"))    return new AIMessage(line.replace("AI:", "").trim());
    return null;
  }).filter(Boolean); // remove any null entries
}

// Load the history from file
const historyPath = path.join(__dirname, "chat_history.txt");
const chatHistory = loadChatHistory(historyPath);

console.log(`Loaded ${chatHistory.length} messages from history.`);

// --- Build prompt with a placeholder slot for chat history ---
// MessagesPlaceholder("chat_history") = a slot where history gets inserted
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant. Answer based on the conversation history."],
  new MessagesPlaceholder("chat_history"), // ← history gets plugged in here
  ["human", "{question}"],
]);

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

// Chain: fill prompt → send to AI → get text back
const chain = prompt.pipe(model).pipe(parser);

// Ask a follow-up question that requires the chat history context
const result = await chain.invoke({
  chat_history: chatHistory,
  question: "What was the last topic we discussed?",
});

console.log("\nResponse:", result);
