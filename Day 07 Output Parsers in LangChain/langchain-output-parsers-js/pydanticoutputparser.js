/**
 * Day 07 - PydanticOutputParser → StructuredOutputParser with Zod
 * Python equivalent: pydanticoutputparser.py
 *
 * Python returns a validated Pydantic Person object.
 * JS equivalent: use model.withStructuredOutput(zodSchema) which returns
 * a validated typed object — the closest JS equivalent to PydanticOutputParser.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// --- Zod schema (equivalent to Pydantic BaseModel Person) ---
const PersonSchema = z.object({
  name: z.string().describe("Full name of the person"),
  age: z.number().int().describe("Age in years"),
  occupation: z.string().describe("Current job or profession"),
  nationality: z.string().describe("Country of citizenship"),
  achievements: z
    .array(z.string())
    .describe("List of notable achievements or contributions"),
});

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

// withStructuredOutput() acts as PydanticOutputParser — returns validated typed object
const structuredModel = model.withStructuredOutput(PersonSchema);

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You extract structured person information."],
  ["human", "Tell me about {person_name}"],
]);

const chain = prompt.pipe(structuredModel);

const result = await chain.invoke({ person_name: "Nikola Tesla" });

// result is typed — equivalent to Python's Pydantic instance
console.log("Person (Zod validated):");
console.log("Name:", result.name);
console.log("Age:", result.age);
console.log("Occupation:", result.occupation);
console.log("Nationality:", result.nationality);
console.log("Achievements:", result.achievements);
