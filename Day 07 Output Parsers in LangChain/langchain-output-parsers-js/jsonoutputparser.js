/**
 * Day 07 - JsonOutputParser
 * Python equivalent: jsonoutputparser.py
 *
 * JsonOutputParser extracts a JSON object from the LLM response.
 * Format instructions are injected into the prompt via partial_variables.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

// JsonOutputParser — parses LLM output as JSON
const parser = new JsonOutputParser();

// Get format instructions (equivalent to parser.get_format_instructions())
const formatInstructions = `Return ONLY a valid JSON object with these exact keys:
{
  "name": "string (actor name)",
  "birth_year": number,
  "nationality": "string",
  "famous_movies": ["array", "of", "movie titles"],
  "awards": ["array", "of", "award names"]
}
Do not include any explanation — only the JSON object.`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that returns structured JSON data."],
  ["human", `Answer the query below. {format_instructions}\n\nQuery: {query}`],
]);

// Inject format instructions as partial variable
const partialPrompt = await prompt.partial({
  format_instructions: formatInstructions,
});

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });
const chain = partialPrompt.pipe(model).pipe(parser);

const result = await chain.invoke({ query: "Tell me about Tom Hanks" });

console.log("JsonOutputParser Result:");
console.log(result);
console.log("\nType:", typeof result); // object (not string)
console.log("Famous Movies:", result.famous_movies);
