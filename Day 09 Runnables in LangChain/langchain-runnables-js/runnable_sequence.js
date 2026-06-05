/**
 * Day 09 - RunnableSequence (explicit)
 * Python equivalent: runnable_sequence.py
 *
 * RunnableSequence is the explicit class behind .pipe() chaining.
 * Same result as sequential_chain.js but uses the class directly.
 */

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

// Explicit RunnableSequence (vs .pipe() shorthand)
const chain = RunnableSequence.from([
  prompt1,
  model,
  parser,
  (report) => ({ report }),
  prompt2,
  model,
  parser,
]);

const result = await chain.invoke({ topic: "transformer neural networks" });

console.log("RunnableSequence result:");
console.log(result);
