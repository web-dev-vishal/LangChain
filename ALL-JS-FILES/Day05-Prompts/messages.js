// ============================================================
// FILE: messages.py
// WHAT IT DOES: Has a 3-turn conversation with AI, keeping memory of each reply.
// WHY: Shows how to manually manage conversation history using message types:
//      SystemMessage = AI's instructions
//      HumanMessage  = your message
//      AIMessage     = AI's reply
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

// Start conversation history with a system instruction
const history = [
  new SystemMessage("You are a helpful AI assistant. Be concise."),
];

// --- Turn 1: Ask about machine learning ---
history.push(new HumanMessage("What is machine learning?"));
let response = await model.invoke(history); // send full history to AI
history.push(new AIMessage(response.content)); // save AI reply to history
console.log("AI:", response.content);

// --- Turn 2: AI remembers Turn 1, so can give an example ---
history.push(new HumanMessage("Can you give me a real-world example?"));
response = await model.invoke(history); // history now has 4 messages
history.push(new AIMessage(response.content));
console.log("AI:", response.content);

// --- Turn 3: More follow-up ---
history.push(new HumanMessage("What is the difference between ML and deep learning?"));
response = await model.invoke(history); // history now has 6 messages
history.push(new AIMessage(response.content));
console.log("AI:", response.content);

// Print the entire conversation
console.log("\n--- Full conversation history ---");
history.forEach((msg) => {
  console.log(`[${msg._getType().toUpperCase()}]: ${msg.content}`);
});
