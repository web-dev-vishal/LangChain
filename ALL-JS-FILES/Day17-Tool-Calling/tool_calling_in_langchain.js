// ============================================================
// FILE: tool_calling_in_langchain.js
// WHAT IT DOES: AI automatically decides when and how to call tools to answer a question.
// WHY: With tool calling, AI doesn't just talk — it actually RUNS functions to get real answers.
//      "What is 250 USD in EUR?" → AI calls get_conversion_factor → calls convert → replies.
// HOW:
//   1. Bind tools to the model (model.bindTools)
//   2. Send a question
//   3. AI decides what tool to call and with what arguments
//   4. You run the tool and send the result back
//   5. AI uses the result to write a final answer
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import { z } from "zod";

// ============================================
// DEFINE TOOLS
// ============================================

// Tool 1: Get the exchange rate between two currencies
const getConversionFactor = new DynamicStructuredTool({
  name: "get_conversion_factor",
  description: "Gets the conversion rate between two currencies.",
  schema: z.object({
    base_currency: z.string().describe("The source currency code, e.g. USD"),
    target_currency: z.string().describe("The target currency code, e.g. EUR"),
  }),
  func: async ({ base_currency, target_currency }) => {
    const rates = { USD: 1.0, EUR: 0.92, GBP: 0.79, JPY: 149.5, INR: 83.2, CAD: 1.36 };
    const base = base_currency.toUpperCase();
    const target = target_currency.toUpperCase();
    if (!rates[base] || !rates[target]) return JSON.stringify({ error: "Unknown currency" });
    const factor = rates[target] / rates[base];
    return JSON.stringify({ base_currency: base, target_currency: target, factor: factor.toFixed(4) });
  },
});

// Tool 2: Multiply an amount by a conversion factor
const convertCurrency = new DynamicStructuredTool({
  name: "convert_currency",
  description: "Converts an amount using a conversion factor.",
  schema: z.object({
    amount: z.number().describe("The amount to convert"),
    conversion_factor: z.number().describe("The conversion factor (rate)"),
  }),
  func: async ({ amount, conversion_factor }) => {
    const result = amount * conversion_factor;
    return JSON.stringify({ converted_amount: result.toFixed(2) });
  },
});

const tools = [getConversionFactor, convertCurrency];

// ============================================
// BIND TOOLS TO MODEL
// ============================================
const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

// bindTools() tells the AI: "here are functions you can call if needed"
const modelWithTools = model.bindTools(tools);

// Map of tool name → tool function (for looking up which tool to run)
const toolMap = Object.fromEntries(tools.map((t) => [t.name, t]));

// ============================================
// TOOL CALL LOOP
// ============================================
async function runWithTools(userMessage) {
  console.log(`\nUser: ${userMessage}`);

  const messages = [new HumanMessage(userMessage)];

  // Keep looping until AI gives a final answer (no more tool calls)
  while (true) {
    const response = await modelWithTools.invoke(messages);
    messages.push(response);

    // No tool calls = final answer
    if (!response.tool_calls || response.tool_calls.length === 0) {
      console.log(`\nAI: ${response.content}`);
      break;
    }

    // Run each tool the AI requested
    for (const toolCall of response.tool_calls) {
      console.log(`\n[Tool Call] ${toolCall.name}(${JSON.stringify(toolCall.args)})`);
      const tool = toolMap[toolCall.name];
      if (!tool) continue;

      const toolResult = await tool.invoke(toolCall.args);
      console.log(`[Tool Result] ${toolResult}`);

      // Send the tool result back to the AI as a ToolMessage
      messages.push(
        new ToolMessage({
          content: toolResult,
          tool_call_id: toolCall.id, // must match the tool call ID
        })
      );
    }
  }
}

// ============================================
// TEST TOOL CALLING
// ============================================

// AI uses both tools in sequence to answer this
await runWithTools("What is 250 USD in EUR?");

console.log("\n" + "=".repeat(60));

// Multi-step: needs both tools
await runWithTools("Convert 500 British Pounds to Japanese Yen");

console.log("\n" + "=".repeat(60));

// No tools needed — AI answers directly
await runWithTools("What is the capital of France?");
