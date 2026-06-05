// ============================================================
// FILE: runnable_branch.js
// WHAT IT DOES: Generates a report, then decides whether to summarize it based on word count.
// WHY: RunnableBranch = a decision (if/else) inside a chain.
//      If report > 300 words → summarize it. Otherwise → pass through as-is.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableBranch, RunnableLambda } from "@langchain/core/runnables";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

// --- Step 1: Generate a report ---
const reportPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a research analyst."],
  ["human", "Write a detailed report about: {topic}"],
]);
const reportChain = reportPrompt.pipe(model).pipe(parser);

// --- Step 2: Summarize chain (only used if report is long) ---
const summaryPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a summarizer."],
  ["human", "Summarize in 2 sentences:\n\n{text}"],
]);
const summaryChain = summaryPrompt.pipe(model).pipe(parser);

// --- Conditional branch: if > 300 words, summarize; otherwise keep as-is ---
const conditionalChain = new RunnableBranch(
  [
    // Condition: check if the report has more than 300 words
    (text) => text.trim().split(/\s+/).length > 300,
    // If true → run this: summarize the report
    new RunnableLambda({
      func: async (text) => {
        const summary = await summaryChain.invoke({ text });
        return `[SUMMARIZED (>300 words)]\n\n${summary}`;
      },
    }),
  ],
  // Default (else): report is short, pass through unchanged
  new RunnableLambda({
    func: (text) => `[SHORT REPORT — no summary needed]\n\n${text}`,
  })
);

// Full pipeline: generate report → decide whether to summarize
const fullChain = reportChain.pipe(conditionalChain);

const result = await fullChain.invoke({ topic: "the history and future of artificial intelligence" });

console.log("RunnableBranch result:");
console.log(result);
