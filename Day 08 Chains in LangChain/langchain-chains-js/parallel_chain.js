/**
 * Day 08 - Parallel Chain
 * Python equivalent: parallel_chain.py
 *
 * RunnableParallel runs two chains simultaneously:
 *   - Chain A (OpenAI): generates study notes
 *   - Chain B (Anthropic): generates a quiz
 * Then merges them with a third chain into a study pack.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";

const parser = new StringOutputParser();

// --- Chain A: Notes (OpenAI) ---
const notesPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a study notes creator."],
  ["human", "Create 3 bullet-point study notes for: {topic}"],
]);
const notesChain = notesPrompt
  .pipe(new ChatOpenAI({ model: "gpt-4o-mini" }))
  .pipe(parser);

// --- Chain B: Quiz (Anthropic) ---
const quizPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a quiz creator."],
  ["human", "Create 2 multiple-choice quiz questions about: {topic}"],
]);
const quizChain = quizPrompt
  .pipe(new ChatAnthropic({ model: "claude-3-5-sonnet-20241022" }))
  .pipe(parser);

// --- Run both in parallel ---
const parallelChain = new RunnableParallel({
  notes: notesChain,
  quiz: quizChain,
});

// --- Chain C: Merge into a study pack ---
const mergePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a study material editor."],
  [
    "human",
    `Combine these into a clean study pack for {topic}:

NOTES:
{notes}

QUIZ:
{quiz}`,
  ],
]);

const mergeChain = mergePrompt
  .pipe(new ChatOpenAI({ model: "gpt-4o-mini" }))
  .pipe(parser);

// Full chain: parallel → merge
const fullChain = parallelChain.pipe((result) => ({
  topic: "quantum computing",
  notes: result.notes,
  quiz: result.quiz,
})).pipe(mergeChain);

console.log("Running parallel chains...");
const result = await fullChain.invoke({ topic: "quantum computing" });

console.log("\n=== Study Pack ===");
console.log(result);
