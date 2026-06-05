// ============================================================
// FILE: 1_chatmodel_openai.js
// WHAT IT DOES: Sends a chat message to OpenAI's GPT-4 and gets a reply.
// WHY: Shows how a Chat Model works — you send messages, it replies.
//      This is like WhatsApp but with AI.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";

// HumanMessage = a message from you (the user)
import { HumanMessage } from "@langchain/core/messages";

// Create the chat model — like opening a chat with GPT-4
// maxTokens: 10 → AI will reply with max 10 words (very short, just for demo)
const model = new ChatOpenAI({
  model: "gpt-4",
  temperature: 1.5,
  maxTokens: 10,
});

// Send a message to the AI (wrapped in a list because chat models support multi-turn)
const result = await model.invoke([new HumanMessage("What is the capital of France?")]);

// Print the full result object (has metadata too)
console.log("ChatModel Result:", result);

// Print just the text answer
console.log("Content:", result.content);
