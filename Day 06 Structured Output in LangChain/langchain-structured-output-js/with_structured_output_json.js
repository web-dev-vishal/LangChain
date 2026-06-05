/**
 * Day 06 - Structured Output using JSON Schema
 * Python equivalent: with_structured_output_json.py
 *
 * model.with_structured_output(json_schema) — same API in JS.
 * Extracts structured data from a product review.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";

// --- JSON Schema (same as json_schema.json in Python version) ---
const reviewSchema = {
  name: "ProductReview",
  description: "Structured extraction of a product review",
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Name of the product being reviewed",
    },
    summary: {
      type: "string",
      description: "One-sentence summary of the review",
    },
    sentiment: {
      type: "string",
      enum: ["positive", "negative", "neutral", "mixed"],
      description: "Overall sentiment of the review",
    },
    pros: {
      type: "array",
      items: { type: "string" },
      description: "List of positive points mentioned",
    },
    cons: {
      type: "array",
      items: { type: "string" },
      description: "List of negative points mentioned",
    },
    key_themes: {
      type: "array",
      items: { type: "string" },
      description: "Key themes or topics discussed in the review",
    },
  },
  required: ["name", "summary", "sentiment", "pros", "cons", "key_themes"],
};

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

// Bind structured output schema
const structuredModel = model.withStructuredOutput(reviewSchema);

const review = `
I recently bought the Sony WH-1000XM5 headphones and I'm blown away by the noise cancellation.
The sound quality is incredible, bass is punchy without being overwhelming, and mids are crystal clear.
Battery life easily lasts 30 hours. The only issue is they feel a bit tight after 2-3 hours.
Build quality feels premium but the ear cushions could be softer. Overall, absolutely worth the price.
`;

const result = await structuredModel.invoke(
  `Extract structured information from this product review:\n\n${review}`
);

console.log("Structured Review Output:");
console.log(JSON.stringify(result, null, 2));
