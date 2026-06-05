// ============================================================
// FILE: with_structured_output_json.js
// WHAT IT DOES: Makes the AI return a product review as structured JSON data.
// WHY: Normally AI replies in plain English. withStructuredOutput() forces it
//      to return data in a specific format (like a form) you can use in code.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";

// --- Define the JSON Schema: rules for what the output should look like ---
const reviewSchema = {
  name: "ProductReview",
  description: "Structured extraction of a product review",
  type: "object",
  properties: {
    name: { type: "string", description: "Name of the product being reviewed" },
    summary: { type: "string", description: "One-sentence summary of the review" },
    sentiment: {
      type: "string",
      enum: ["positive", "negative", "neutral", "mixed"], // only these values allowed
      description: "Overall sentiment of the review",
    },
    pros: { type: "array", items: { type: "string" }, description: "List of positive points" },
    cons: { type: "array", items: { type: "string" }, description: "List of negative points" },
    key_themes: { type: "array", items: { type: "string" }, description: "Key themes discussed" },
  },
  required: ["name", "summary", "sentiment", "pros", "cons", "key_themes"],
};

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

// withStructuredOutput() tells the AI: "return your answer in this exact format"
const structuredModel = model.withStructuredOutput(reviewSchema);

// The review text to analyze
const review = `
I recently bought the Sony WH-1000XM5 headphones and I'm blown away by the noise cancellation.
The sound quality is incredible, bass is punchy without being overwhelming, and mids are crystal clear.
Battery life easily lasts 30 hours. The only issue is they feel a bit tight after 2-3 hours.
Build quality feels premium but the ear cushions could be softer. Overall, absolutely worth the price.
`;

// Ask the AI to extract structured info from the review
const result = await structuredModel.invoke(
  `Extract structured information from this product review:\n\n${review}`
);

// result is a clean JavaScript object — not messy text!
console.log("Structured Review Output:");
console.log(JSON.stringify(result, null, 2));
