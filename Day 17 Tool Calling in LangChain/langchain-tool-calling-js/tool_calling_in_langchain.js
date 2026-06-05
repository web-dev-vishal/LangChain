/**
 * Day 17 - Tool Calling in LangChain
 * Python equivalent: tool_calling_in_langchain.ipynb
 *
 * Demonstrates:
 *   1. llm.bindTools() — bind tools to the model
 *   2. Tool call flow: Human → AI (tool call) → ToolMessage → AI (final answer)
 *   3. Multi-tool pipeline: get_conversion_factor → convert (currency)
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import { z } from "zod";

// ============================================
// DEFINE TOOLS
// ============================================

// Tool 1: Get currency conversion factor
const getConversionFactor = new DynamicStructuredTool({
  name: "get_conversion_factor",
  description: "Gets the conversion rate between two currencies. Returns how many units of target currency equal 1 unit of source currency.",
  schema: z.object({
    base_currency: z.string().describe("The source currency code, e.g. USD"),
    target_currency: z.string().describe("The target currency code, e.g. EUR"),
  }),
  func: async ({ base_currency, target_currency }) => {
    // Static demo rates (in production, call a real currency API)
    const rates = { USD: 1.0, EUR: 0.92, GBP: 0.79, JPY: 149.5, INR: 83.2, CAD: 1.36 };
    const base = base_currency.toUpperCase();
    const target = target_currency.toUpperCase();
    if (!rates[base] || !rates[target]) return JSON.stringify({ error: "Unknown currency" });
    const factor = rates[target] / rates[base];
    return JSON.stringify({ base_currency: base, target_currency: target, factor: factor.toFixed(4) });
  },
});

// Tool 2: Convert amount using a given factor
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
const modelWithTools = model.bindTools(tools);

// Tool lookup map
const toolMap = Object.fromEntries(tools.map((t) => [t.name, t]));

// ============================================
// TOOL CALL LOOP
// ============================================
async function runWithTools(userMessage) {
  console.log(`\nUser: ${userMessage}`);

  const messages = [new HumanMessage(userMessage)];

  // Keep executing until model stops calling tools
  while (true) {
    const response = await modelWithTools.invoke(messages);
    messages.push(response);

    // No tool calls → final answer
    if (!response.tool_calls || response.tool_calls.length === 0) {
      console.log(`\nAI: ${response.content}`);
      break;
    }

    // Execute each tool call
    for (const toolCall of response.tool_calls) {
      console.log(`\n[Tool Call] ${toolCall.name}(${JSON.stringify(toolCall.args)})`);

      const tool = toolMap[toolCall.name];
      if (!tool) {
        console.error(`Unknown tool: ${toolCall.name}`);
        continue;
      }

      const toolResult = await tool.invoke(toolCall.args);
      console.log(`[Tool Result] ${toolResult}`);

      // Append ToolMessage to messages (required by the API)
      messages.push(
        new ToolMessage({
          content: toolResult,
          tool_call_id: toolCall.id,
        })
      );
    }
  }
}

// ============================================
// TEST TOOL CALLING
// ============================================

// Single-step tool call
await runWithTools("What is 250 USD in EUR?");

console.log("\n" + "=".repeat(60));

// Multi-step tool call (model chains both tools)
await runWithTools("Convert 500 British Pounds to Japanese Yen");

console.log("\n" + "=".repeat(60));

// No tool needed
await runWithTools("What is the capital of France?");
