# Day 05 — Prompts in LangChain (Image)

## 0.png — Types of Prompts Diagram
**What the image shows:** Different prompt types in LangChain — PromptTemplate, ChatPromptTemplate, MessagesPlaceholder.

**In JavaScript — all prompt types explained:**

```js
// ============================================================
// 1. PromptTemplate — simple single-string prompt with {variables}
// ============================================================
import { PromptTemplate } from "@langchain/core/prompts";

const template = PromptTemplate.fromTemplate(
  "You are a helpful assistant. Answer this question about {topic}: {question}"
);

// Fill in the blanks
const filled = await template.invoke({ topic: "space", question: "What is a black hole?" });
// Result: "You are a helpful assistant. Answer this question about space: What is a black hole?"


// ============================================================
// 2. ChatPromptTemplate — multi-message prompt (system + human + ai)
// ============================================================
import { ChatPromptTemplate } from "@langchain/core/prompts";

const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a {role} expert."],   // tells AI how to behave
  ["human", "Explain {topic} simply."],      // the user's question
]);

const messages = await chatPrompt.invoke({ role: "science", topic: "gravity" });


// ============================================================
// 3. MessagesPlaceholder — slot for inserting chat history
// ============================================================
import { MessagesPlaceholder } from "@langchain/core/prompts";

const promptWithHistory = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  new MessagesPlaceholder("chat_history"),  // ← history gets plugged in here
  ["human", "{question}"],
]);

// Use it:
const result = await promptWithHistory.invoke({
  chat_history: previousMessages,  // array of HumanMessage / AIMessage objects
  question: "What did we talk about?",
});


// ============================================================
// 4. FewShotPromptTemplate — give AI examples before the question
// ============================================================
// Example: show AI 2 example Q&A pairs before asking your question
// This teaches the AI what style/format you want
const examples = [
  { input: "What is 2+2?", output: "4" },
  { input: "What is 3*3?", output: "9" },
];
// The AI learns from these examples before answering your real question
```

---

### Python vs JavaScript Prompt Comparison

| Python | JavaScript |
|--------|-----------|
| `PromptTemplate.from_template("...")` | `PromptTemplate.fromTemplate("...")` |
| `ChatPromptTemplate.from_messages([...])` | `ChatPromptTemplate.fromMessages([...])` |
| `MessagesPlaceholder(variable_name="chat_history")` | `new MessagesPlaceholder("chat_history")` |
| `template.format(topic="AI")` | `await template.invoke({ topic: "AI" })` |
| `template \| model \| parser` | `template.pipe(model).pipe(parser)` |
