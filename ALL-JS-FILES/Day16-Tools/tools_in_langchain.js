// ============================================================
// FILE: tools_in_langchain.js
// WHAT IT DOES: Shows 4 different ways to create and use "tools" in LangChain.
// WHY: Tools are functions the AI can call to do real things —
//      like searching the web, calculating math, or converting currencies.
//      Without tools, AI can only talk. With tools, AI can ACT.
// ============================================================

import "dotenv/config";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { Calculator } from "@langchain/community/tools/calculator";
import { DynamicTool, DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

// =============================================
// 1. Built-in Tools — ready to use out of the box
// =============================================
console.log("=== 1. Built-in Tools ===\n");

// DuckDuckGo search — no API key needed, searches the web
const searchTool = new DuckDuckGoSearch({ maxResults: 3 });
console.log("Tool name:", searchTool.name);
console.log("Tool description:", searchTool.description);

const searchResult = await searchTool.invoke("LangChain latest version 2024");
console.log("\nDuckDuckGo search result:");
console.log(searchResult.substring(0, 400));

// Calculator — evaluates math expressions
const calculator = new Calculator();
console.log("\n\nCalculator tool name:", calculator.name);
const calcResult = await calculator.invoke("sqrt(144) + 5 * 3");
console.log("Calculator result (sqrt(144) + 5*3):", calcResult);

// =============================================
// 2. Custom Tool — DynamicTool (takes a string input)
// =============================================
console.log("\n\n=== 2. Custom Tool (DynamicTool) ===\n");

// Tool that counts words in a text
const wordCountTool = new DynamicTool({
  name: "word_counter",
  description: "Counts the number of words in a given text. Input should be a text string.",
  func: async (text) => {
    const count = text.trim().split(/\s+/).filter(Boolean).length;
    return `The text has ${count} words.`;
  },
});

const wcResult = await wordCountTool.invoke("The quick brown fox jumps over the lazy dog");
console.log("Word count result:", wcResult); // should say 9 words

// Tool that checks if a word is a palindrome (reads same forwards and backwards)
const palindromeTool = new DynamicTool({
  name: "palindrome_checker",
  description: "Checks if a word or phrase is a palindrome.",
  func: async (text) => {
    const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, "");
    const isPalindrome = cleaned === cleaned.split("").reverse().join("");
    return isPalindrome ? `"${text}" IS a palindrome.` : `"${text}" is NOT a palindrome.`;
  },
});

console.log(await palindromeTool.invoke("racecar"));                  // IS a palindrome
console.log(await palindromeTool.invoke("hello"));                    // NOT
console.log(await palindromeTool.invoke("A man a plan a canal Panama")); // IS

// =============================================
// 3. Structured Tool — takes multiple parameters (not just one string)
// =============================================
console.log("\n\n=== 3. StructuredTool with Zod Schema ===\n");

const currencyConverterTool = new DynamicStructuredTool({
  name: "currency_converter",
  description: "Converts an amount from one currency to another using approximate rates.",
  // Zod schema defines what inputs the tool accepts
  schema: z.object({
    amount: z.number().describe("The amount to convert"),
    from_currency: z.string().describe("The source currency code, e.g. USD"),
    to_currency: z.string().describe("The target currency code, e.g. EUR"),
  }),
  func: async ({ amount, from_currency, to_currency }) => {
    // Static exchange rates (demo only — in real app, call a currency API)
    const rates = { USD: 1.0, EUR: 0.92, GBP: 0.79, JPY: 149.5, INR: 83.2, CAD: 1.36 };
    const from = from_currency.toUpperCase();
    const to = to_currency.toUpperCase();
    if (!rates[from]) return `Unknown currency: ${from}`;
    if (!rates[to]) return `Unknown currency: ${to}`;
    const usdAmount = amount / rates[from];
    const result = usdAmount * rates[to];
    return `${amount} ${from} = ${result.toFixed(2)} ${to}`;
  },
});

const convResult = await currencyConverterTool.invoke({ amount: 100, from_currency: "USD", to_currency: "EUR" });
console.log("Conversion:", convResult);

// =============================================
// 4. Toolkit — group multiple tools together
// =============================================
console.log("\n\n=== 4. Tool Registry / Toolkit ===\n");

// Group related tools into an array (a "toolkit")
const mathToolkit = [
  calculator,
  new DynamicStructuredTool({
    name: "percentage_calculator",
    description: "Calculates what percentage X is of Y",
    schema: z.object({
      x: z.number().describe("The part value"),
      y: z.number().describe("The total value"),
    }),
    func: async ({ x, y }) => `${x} is ${((x / y) * 100).toFixed(2)}% of ${y}`,
  }),
  new DynamicStructuredTool({
    name: "power_calculator",
    description: "Calculates base raised to the power of exponent",
    schema: z.object({ base: z.number(), exponent: z.number() }),
    func: async ({ base, exponent }) => `${base}^${exponent} = ${Math.pow(base, exponent)}`,
  }),
];

console.log("Math Toolkit tools:");
mathToolkit.forEach((tool) => console.log(`  - ${tool.name}: ${tool.description}`));

const pctResult = await mathToolkit[1].invoke({ x: 25, y: 200 });
console.log("\nPercentage:", pctResult);

const powResult = await mathToolkit[2].invoke({ base: 2, exponent: 10 });
console.log("Power:", powResult);
