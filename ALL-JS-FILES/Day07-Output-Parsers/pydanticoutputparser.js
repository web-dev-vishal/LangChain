// ============================================================
// FILE: pydanticoutputparser.js
// WHAT IT DOES: Makes AI return info about a person in a validated structured format.
// WHY: In Python this uses PydanticOutputParser. In JS we use Zod + withStructuredOutput.
//      Result is a validated object where you know exactly what fields exist.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// Define the "Person" schema — like a form with fields
const PersonSchema = z.object({
  name: z.string().describe("Full name of the person"),
  age: z.number().int().describe("Age in years"),
  occupation: z.string().describe("Current job or profession"),
  nationality: z.string().describe("Country of citizenship"),
  achievements: z.array(z.string()).describe("List of notable achievements or contributions"),
});

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

// withStructuredOutput forces AI to fill in the Person form
const structuredModel = model.withStructuredOutput(PersonSchema);

// Prompt template — {person_name} is the fill-in blank
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You extract structured person information."],
  ["human", "Tell me about {person_name}"],
]);

// Chain: fill name → AI returns structured Person object
const chain = prompt.pipe(structuredModel);

const result = await chain.invoke({ person_name: "Nikola Tesla" });

// result is a validated object — all fields guaranteed to exist
console.log("Person (Zod validated):");
console.log("Name:", result.name);
console.log("Age:", result.age);
console.log("Occupation:", result.occupation);
console.log("Nationality:", result.nationality);
console.log("Achievements:", result.achievements);
