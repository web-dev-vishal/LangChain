// ============================================================
// FILE: jsonoutputparser.js
// WHAT IT DOES: Makes the AI reply in JSON format and parses it into a JS object.
// WHY: Without a parser, AI returns a messy string. With JsonOutputParser,
//      you get a clean object you can use in your code.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

// JsonOutputParser reads the AI's text and converts it to a JS object
const parser = new JsonOutputParser();

// Tell the AI exactly what JSON format to return
const formatInstructions = `Return ONLY a valid JSON object with these exact keys:
{
  "name": "string (actor name)",
  "birth_year": number,
  "nationality": "string",
  "famous_movies": ["array", "of", "movie titles"],
  "awards": ["array", "of", "award names"]
}
Do not include any explanation — only the JSON object.`;

// Create prompt template with a slot for format instructions
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that returns structured JSON data."],
  ["human", `Answer the query below. {format_instructions}\n\nQuery: {query}`],
]);

// Pre-fill the format_instructions slot so we don't have to pass it every time
const partialPrompt = await prompt.partial({
  format_instructions: formatInstructions,
});

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

// Chain: fill prompt → AI → parse JSON text → JS object
const chain = partialPrompt.pipe(model).pipe(parser);

const result = await chain.invoke({ query: "Tell me about Tom Hanks" });

console.log("JsonOutputParser Result:");
console.log(result);
console.log("\nType:", typeof result);          // "object" (not string anymore!)
console.log("Famous Movies:", result.famous_movies);
