// ============================================================
// FILE: runnable_lambda.js
// WHAT IT DOES: Wraps a plain JavaScript function into a LangChain chain step.
// WHY: RunnableLambda lets you add any custom logic (like word counting)
//      inside a chain — not just AI steps.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda } from "@langchain/core/runnables";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

// --- A plain JavaScript function (your custom logic) ---
function wordCount(text) {
  const count = text.trim().split(/\s+/).length; // split by spaces and count
  return `Word count: ${count}\n\nOriginal text:\n${text}`;
}

// --- Wrap the function so it can be used inside a chain ---
const wordCountRunnable = new RunnableLambda({ func: wordCount });

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a creative writer."],
  ["human", "Write a short paragraph about: {topic}"],
]);

// Chain: AI writes paragraph → parser gets text → wordCount counts words
const chain = prompt.pipe(model).pipe(parser).pipe(wordCountRunnable);

const result = await chain.invoke({ topic: "the future of space exploration" });

console.log("RunnableLambda (word count) result:");
console.log(result);
