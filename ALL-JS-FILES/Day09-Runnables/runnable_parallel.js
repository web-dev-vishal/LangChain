// ============================================================
// FILE: runnable_parallel.js
// WHAT IT DOES: Runs 2 AI tasks at the same time — writes a Tweet AND a LinkedIn post.
// WHY: RunnableParallel saves time by running multiple chains simultaneously.
//      Both posts are about the same topic but for different audiences.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

// Chain 1: Write a short tweet (max 280 characters)
const tweetPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You write viral tweets. Keep it under 280 characters."],
  ["human", "Write a tweet about: {topic}"],
]);

// Chain 2: Write a LinkedIn post (2-3 professional sentences)
const linkedinPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You write professional LinkedIn posts. Keep it 2-3 sentences."],
  ["human", "Write a LinkedIn post about: {topic}"],
]);

// Run BOTH chains at the same time — results come back as { tweet: "...", linkedin: "..." }
const parallelChain = new RunnableParallel({
  tweet: tweetPrompt.pipe(model).pipe(parser),
  linkedin: linkedinPrompt.pipe(model).pipe(parser),
});

const result = await parallelChain.invoke({ topic: "the rise of AI coding assistants" });

console.log("=== Tweet ===");
console.log(result.tweet);

console.log("\n=== LinkedIn Post ===");
console.log(result.linkedin);
