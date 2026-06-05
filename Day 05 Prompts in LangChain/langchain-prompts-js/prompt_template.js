/**
 * Day 05 - PromptTemplate
 * Python equivalent: prompt_template.py
 *
 * PromptTemplate with input_variables, .invoke() to fill placeholders,
 * then passes to ChatOpenAI.
 */

import "dotenv/config";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Create a prompt template with placeholders
const template = PromptTemplate.fromTemplate(
  "You are a helpful assistant. Answer the following question about {topic}.\n\nQuestion: {question}"
);

// Fill in the template (equivalent to .invoke() in Python)
const formattedPrompt = await template.invoke({
  topic: "astronomy",
  question: "What is a black hole?",
});

console.log("Formatted Prompt:");
console.log(formattedPrompt.toString());

// Chain with ChatOpenAI
const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

const chain = template.pipe(model).pipe(parser);

const result = await chain.invoke({
  topic: "astronomy",
  question: "What is a black hole?",
});

console.log("\nLLM Response:", result);
