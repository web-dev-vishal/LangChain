// ============================================================
// FILE: sequential_chain.js
// WHAT IT DOES: 2-step chain — first writes a report, then summarizes it.
// WHY: Shows how to pass the output of one AI step as the input to the next step.
//      Step 1 → Step 2 in a sequence (like an assembly line).
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

// --- Step 1 prompt: Write a report ---
const reportPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a research analyst. Write detailed but concise reports."],
  ["human", "Write a 3-4 sentence report on: {topic}"],
]);

// --- Step 2 prompt: Summarize the report ---
const summaryPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are an expert summarizer."],
  ["human", "Summarize the following report in ONE sentence:\n\n{report}"],
]);

// --- Sequential chain: output of step 1 flows into step 2 ---
// The .pipe((report) => ({ report })) part converts the string output to
// an object like { report: "..." } so the next prompt can use it as {report}
const sequentialChain = reportPrompt
  .pipe(model)
  .pipe(parser)
  .pipe((report) => ({ report }))    // wrap string in object for next prompt
  .pipe(summaryPrompt)
  .pipe(model)
  .pipe(parser);

const result = await sequentialChain.invoke({ topic: "the James Webb Space Telescope" });

console.log("Final Summary:");
console.log(result);
