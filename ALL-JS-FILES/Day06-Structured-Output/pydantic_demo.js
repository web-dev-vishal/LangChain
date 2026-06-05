// ============================================================
// FILE: pydantic_demo.js
// WHAT IT DOES: Validates data using Zod — makes sure data has correct types/format.
// WHY: When AI gives you data, you want to make sure it's correct.
//      Zod is like a security guard that checks if data matches the rules.
// ============================================================

import { z } from "zod"; // Zod is the JS equivalent of Python's Pydantic

// --- Define the rules for a "Person" object ---
// Each field has a type and optional rules (min length, email format, etc.)
const PersonSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),          // must be a non-empty string
  age: z.number().int().positive("Age must be positive"),   // must be a positive whole number
  email: z.string().email("Invalid email").optional(),      // optional, but must be valid email if provided
  score: z.number().min(0).max(100).default(0),             // 0-100 range, defaults to 0
  is_active: z.boolean().default(true),                     // true/false, defaults to true
});

// --- Test with valid data ---
const validData = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
  score: 95.5,
};

const person = PersonSchema.parse(validData); // parse() validates & returns clean object
console.log("Valid Person:", person);
console.log("JSON:", JSON.stringify(person, null, 2));

// --- Type coercion: Zod can convert "25" (string) → 25 (number) ---
const CoercedSchema = z.object({
  name: z.string(),
  age: z.coerce.number(),   // z.coerce converts strings to numbers automatically
  score: z.coerce.number(),
});

const rawData = { name: "Bob", age: "25", score: "88.5" }; // age is a string here
const coerced = CoercedSchema.parse(rawData);
console.log("\nCoerced types:", coerced);
console.log("age type:", typeof coerced.age); // should print "number", not "string"

// --- Test with invalid data — Zod will throw an error ---
try {
  PersonSchema.parse({ name: "", age: -5, email: "not-an-email" });
} catch (err) {
  console.log("\nValidation Errors:");
  err.errors.forEach((e) => console.log(`  ${e.path.join(".")}: ${e.message}`));
}

// --- Optional field can be omitted ---
const withoutEmail = PersonSchema.parse({ name: "Charlie", age: 22 });
console.log("\nWithout email (optional):", withoutEmail);
