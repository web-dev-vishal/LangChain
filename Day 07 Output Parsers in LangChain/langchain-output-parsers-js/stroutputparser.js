/**
 * Day 07 - StrOutputParser — Manual chaining WITHOUT parser
 * Python equivalent: stroutputparser.py
 *
 * Without StrOutputParser: manually pass .content between two chain steps.
 * Step 1: Generate a report → Step 2: Summarize the report
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

// --- Step 1: Generate report ---
const reportPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a technical writer."],
  ["human", "Write a short report (3-4 sentences) about: {topic}"],
]);

const reportMessages = await reportPrompt.invoke({ topic: "the impact of AI on healthcare" });
const reportResponse = await model.invoke(reportMessages);

// Manually extract string content (no parser)
const reportText = reportResponse.content;
console.log("--- Generated Report ---");
console.log(reportText);

// --- Step 2: Summarize the report ---
const summaryPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a concise summarizer."],
  ["human", "Summarize this in one sentence:\n\n{report}"],
]);

const summaryMessages = await summaryPrompt.invoke({ report: reportText });
const summaryResponse = await model.invoke(summaryMessages);

// Manually extract again
const summaryText = summaryResponse.content;
console.log("\n--- Summary ---");
console.log(summaryText);
