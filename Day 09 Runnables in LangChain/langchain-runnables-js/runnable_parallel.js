/**
 * Day 09 - RunnableParallel (explicit)
 * Python equivalent: runnable_parallel.py
 *
 * Generates a Tweet AND a LinkedIn post simultaneously from the same topic.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

const tweetPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You write viral tweets. Keep it under 280 characters."],
  ["human", "Write a tweet about: {topic}"],
]);

const linkedinPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You write professional LinkedIn posts. Keep it 2-3 sentences."],
  ["human", "Write a LinkedIn post about: {topic}"],
]);

// Both chains run simultaneously
const parallelChain = new RunnableParallel({
  tweet: tweetPrompt.pipe(model).pipe(parser),
  linkedin: linkedinPrompt.pipe(model).pipe(parser),
});

const result = await parallelChain.invoke({ topic: "the rise of AI coding assistants" });

console.log("=== Tweet ===");
console.log(result.tweet);

console.log("\n=== LinkedIn Post ===");
console.log(result.linkedin);
