// ============================================================
// FILE: runnable_passthrough.js
// WHAT IT DOES: Passes the original input through unchanged, alongside new output.
// WHY: Sometimes you want BOTH the original input AND the transformed output.
//      RunnablePassthrough = "let this value go through as-is, don't change it".
// EXAMPLE: Generate a joke, then also keep the original topic alongside the joke.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel, RunnablePassthrough } from "@langchain/core/runnables";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

// --- Step 1: Generate a joke ---
const jokePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a comedian."],
  ["human", "Tell a short joke about: {topic}"],
]);
const jokeChain = jokePrompt.pipe(model).pipe(parser);

// --- Step 2: Explain the joke ---
const explainPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You explain jokes in a fun way."],
  ["human", "Explain why this joke is funny:\n\n{joke}"],
]);
const explainChain = explainPrompt.pipe(model).pipe(parser);

// Run joke chain first, then explain it
const jokeResult = await jokeChain.invoke({ topic: "programmers" });
const explanation = await explainChain.invoke({ joke: jokeResult });

console.log("=== Joke ===");
console.log(jokeResult);

console.log("\n=== Explanation ===");
console.log(explanation);
// RunnablePassthrough would carry original input alongside, useful in complex pipelines
