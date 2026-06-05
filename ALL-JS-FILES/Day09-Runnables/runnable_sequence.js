// ============================================================
// FILE: runnable_sequence.js
// WHAT IT DOES: Same as sequential_chain.js but uses RunnableSequence class explicitly.
// WHY: Shows the explicit class behind pipe() chaining — both do the same thing.
//      RunnableSequence.from([...]) = a list of steps to run in order.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

const prompt1 = ChatPromptTemplate.fromMessages([
  ["system", "You are a technical writer."],
  ["human", "Write a 3-sentence report about: {topic}"],
]);

const prompt2 = ChatPromptTemplate.fromMessages([
  ["system", "You are a summarizer."],
  ["human", "Summarize in one sentence:\n\n{report}"],
]);

// Explicit list of steps — runs top to bottom
const chain = RunnableSequence.from([
  prompt1,                              // Step 1: fill in the prompt
  model,                                // Step 2: AI writes the report
  parser,                               // Step 3: extract text
  (report) => ({ report }),            // Step 4: wrap for next prompt
  prompt2,                              // Step 5: fill in summary prompt
  model,                                // Step 6: AI summarizes
  parser,                               // Step 7: extract final text
]);

const result = await chain.invoke({ topic: "transformer neural networks" });

console.log("RunnableSequence result:");
console.log(result);
