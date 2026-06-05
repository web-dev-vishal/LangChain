// ============================================================
// FILE: parallel_chain.js
// WHAT IT DOES: Runs 2 chains at the same time (parallel), then merges the results.
// WHY: Instead of waiting for one to finish before starting the other,
//      parallel chains run simultaneously → faster total time.
// FLOW: Topic → [notes chain + quiz chain running at same time] → merge into study pack
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";

const parser = new StringOutputParser();

// --- Chain A: Write study notes (uses OpenAI) ---
const notesPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a study notes creator."],
  ["human", "Create 3 bullet-point study notes for: {topic}"],
]);
const notesChain = notesPrompt
  .pipe(new ChatOpenAI({ model: "gpt-4o-mini" }))
  .pipe(parser);

// --- Chain B: Write quiz questions (uses Anthropic Claude) ---
const quizPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a quiz creator."],
  ["human", "Create 2 multiple-choice quiz questions about: {topic}"],
]);
const quizChain = quizPrompt
  .pipe(new ChatAnthropic({ model: "claude-3-5-sonnet-20241022" }))
  .pipe(parser);

// --- Run both chains at the SAME TIME ---
const parallelChain = new RunnableParallel({
  notes: notesChain,  // result stored as "notes"
  quiz: quizChain,    // result stored as "quiz"
});

// --- Chain C: Combine notes + quiz into a study pack ---
const mergePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a study material editor."],
  ["human", `Combine these into a clean study pack for {topic}:\n\nNOTES:\n{notes}\n\nQUIZ:\n{quiz}`],
]);
const mergeChain = mergePrompt
  .pipe(new ChatOpenAI({ model: "gpt-4o-mini" }))
  .pipe(parser);

// Full chain: run parallel → pass results to merge chain
const fullChain = parallelChain.pipe((result) => ({
  topic: "quantum computing",
  notes: result.notes,
  quiz: result.quiz,
})).pipe(mergeChain);

console.log("Running parallel chains...");
const result = await fullChain.invoke({ topic: "quantum computing" });

console.log("\n=== Study Pack ===");
console.log(result);
