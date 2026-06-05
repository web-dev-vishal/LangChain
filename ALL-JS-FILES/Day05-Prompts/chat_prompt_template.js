// ============================================================
// FILE: chat_prompt_template.js
// WHAT IT DOES: Creates a reusable chat prompt with fill-in-the-blank placeholders.
// WHY: Instead of writing the same prompt over and over, you make a template
//      with {variables} and fill them in later — like a form.
// ============================================================

import "dotenv/config";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Create a chat prompt template with placeholders like {role}, {tone}, etc.
// The system message tells the AI how to behave.
// The human message is what the user asks.
const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a {role} who speaks in a {tone} tone."],
  ["human", "Tell me about {topic} in {language}."],
]);

// Fill in all the placeholders with actual values
const formattedMessages = await chatPrompt.invoke({
  role: "scientist",        // AI will act like a scientist
  tone: "formal",           // AI will speak formally
  topic: "quantum computing", // the subject to explain
  language: "simple English", // explain it simply
});

// Print the filled-in messages
console.log("Formatted Chat Prompt Messages:");
formattedMessages.messages.forEach((msg) => {
  console.log(`\n[${msg._getType().toUpperCase()}]`); // prints [SYSTEM] or [HUMAN]
  console.log(msg.content);
});
