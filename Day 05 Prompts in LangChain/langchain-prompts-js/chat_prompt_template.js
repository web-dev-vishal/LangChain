/**
 * Day 05 - ChatPromptTemplate
 * Python equivalent: chat_prompt_template.py
 *
 * ChatPromptTemplate with system + human messages, multi-variable template.
 * Demonstrates prompt construction only (no LLM invocation).
 */

import "dotenv/config";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a {role} who speaks in a {tone} tone."],
  ["human", "Tell me about {topic} in {language}."],
]);

// Format the prompt — equivalent to .invoke() in Python
const formattedMessages = await chatPrompt.invoke({
  role: "scientist",
  tone: "formal",
  topic: "quantum computing",
  language: "simple English",
});

console.log("Formatted Chat Prompt Messages:");
formattedMessages.messages.forEach((msg) => {
  console.log(`\n[${msg._getType().toUpperCase()}]`);
  console.log(msg.content);
});
