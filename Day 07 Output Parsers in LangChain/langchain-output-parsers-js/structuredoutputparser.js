/**
 * Day 07 - StructuredOutputParser
 * Python equivalent: structuredoutputparser.py
 *
 * StructuredOutputParser.from_response_schemas() in Python.
 * In JS: use StructuredOutputParser from langchain/output_parsers.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

// Define response schemas using Zod (equivalent to ResponseSchema list in Python)
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    answer: z.string().describe("Answer to the user's question"),
    source: z.string().describe("Source or basis of the answer"),
    confidence: z
      .string()
      .describe("Confidence level: high, medium, or low"),
    follow_up_questions: z
      .array(z.string())
      .describe("2-3 follow-up questions the user might ask"),
  })
);

// Get format instructions to inject into the prompt
const formatInstructions = parser.getFormatInstructions();

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a knowledgeable assistant. {format_instructions}"],
  ["human", "{question}"],
]);

const partialPrompt = await prompt.partial({ format_instructions: formatInstructions });

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });
const chain = partialPrompt.pipe(model).pipe(parser);

const result = await chain.invoke({
  question: "What is quantum computing?",
});

console.log("StructuredOutputParser Result:");
console.log("Answer:", result.answer);
console.log("Source:", result.source);
console.log("Confidence:", result.confidence);
console.log("Follow-up Questions:", result.follow_up_questions);
