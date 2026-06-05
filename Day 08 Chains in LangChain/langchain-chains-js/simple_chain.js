/**
 * Day 08 - Simple LCEL Chain
 * Python equivalent: simple_chain.py
 *
 * Basic chain: prompt | model | parser
 * Also prints ASCII graph visualization.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["human", "Tell me a fun fact about {topic}."],
]);

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });
const parser = new StringOutputParser();

// LCEL chain: .pipe() is the JS equivalent of Python's | operator
const chain = prompt.pipe(model).pipe(parser);

// Visualize the chain graph (equivalent to chain.get_graph().print_ascii())
console.log("Chain Graph:");
const graph = chain.getGraph();
console.log(graph.toString());

// Invoke the chain
const result = await chain.invoke({ topic: "black holes" });
console.log("\nResult:", result);
