// ============================================================
// FILE: stroutputparser.js
// WHAT IT DOES: 2-step chain WITHOUT using a parser — manually passes text between steps.
// WHY: Shows the "hard way" — you have to manually extract .content between steps.
//      Compare with stroutputparser1.js which does it cleanly with a parser.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

// --- Step 1: Ask AI to write a report ---
const reportPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a technical writer."],
  ["human", "Write a short report (3-4 sentences) about: {topic}"],
]);

// Fill the prompt and send to AI
const reportMessages = await reportPrompt.invoke({ topic: "the impact of AI on healthcare" });
const reportResponse = await model.invoke(reportMessages);

// Manually extract the text from the response (no parser, so we do it ourselves)
const reportText = reportResponse.content;
console.log("--- Generated Report ---");
console.log(reportText);

// --- Step 2: Ask AI to summarize the report ---
const summaryPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a concise summarizer."],
  ["human", "Summarize this in one sentence:\n\n{report}"],
]);

// Pass the report text from Step 1 into Step 2
const summaryMessages = await summaryPrompt.invoke({ report: reportText });
const summaryResponse = await model.invoke(summaryMessages);

// Manually extract text again
const summaryText = summaryResponse.content;
console.log("\n--- Summary ---");
console.log(summaryText);
