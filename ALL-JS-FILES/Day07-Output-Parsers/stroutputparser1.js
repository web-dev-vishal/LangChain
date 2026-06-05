// ============================================================
// FILE: stroutputparser1.js
// WHAT IT DOES: Same 2-step chain as stroutputparser.js but the CLEAN way using pipe().
// WHY: StringOutputParser automatically extracts text, so you can chain steps cleanly.
//      Compare to stroutputparser.js — much less code, same result.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser(); // automatically extracts text from AI response

// --- Step 1 prompt: Write a report ---
const reportPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a technical writer."],
  ["human", "Write a short report (3-4 sentences) about: {topic}"],
]);

// --- Step 2 prompt: Summarize the report ---
const summaryPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a concise summarizer."],
  ["human", "Summarize this in one sentence:\n\n{report}"],
]);

// --- Chain ALL steps together with pipe() ---
// Step 1 output (text) automatically flows into Step 2 input
const fullChain = reportPrompt
  .pipe(model)
  .pipe(parser)                           // ← extracts text string from AI response
  .pipe((reportText) => ({ report: reportText })) // ← wraps string into { report: "..." } for next prompt
  .pipe(summaryPrompt)
  .pipe(model)
  .pipe(parser);                          // ← extracts final text

const result = await fullChain.invoke({ topic: "the impact of AI on healthcare" });

console.log("Final Summary (clean chain):");
console.log(result);
