// ============================================================
// FILE: with_structured_output_zod.js
// WHAT IT DOES: Makes AI return structured data, then validates it with Zod.
// WHY: Best of both worlds — AI gives structured output AND Zod validates it.
//      This is the recommended approach in JavaScript LangChain.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

// --- Define what we want the AI to return ---
// Each field has a type AND a description (description helps the AI understand what to fill in)
const ProductReviewSchema = z.object({
  name: z.string().describe("Name of the product being reviewed"),
  summary: z.string().describe("One-sentence summary of the review"),
  sentiment: z
    .enum(["positive", "negative", "neutral", "mixed"])
    .describe("Overall sentiment of the review"),
  pros: z.array(z.string()).describe("List of positive points mentioned"),
  cons: z.array(z.string()).describe("List of negative points mentioned"),
  key_themes: z.array(z.string()).describe("Key themes or topics discussed in the review"),
});

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

// Pass the Zod schema to withStructuredOutput — AI returns validated data
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

// result is now a clean, validated JS object — you can access fields directly
console.log("Structured Output (Zod validated):");
console.log("Product Name:", result.name);
console.log("Sentiment:", result.sentiment);
console.log("Summary:", result.summary);
console.log("Pros:", result.pros);
console.log("Cons:", result.cons);
console.log("Key Themes:", result.key_themes);
