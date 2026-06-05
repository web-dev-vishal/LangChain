/**
 * Day 07 - StrOutputParser — Clean LCEL chaining WITH parser
 * Python equivalent: stroutputparser1.py
 *
 * With StringOutputParser: chain steps with pipe().
 * No need to manually extract .content — parser handles it.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

// --- Prompt 1: Generate report ---
const reportPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a technical writer."],
  ["human", "Write a short report (3-4 sentences) about: {topic}"],
]);

// --- Prompt 2: Summarize (takes report text as input) ---
const summaryPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a concise summarizer."],
  ["human", "Summarize this in one sentence:\n\n{report}"],
]);

// --- LCEL chain using .pipe() (equivalent to Python's | operator) ---
// Step 1 output (string) flows automatically into Step 2 input
const fullChain = reportPrompt
  .pipe(model)
  .pipe(parser)
  .pipe((reportText) => ({ report: reportText })) // map string → object for next prompt
  .pipe(summaryPrompt)
  .pipe(model)
  .pipe(parser);

const result = await fullChain.invoke({ topic: "the impact of AI on healthcare" });

console.log("Final Summary (clean chain):");
console.log(result);
