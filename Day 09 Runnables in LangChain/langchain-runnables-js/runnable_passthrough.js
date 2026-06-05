/**
 * Day 09 - RunnablePassthrough
 * Python equivalent: runnable_passthrough.py
 *
 * RunnablePassthrough passes the original input alongside computed output.
 * Use case: keep original joke while also generating an explanation.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel, RunnablePassthrough } from "@langchain/core/runnables";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

// --- Step 1: Generate a joke ---
const jokePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a comedian."],
  ["human", "Tell a short joke about: {topic}"],
]);

const jokeChain = jokePrompt.pipe(model).pipe(parser);

// --- Step 2: Explain the joke (takes the joke as input) ---
const explainPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You explain jokes in a fun way."],
  ["human", "Explain why this joke is funny:\n\n{joke}"],
]);

const explainChain = explainPrompt.pipe(model).pipe(parser);

// --- RunnablePassthrough: pass original input alongside transformed output ---
// First, generate the joke and keep input too
const parallel = new RunnableParallel({
  joke: jokeChain,                // computed: the joke text
  original_input: new RunnablePassthrough(), // pass original input object through
});

// Then explain the joke
const fullChain = parallel.pipe((result) => ({
  joke: result.joke,
})).pipe(explainChain);

// Run it
const jokeResult = await jokeChain.invoke({ topic: "programmers" });
const explanation = await explainChain.invoke({ joke: jokeResult });

console.log("=== Joke ===");
console.log(jokeResult);

console.log("\n=== Explanation ===");
console.log(explanation);
