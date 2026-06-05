/**
 * Day 05 - Manual multi-turn conversation using Message types
 * Python equivalent: messages.py
 *
 * Uses SystemMessage, HumanMessage, AIMessage directly.
 * Appends the AI response to history to maintain context.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
} from "@langchain/core/messages";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

// Conversation history (acts as memory)
const history = [
  new SystemMessage("You are a helpful AI assistant. Be concise."),
];

// Turn 1
history.push(new HumanMessage("What is machine learning?"));
let response = await model.invoke(history);
history.push(new AIMessage(response.content));
console.log("AI:", response.content);

// Turn 2 — model has context from turn 1
history.push(new HumanMessage("Can you give me a real-world example?"));
response = await model.invoke(history);
history.push(new AIMessage(response.content));
console.log("AI:", response.content);

// Turn 3
history.push(new HumanMessage("What is the difference between ML and deep learning?"));
response = await model.invoke(history);
history.push(new AIMessage(response.content));
console.log("AI:", response.content);

console.log("\n--- Full conversation history ---");
history.forEach((msg) => {
  console.log(`[${msg._getType().toUpperCase()}]: ${msg.content}`);
});
