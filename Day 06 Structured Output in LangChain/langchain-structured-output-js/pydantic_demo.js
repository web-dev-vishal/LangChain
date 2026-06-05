/**
 * Day 06 - Pydantic Demo → Zod Schema Demo
 * Python equivalent: pydantic_demo.py
 *
 * Python uses Pydantic BaseModel for runtime validation.
 * In JS we use Zod — the closest equivalent with type coercion, Optional fields,
 * field descriptions, and JSON serialization.
 */

import { z } from "zod";

// --- Define schema (equivalent to Pydantic BaseModel) ---
const PersonSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  age: z.number().int().positive("Age must be positive"),
  email: z.string().email("Invalid email").optional(),
  score: z.number().min(0).max(100).default(0),
  is_active: z.boolean().default(true),
});

// --- Valid data ---
const validData = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
  score: 95.5,
};

const person = PersonSchema.parse(validData);
console.log("Valid Person:", person);
console.log("JSON:", JSON.stringify(person, null, 2));

// --- Type coercion (Zod can coerce strings to numbers with z.coerce) ---
const CoercedSchema = z.object({
  name: z.string(),
  age: z.coerce.number(),
  score: z.coerce.number(),
});

const rawData = { name: "Bob", age: "25", score: "88.5" }; // strings
const coerced = CoercedSchema.parse(rawData);
console.log("\nCoerced types:", coerced);
console.log("age type:", typeof coerced.age); // number

// --- Invalid data — shows validation error ---
try {
  PersonSchema.parse({ name: "", age: -5, email: "not-an-email" });
} catch (err) {
  console.log("\nValidation Errors:");
  err.errors.forEach((e) => console.log(`  ${e.path.join(".")}: ${e.message}`));
}

// --- Optional fields ---
const withoutEmail = PersonSchema.parse({ name: "Charlie", age: 22 });
console.log("\nWithout email (optional):", withoutEmail);
