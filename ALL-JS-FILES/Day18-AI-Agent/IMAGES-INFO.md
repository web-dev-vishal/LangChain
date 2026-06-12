# Day 18 — AI Agent (Images)

## 0.png — What is an Agent?
**What the image shows:** An agent is an AI that THINKS → ACTS → OBSERVES in a loop until it has an answer.

**In JavaScript — the ReAct loop:**
```js
// AGENT LOOP (shown in the image):
//
//   User question
//       ↓
//   [THINK]  AI decides what to do next
//       ↓
//   [ACT]    AI calls a tool
//       ↓
//   [OBSERVE] AI reads the tool result
//       ↓
//   [THINK]  Is this enough to answer? If not → loop again
//       ↓
//   Final Answer

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

const agent = createReactAgent({
  llm: new ChatOpenAI({ model: "gpt-4o-mini" }),
  tools: [searchTool, calculatorTool, weatherTool],
  messageModifier: "You are a helpful assistant. Think step by step.",
});

// Run the agent — it loops automatically until it has a final answer
const result = await agent.invoke({
  messages: [new HumanMessage("What is the weather in Paris and what is 20% tip on €85?")]
});
// Agent will: check weather (tool 1) + calculate tip (tool 2) + combine answer
```

---

## 1.png — Agent Architecture
**What the image shows:** LLM at the center, connected to tools, memory, and user.

**In JavaScript — agent components:**
```js
// ============================================================
// AGENT = LLM + TOOLS + (optional MEMORY)
// ============================================================

// 1. The LLM (the brain)
const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

// 2. The Tools (the hands)
const tools = [
  new DuckDuckGoSearch(),    // search the web
  new Calculator(),          // do math
  customWeatherTool,         // check weather (custom)
  customDatabaseTool,        // query a database (custom)
];

// 3. Create the agent
const agent = createReactAgent({ llm, tools });

// 4. Optional: Add memory by maintaining a messages array
const conversationMessages = []; // keeps all past turns
```

---

## 2.png — LangGraph Agent State Flow
**What the image shows:** LangGraph's state machine for agents — how messages flow between nodes.

**In JavaScript — understanding LangGraph state:**
```js
// LangGraph manages agent state as a list of messages
// Each "node" in the graph is a step:
//   - agent node: LLM decides what to do
//   - tool node: runs the chosen tool
//   - END: returns final answer

// The stream() method lets you see each step:
const stream = await agent.stream(
  { messages: [new HumanMessage("Search for LangChain news")] },
  { streamMode: "values" }
);

for await (const chunk of stream) {
  const lastMessage = chunk.messages[chunk.messages.length - 1];

  if (lastMessage.tool_calls?.length > 0) {
    // Agent is calling a tool (ACT step)
    console.log("[Action]", lastMessage.tool_calls[0].name);
  } else if (lastMessage.constructor.name === "ToolMessage") {
    // Tool returned a result (OBSERVE step)
    console.log("[Observation]", lastMessage.content);
  } else {
    // Final answer (ANSWER step)
    console.log("[Answer]", lastMessage.content);
  }
}
```

---

### Python vs JavaScript: Agents

| Python | JavaScript |
|--------|-----------|
| `create_react_agent(llm, tools)` | `createReactAgent({ llm, tools })` |
| `AgentExecutor(agent, tools, verbose=True)` | `agent.stream(inputs, { streamMode: "values" })` |
| `agent.invoke({"input": "question"})` | `agent.invoke({ messages: [new HumanMessage("question")] })` |
| `hub.pull("hwchase17/react")` | `messageModifier: "system prompt here"` |
| `ToolMessage` | `new ToolMessage({ content, tool_call_id })` |
| LangGraph StateGraph | `createReactAgent` (built on LangGraph internally) |
