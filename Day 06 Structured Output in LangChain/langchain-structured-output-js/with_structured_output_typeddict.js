/**
 * Day 06 - Structured Output using TypedDict-style (plain JSON Schema)
 * Python equivalent: with_structured_output_typeddict.py
 *
 * Python's TypedDict + Annotated field descriptions.
 * In JS: plain JSON Schema object (access result via object keys).
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";

// Plain object schema — equivalent to TypedDict + Annotated in Python
const schema = {
  title: "ProductReview",
  type: "object",
  properties: {
    name: { type: "string", description: "Product name" },
    summary: { type: "string", description: "Brief summary" },
    sentiment: { type: "string", description: "positive | negative | neutral | mixed" },
    pros: { type: "array", items: { type: "string" }, description: "Positives" },
    cons: { type: "array", items: { type: "string" }, description: "Negatives" },
    key_themes: { type: "array", items: { type: "string" }, description: "Main themes" },
  },
  required: ["name", "summary", "sentiment", "pros", "cons", "key_themes"],
};

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });
const structuredModel = model.withStructuredOutput(schema);

const review = `
I recently bought the Sony WH-1000XM5 headphones and I'm blown away by the noise cancellation.
The sound quality is incredible, battery life easily lasts 30 hours.
The only issue is they feel a bit tight after 2-3 hours. Overall, worth the price.
`;

const result = await structuredModel.invoke(
  `Extract structured information:\n\n${review}`
);

// Access like a plain dict (same as TypedDict in Python)
console.log("TypedDict-style access:");
console.log("name:", result["name"]);
console.log("sentiment:", result["sentiment"]);
console.log("pros:", result["pros"]);
console.log("\nFull result:", result);
