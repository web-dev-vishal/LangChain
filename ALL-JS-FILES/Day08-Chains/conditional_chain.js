// ============================================================
// FILE: conditional_chain.js
// WHAT IT DOES: Reads customer feedback, detects if it's positive or negative,
//               then sends a different reply based on the sentiment.
// WHY: Real apps need to route different inputs to different handlers.
//      Positive review → thank-you response. Negative review → apology response.
// FLOW: Feedback → Classify sentiment → Route to correct reply chain
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });
const parser = new StringOutputParser();

// --- Step 1: Classify the feedback as "positive" or "negative" ---
const SentimentSchema = z.object({
  sentiment: z.enum(["positive", "negative"]).describe("Sentiment of the customer feedback"),
});

const classifierModel = model.withStructuredOutput(SentimentSchema);

const classifyPrompt = ChatPromptTemplate.fromMessages([
  ["system", "Classify the sentiment of the customer feedback."],
  ["human", "{feedback}"],
]);

const classifyChain = classifyPrompt.pipe(classifierModel);

// --- Step 2a: Reply for positive feedback ---
const positivePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You handle positive customer feedback. Write a warm thank-you response."],
  ["human", "Feedback: {feedback}"],
]);
const positiveChain = positivePrompt.pipe(model).pipe(parser);

// --- Step 2b: Reply for negative feedback ---
const negativePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You handle negative customer feedback. Write a professional, empathetic resolution response."],
  ["human", "Feedback: {feedback}"],
]);
const negativeChain = negativePrompt.pipe(model).pipe(parser);

// --- Full pipeline: classify first, then route to correct reply ---
async function processFeeback(feedback) {
  console.log("Feedback:", feedback);

  // Step 1: Detect sentiment
  const classification = await classifyChain.invoke({ feedback });
  console.log("Sentiment:", classification.sentiment);

  // Step 2: Based on sentiment, pick the right reply chain
  const response =
    classification.sentiment === "positive"
      ? await positiveChain.invoke({ feedback })   // happy path
      : await negativeChain.invoke({ feedback });  // sad path

  console.log("Response:\n", response);
  return response;
}

// Test with a happy review
await processFeeback("I absolutely love this product! Best purchase I've made this year.");
console.log("\n" + "=".repeat(60) + "\n");

// Test with a complaint
await processFeeback("This is terrible. The product broke after one day and support is useless.");
