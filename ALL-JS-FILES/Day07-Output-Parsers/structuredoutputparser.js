// ============================================================
// FILE: structuredoutputparser.js
// WHAT IT DOES: Uses StructuredOutputParser to get AI to reply in a specific format.
// WHY: This approach injects format instructions into the prompt itself,
//      then parses the AI's reply into a structured JS object.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

// Define what fields we want the AI to return
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    answer: z.string().describe("Answer to the user's question"),
    source: z.string().describe("Source or basis of the answer"),
    confidence: z.string().describe("Confidence level: high, medium, or low"),
    follow_up_questions: z.array(z.string()).describe("2-3 follow-up questions the user might ask"),
  })
);

// Get the format instructions text (tells AI how to format its reply)
const formatInstructions = parser.getFormatInstructions();

// Build prompt — inject format instructions so AI knows what format to use
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a knowledgeable assistant. {format_instructions}"],
  ["human", "{question}"],
]);

// Pre-fill the format instructions
const partialPrompt = await prompt.partial({ format_instructions: formatInstructions });

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

// Chain: fill prompt → AI → parse output into JS object
const chain = partialPrompt.pipe(model).pipe(parser);

const result = await chain.invoke({
  question: "What is quantum computing?",
});

// result is now a clean object with all 4 fields
console.log("StructuredOutputParser Result:");
console.log("Answer:", result.answer);
console.log("Source:", result.source);
console.log("Confidence:", result.confidence);
console.log("Follow-up Questions:", result.follow_up_questions);
