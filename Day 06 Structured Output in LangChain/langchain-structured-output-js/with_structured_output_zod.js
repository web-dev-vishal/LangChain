/**
 * Day 06 - Structured Output using Zod Schema
 * Python equivalent: with_structured_output_pydantic.py
 *
 * Python uses Pydantic BaseModel. In JS we use Zod — the direct equivalent.
 * model.withStructuredOutput(zodSchema) returns a typed, validated object.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

// --- Zod schema (equivalent to Pydantic BaseModel in Python) ---
const ProductReviewSchema = z.object({
  name: z.string().describe("Name of the product being reviewed"),
  summary: z.string().describe("One-sentence summary of the review"),
  sentiment: z
    .enum(["positive", "negative", "neutral", "mixed"])
    .describe("Overall sentiment of the review"),
  pros: z.array(z.string()).describe("List of positive points mentioned"),
  cons: z.array(z.string()).describe("List of negative points mentioned"),
  key_themes: z
    .array(z.string())
    .describe("Key themes or topics discussed in the review"),
});

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

// Bind Zod schema — returns validated typed object
const structuredModel = model.withStructuredOutput(ProductReviewSchema);

const review = `
I recently bought the Sony WH-1000XM5 headphones and I'm blown away by the noise cancellation.
The sound quality is incredible, bass is punchy without being overwhelming, and mids are crystal clear.
Battery life easily lasts 30 hours. The only issue is they feel a bit tight after 2-3 hours.
Build quality feels premium but the ear cushions could be softer. Overall, absolutely worth the price.
`;

const result = await structuredModel.invoke(
  `Extract structured information from this product review:\n\n${review}`
);

// result is a fully typed, validated object
console.log("Structured Output (Zod validated):");
console.log("Product Name:", result.name);
console.log("Sentiment:", result.sentiment);
console.log("Summary:", result.summary);
console.log("Pros:", result.pros);
console.log("Cons:", result.cons);
console.log("Key Themes:", result.key_themes);
