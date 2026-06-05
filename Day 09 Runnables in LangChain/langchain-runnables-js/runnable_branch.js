/**
 * Day 09 - RunnableBranch
 * Python equivalent: runnable_branch.py
 *
 * Generates a report, then conditionally summarizes ONLY if word count > 300.
 * Demonstrates branching logic inside an LCEL chain.
 */

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

// --- Step 2: Conditional summarization ---
const summaryPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a summarizer."],
  ["human", "Summarize in 2 sentences:\n\n{text}"],
]);

const summaryChain = summaryPrompt.pipe(model).pipe(parser);

// RunnableBranch: if word count > 300, summarize; else pass through
const conditionalChain = new RunnableBranch(
  // [condition, runnable]
  [
    (text) => text.trim().split(/\s+/).length > 300,
    // Summarize long reports
    new RunnableLambda({
      func: async (text) => {
        const summary = await summaryChain.invoke({ text });
        return `[SUMMARIZED (>300 words)]\n\n${summary}`;
      },
    }),
  ],
  // Default: pass through short reports as-is
  new RunnableLambda({
    func: (text) => `[SHORT REPORT — no summary needed]\n\n${text}`,
  })
);

// --- Full pipeline ---
const fullChain = reportChain.pipe(conditionalChain);

const result = await fullChain.invoke({ topic: "the history and future of artificial intelligence" });

console.log("RunnableBranch result:");
console.log(result);
