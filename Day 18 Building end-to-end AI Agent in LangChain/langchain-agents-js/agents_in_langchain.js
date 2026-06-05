/**
 * Day 18 - End-to-End AI Agent using LangChain
 * Python equivalent: agents_in_langchain.ipynb
 *
 * Implements a ReAct agent using:
 *   - createReactAgent (LangGraph)
 *   - DuckDuckGo search tool
 *   - Custom weather tool
 *   - Verbose reasoning trace
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";

// ============================================
// TOOLS
// ============================================

// Tool 1: DuckDuckGo Web Search
const searchTool = new DuckDuckGoSearch({
  maxResults: 3,
  name: "web_search",
});

// Tool 2: Weather Tool (mock — replace with real API)
const weatherTool = new DynamicStructuredTool({
  name: "get_weather",
  description: "Gets current weather for a city. Returns temperature, conditions, and humidity.",
  schema: z.object({
    city: z.string().describe("The name of the city to get weather for"),
  }),
  func: async ({ city }) => {
    // Mock weather data (replace with real API like OpenWeatherMap)
    const mockWeather = {
      London: { temp: 15, condition: "Cloudy", humidity: 78 },
      Paris: { temp: 18, condition: "Partly Sunny", humidity: 65 },
      "New York": { temp: 22, condition: "Clear", humidity: 55 },
      Tokyo: { temp: 28, condition: "Humid", humidity: 80 },
      Mumbai: { temp: 32, condition: "Hot and Sunny", humidity: 85 },
    };

    const weather = mockWeather[city] ?? {
      temp: Math.floor(Math.random() * 30) + 5,
      condition: "Variable",
      humidity: Math.floor(Math.random() * 40) + 50,
    };

    return JSON.stringify({
      city,
      temperature_celsius: weather.temp,
      condition: weather.condition,
      humidity_percent: weather.humidity,
    });
  },
});

// Tool 3: Calculator
const calculatorTool = new DynamicStructuredTool({
  name: "calculator",
  description: "Performs mathematical calculations. Supports basic arithmetic and math functions.",
  schema: z.object({
    expression: z.string().describe("A mathematical expression to evaluate, e.g. '2 + 3 * 4' or 'Math.sqrt(16)'"),
  }),
  func: async ({ expression }) => {
    try {
      // Safe evaluation of math expressions
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
// CREATE REACT AGENT
// ============================================
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

// createReactAgent from LangGraph — equivalent to Python's create_react_agent + AgentExecutor
const agent = createReactAgent({
  llm: model,
  tools,
  // System message (equivalent to hub.pull("hwchase17/react") prompt)
  messageModifier:
    "You are a helpful AI assistant with access to web search, weather, and calculator tools. " +
    "Use tools when you need current information or calculations. " +
    "Think step by step and show your reasoning. Always provide a clear final answer.",
});

// ============================================
// AGENT EXECUTOR (verbose trace)
// ============================================
async function runAgent(query) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Query: ${query}`);
  console.log("=".repeat(60));

  const inputs = { messages: [new HumanMessage(query)] };

  // Stream events for verbose output (like AgentExecutor verbose=True)
  const stream = await agent.stream(inputs, { streamMode: "values" });

  let finalAnswer = "";

  for await (const chunk of stream) {
    const lastMessage = chunk.messages[chunk.messages.length - 1];

    // Show tool calls
    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      for (const tc of lastMessage.tool_calls) {
        console.log(`\n[Thought → Action] Calling: ${tc.name}`);
        console.log(`  Args: ${JSON.stringify(tc.args)}`);
      }
    }
    // Show tool results
    else if (lastMessage.constructor.name === "ToolMessage") {
      console.log(`[Observation] ${lastMessage.content}`);
    }
    // Show final AI response
    else if (lastMessage.content && lastMessage._getType?.() === "ai") {
      finalAnswer = lastMessage.content;
    }
  }

  console.log(`\n[Final Answer]\n${finalAnswer}`);
  return finalAnswer;
}

// ============================================
// RUN AGENT WITH DIFFERENT QUERIES
// ============================================

// Query 1: Web search
await runAgent("What are the latest developments in LangChain.js in 2024?");

// Query 2: Weather
await runAgent("What's the weather like in Paris and Tokyo right now?");

// Query 3: Multi-step reasoning with calculator
await runAgent("If I have $1500 and spend 30% on rent and 15% on food, how much do I have left?");
