/**
 * Day 09 - RunnableLambda
 * Python equivalent: runnable_lambda.py
 *
 * RunnableLambda wraps a plain function into the LCEL pipeline.
 * Use case: word count step inside a chain.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda } from "@langchain/core/runnables";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

// --- Plain function (equivalent to Python lambda/function) ---
function wordCount(text) {
  const count = text.trim().split(/\s+/).length;
  return `Word count: ${count}\n\nOriginal text:\n${text}`;
}

// --- Wrap it in RunnableLambda ---
const wordCountRunnable = new RunnableLambda({ func: wordCount });

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a creative writer."],
  ["human", "Write a short paragraph about: {topic}"],
]);

// Chain: prompt → model → parser → wordCount (lambda)
const chain = prompt.pipe(model).pipe(parser).pipe(wordCountRunnable);

const result = await chain.invoke({ topic: "the future of space exploration" });

console.log("RunnableLambda (word count) result:");
console.log(result);
