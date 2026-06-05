/**
 * Day 08 - Sequential Chain
 * Python equivalent: sequential_chain.py
 *
 * Two-step LCEL chain:
 *   Step 1: Generate a report on a topic
 *   Step 2: Summarize the report
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

// --- Step 1: Report generation ---
const reportPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a research analyst. Write detailed but concise reports."],
  ["human", "Write a 3-4 sentence report on: {topic}"],
]);

// --- Step 2: Summarization ---
const summaryPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are an expert summarizer."],
  ["human", "Summarize the following report in ONE sentence:\n\n{report}"],
]);

// Sequential chain: output of step 1 becomes input to step 2
const sequentialChain = reportPrompt
  .pipe(model)
  .pipe(parser)
  .pipe((report) => ({ report }))   // map string → { report: "..." } for next prompt
  .pipe(summaryPrompt)
  .pipe(model)
  .pipe(parser);

const result = await sequentialChain.invoke({ topic: "the James Webb Space Telescope" });

console.log("Final Summary:");
console.log(result);
