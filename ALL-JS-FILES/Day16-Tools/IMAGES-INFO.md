# Day 16 — Tools in LangChain (Images)

## 0.png — What is a Tool?
**What the image shows:** A "tool" is a function the AI can call. It has a name, description, and input schema.

**In JavaScript:**
```js
// A tool has 3 things:
// 1. name       → what the AI calls it
// 2. description → how the AI knows WHEN to use it
// 3. func        → the actual function that runs

import { DynamicTool } from "@langchain/core/tools";

const myTool = new DynamicTool({
  name: "get_current_time",
  description: "Returns the current date and time. Use when the user asks what time it is.",
  func: async () => new Date().toLocaleString(),
});

// The AI reads the description to decide when to call this tool
```

---

## 1.png — Built-in Tools
**What the image shows:** LangChain provides ready-made tools you can use directly.

**In JavaScript — built-in tools:**
```js
// Web Search (no API key needed)
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
const search = new DuckDuckGoSearch({ maxResults: 3 });
await search.invoke("latest AI news");

// Calculator
import { Calculator } from "@langchain/community/tools/calculator";
const calc = new Calculator();
await calc.invoke("sqrt(144) + 5 * 3"); // → "27"

// Wikipedia
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
const wiki = new WikipediaQueryRun({ topKResults: 1 });
await wiki.invoke("LangChain");
```

---

## 3.png — Structured Tool (Multiple Inputs)
**What the image shows:** DynamicStructuredTool takes multiple inputs (not just one string). Uses Zod schema to define inputs.

**In JavaScript:**
```js
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

// Tool with multiple inputs — uses Zod schema
const weatherTool = new DynamicStructuredTool({
  name: "get_weather",
  description: "Gets weather for a city and unit preference.",
  schema: z.object({
    city: z.string().describe("The city name"),
    units: z.enum(["celsius", "fahrenheit"]).describe("Temperature units"),
  }),
  func: async ({ city, units }) => {
    // city and units are separate typed inputs
    return `Weather in ${city}: 22°${units === "celsius" ? "C" : "F"}`;
  },
});

// Python uses @tool decorator, JS uses DynamicStructuredTool
```

---

## 4.png — Tool Calling Flow
**What the image shows:** The complete flow when AI uses a tool:
1. User asks question
2. AI decides to call a tool
3. Tool runs and returns result
4. AI uses result to write final answer

**In JavaScript:**
```js
// Step 1: Bind tools to the model
const modelWithTools = model.bindTools([searchTool, calcTool]);

// Step 2: AI decides whether to call a tool
const response = await modelWithTools.invoke([new HumanMessage("What is 25% of 380?")]);

// Step 3: If AI called a tool, run it
if (response.tool_calls.length > 0) {
  const toolCall = response.tool_calls[0];
  console.log("Tool called:", toolCall.name);    // e.g. "calculator"
  console.log("With args:", toolCall.args);      // e.g. { expression: "0.25 * 380" }
  
  const result = await calcTool.invoke(toolCall.args);
  
  // Step 4: Send result back to AI
  messages.push(new ToolMessage({ content: result, tool_call_id: toolCall.id }));
  const finalAnswer = await modelWithTools.invoke(messages);
}
```

---

### Python vs JavaScript: Tools

| Python | JavaScript |
|--------|-----------|
| `@tool` decorator | `new DynamicTool({ name, description, func })` |
| `BaseTool` class | `DynamicStructuredTool` with Zod schema |
| `tool.run("input")` | `await tool.invoke("input")` |
| `llm.bind_tools([tools])` | `model.bindTools([tools])` |
| `ToolMessage(content, tool_call_id)` | `new ToolMessage({ content, tool_call_id })` |
