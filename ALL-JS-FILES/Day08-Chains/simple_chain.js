// ============================================================
// FILE: simple_chain.js
// WHAT IT DOES: Creates the most basic chain: prompt → model → text output.
// WHY: A "chain" connects steps together. pipe() is like a pipe in plumbing —
//      data flows from one step to the next automatically.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Step 1: Create a prompt template
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["human", "Tell me a fun fact about {topic}."],
]);

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });
const parser = new StringOutputParser(); // extracts plain text from AI response

// Connect the 3 steps with pipe():
// prompt fills in {topic} → model generates reply → parser extracts text
const chain = prompt.pipe(model).pipe(parser);

// Visualize the chain structure (like a diagram)
console.log("Chain Graph:");
const graph = chain.getGraph();
console.log(graph.toString());

// Run the chain — pass in the {topic} variable
const result = await chain.invoke({ topic: "black holes" });
console.log("\nResult:", result);
