/**
 * Day 08 - Conditional Chain (Sentiment-Based Routing)
 * Python equivalent: conditional_chain.py
 *
 * Flow:
 *   1. Classify feedback sentiment (positive / negative)
 *   2. Route to different response prompts based on sentiment
 *
 * Python used RunnableBranch + PydanticOutputParser.
 * JS equivalent uses RunnableBranch + withStructuredOutput (Zod).
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableBranch, RunnableLambda } from "@langchain/core/runnables";
import { z } from "zod";

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });
const parser = new StringOutputParser();

// --- Step 1: Classify sentiment ---
const SentimentSchema = z.object({
  sentiment: z
    .enum(["positive", "negative"])
    .describe("Sentiment of the customer feedback"),
});

const classifierModel = model.withStructuredOutput(SentimentSchema);

const classifyPrompt = ChatPromptTemplate.fromMessages([
  ["system", "Classify the sentiment of the customer feedback."],
  ["human", "{feedback}"],
]);

const classifyChain = classifyPrompt.pipe(classifierModel);

// --- Step 2a: Positive response ---
const positivePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You handle positive customer feedback. Write a warm thank-you response."],
  ["human", "Feedback: {feedback}"],
]);
const positiveChain = positivePrompt.pipe(model).pipe(parser);

// --- Step 2b: Negative response ---
const negativePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You handle negative customer feedback. Write a professional, empathetic resolution response."],
  ["human", "Feedback: {feedback}"],
]);
const negativeChain = negativePrompt.pipe(model).pipe(parser);

// --- Full conditional chain ---
async function processFeeback(feedback) {
  console.log("Feedback:", feedback);

  // Step 1: Classify
  const classification = await classifyChain.invoke({ feedback });
  console.log("Sentiment:", classification.sentiment);

  // Step 2: Route (equivalent to RunnableBranch)
  const response =
    classification.sentiment === "positive"
      ? await positiveChain.invoke({ feedback })
      : await negativeChain.invoke({ feedback });

  console.log("Response:\n", response);
  return response;
}

// --- Test with different feedback ---
await processFeeback("I absolutely love this product! Best purchase I've made this year.");
console.log("\n" + "=".repeat(60) + "\n");
await processFeeback("This is terrible. The product broke after one day and support is useless.");
