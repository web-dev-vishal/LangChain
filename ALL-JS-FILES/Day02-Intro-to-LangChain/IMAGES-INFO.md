# Day 02 — Introduction to LangChain (Images)

These 4 images explain how LangChain works. Below is what each image shows, converted to JavaScript context.

---

## 1.png — What is LangChain?
**What the image shows:** LangChain architecture overview — how components connect.

**In JavaScript (LangChain.js):**
```js
// LangChain is a framework that connects AI models with real-world data and tools.
// In JS, you install it with:
//   npm install langchain @langchain/openai @langchain/core

import { ChatOpenAI } from "@langchain/openai";
// ↑ This is the AI brain

import { ChatPromptTemplate } from "@langchain/core/prompts";
// ↑ This is how you write instructions to the AI

import { StringOutputParser } from "@langchain/core/output_parsers";
// ↑ This cleans up the AI's reply into plain text
```

---

## 2.png — LangChain Modules
**What the image shows:** The 6 main modules: Models, Prompts, Chains, Memory, Agents, Tools.

**In JavaScript:**
| Module | JS Import | What it does |
|---|---|---|
| Models | `@langchain/openai` | The AI brain |
| Prompts | `@langchain/core/prompts` | Instructions template |
| Chains | `.pipe()` method | Connect steps together |
| Memory | `chatHistory[]` array | Remember past messages |
| Agents | `createReactAgent()` | AI that thinks and acts |
| Tools | `DynamicTool` | Functions AI can call |

---

## 3.png — LangChain Input → Output Flow
**What the image shows:** Data flows from user → prompt → model → output.

**In JavaScript (the pipe chain):**
```js
// This is the exact flow shown in the image:
// User input → Prompt Template → AI Model → Output Parser → Final text

const chain = prompt        // 1. Fill in the prompt template
  .pipe(model)              // 2. Send to AI model
  .pipe(parser);            // 3. Extract plain text

const result = await chain.invoke({ topic: "Python vs JavaScript" });
// Result is a clean string you can use directly
```

---

## 4.png — LangChain Full Pipeline with RAG
**What the image shows:** Complete RAG pipeline — documents → embeddings → vector store → retrieval → answer.

**In JavaScript (full RAG flow):**
```js
// The image shows this exact pipeline:

// STEP 1: Load documents
const loader = new TextLoader("my_file.txt");
const docs = await loader.load();

// STEP 2: Split into chunks
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500 });
const chunks = await splitter.splitDocuments(docs);

// STEP 3: Embed + Store in vector DB
const vectorStore = await Chroma.fromDocuments(chunks, new OpenAIEmbeddings());

// STEP 4: Retrieve relevant chunks for a query
const retriever = vectorStore.asRetriever({ k: 3 });

// STEP 5: AI answers using retrieved context
const ragChain = RunnableSequence.from([
  { context: retriever.pipe(formatDocs), question: new RunnablePassthrough() },
  ragPrompt,
  model,
  parser,
]);
```
