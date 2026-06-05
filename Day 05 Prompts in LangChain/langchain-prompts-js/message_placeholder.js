/**
 * Day 05 - MessagesPlaceholder for dynamic chat history injection
 * Python equivalent: message_placeholder.py
 *
 * Loads chat history from a file and injects it into the prompt
 * using MessagesPlaceholder.
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Load chat history from file ---
// Expected format per line: "Human: <text>" or "AI: <text>"
function loadChatHistory(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn("chat_history.txt not found, using empty history.");
    return [];
  }
  const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
  return lines.map((line) => {
    if (line.startsWith("Human:")) return new HumanMessage(line.replace("Human:", "").trim());
    if (line.startsWith("AI:")) return new AIMessage(line.replace("AI:", "").trim());
    return null;
  }).filter(Boolean);
}

const historyPath = path.join(__dirname, "chat_history.txt");
const chatHistory = loadChatHistory(historyPath);

console.log(`Loaded ${chatHistory.length} messages from history.`);

// --- Build prompt with MessagesPlaceholder ---
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant. Answer based on the conversation history."],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

const chain = prompt.pipe(model).pipe(parser);

const result = await chain.invoke({
  chat_history: chatHistory,
  question: "What was the last topic we discussed?",
});

console.log("\nResponse:", result);
