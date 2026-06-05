// ============================================================
// FILE: agents_in_langchain.js
// WHAT IT DOES: Creates a fully autonomous AI agent that can search the web,
//               check weather, and do math — all by itself.
// WHY: An agent is an AI that decides on its own what steps to take to answer a question.
//      It thinks → picks a tool → uses it → thinks again → gives answer.
//      This is the most advanced concept in the course.
// HOW: Uses ReAct agent (Reasoning + Acting) from LangGraph.
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";

// ============================================
// DEFINE TOOLS the agent can use
// ============================================

// Tool 1: Web search (no API key needed)
const searchTool = new DuckDuckGoSearch({ maxResults: 3, name: "web_search" });

// Tool 2: Weather lookup (mock data — replace with real API for production)
const weatherTool = new DynamicStructuredTool({
  name: "get_weather",
  description: "Gets current weather for a city.",
  schema: z.object({
    city: z.string().describe("The name of the city to get weather for"),
  }),
  func: async ({ city }) => {
    // Mock data — pretend this is a real weather API
    const mockWeather = {
      London:    { temp: 15, condition: "Cloudy", humidity: 78 },
      Paris:     { temp: 18, condition: "Partly Sunny", humidity: 65 },
      "New York": { temp: 22, condition: "Clear", humidity: 55 },
      Tokyo:     { temp: 28, condition: "Humid", humidity: 80 },
      Mumbai:    { temp: 32, condition: "Hot and Sunny", humidity: 85 },
    };
    const weather = mockWeather[city] ?? {
      temp: Math.floor(Math.random() * 30) + 5,
      condition: "Variable",
      humidity: Math.floor(Math.random() * 40) + 50,
    };
    return JSON.stringify({ city, temperature_celsius: weather.temp, condition: weather.condition, humidity_percent: weather.humidity });
  },
});

// Tool 3: Calculator for math
const calculatorTool = new DynamicStructuredTool({
  name: "calculator",
  description: "Performs mathematical calculations. e.g. '2 + 3 * 4' or 'Math.sqrt(16)'",
  schema: z.object({
    expression: z.string().describe("A mathematical expression to evaluate"),
  }),
  func: async ({ expression }) => {
    try {
      // Safe eval — only allows numbers and math operators
      const sanitized = expression.replace(/[^0-9+\-*/().Math\s,]/g, "");
      const result = Function(`"use strict"; return (${sanitized})`)();
      return String(result);
    } catch (err) {
      return `Error: ${err.message}`;
    }
  },
});

const tools = [searchTool, weatherTool, calculatorTool];

// ============================================
// CREATE THE REACT AGENT
// ============================================
const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

// createReactAgent creates an agent that thinks step-by-step and uses tools
const agent = createReactAgent({
  llm: model,
  tools,
  messageModifier:
    "You are a helpful AI assistant with access to web search, weather, and calculator tools. " +
    "Use tools when you need current information or calculations. " +
    "Think step by step and always provide a clear final answer.",
});

// ============================================
// RUN THE AGENT (with verbose trace)
// ============================================
async function runAgent(query) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Query: ${query}`);
  console.log("=".repeat(60));

  // Stream agent's thoughts and actions step by step
  const stream = await agent.stream(
    { messages: [new HumanMessage(query)] },
    { streamMode: "values" }
  );

  let finalAnswer = "";

  for await (const chunk of stream) {
    const lastMessage = chunk.messages[chunk.messages.length - 1];

    // Show when agent calls a tool (its "action")
    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      for (const tc of lastMessage.tool_calls) {
        console.log(`\n[Thought → Action] Calling: ${tc.name}`);
        console.log(`  Args: ${JSON.stringify(tc.args)}`);
      }
    }
    // Show the tool's result (the "observation")
    else if (lastMessage.constructor.name === "ToolMessage") {
      console.log(`[Observation] ${lastMessage.content}`);
    }
    // Capture final answer
    else if (lastMessage.content && lastMessage._getType?.() === "ai") {
      finalAnswer = lastMessage.content;
    }
  }

  console.log(`\n[Final Answer]\n${finalAnswer}`);
  return finalAnswer;
}

// ============================================
// TEST THE AGENT WITH DIFFERENT QUERIES
// ============================================

// Query 1: Needs web search
await runAgent("What are the latest developments in LangChain.js in 2024?");

// Query 2: Needs weather tool
await runAgent("What's the weather like in Paris and Tokyo right now?");

// Query 3: Needs calculator (multi-step math)
await runAgent("If I have $1500 and spend 30% on rent and 15% on food, how much do I have left?");
