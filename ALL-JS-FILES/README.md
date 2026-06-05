# ALL JavaScript Files — With Simple English Comments

All JS files from the GenAI Roadmap course are collected here with beginner-friendly comments.

---

## Folder Structure

```
ALL-JS-FILES/
│
├── Day04-LangChain-Models/       ← How to use AI models (OpenAI, Anthropic, Google, HuggingFace)
│   ├── 1.LLMs/                   → Plain text in → plain text out
│   ├── 2.ChatModels/             → Chat messages in → AI reply out
│   └── 3.EmbeddingModels/        → Convert text to numbers (for similarity search)
│
├── Day05-Prompts/                ← How to build reusable prompt templates
│
├── Day06-Structured-Output/      ← Make AI return data in a specific format (JSON/Zod)
│
├── Day07-Output-Parsers/         ← How to extract/parse AI's text response
│
├── Day08-Chains/                 ← Connect multiple AI steps together (pipe)
│
├── Day09-Runnables/              ← Building blocks for chains (Sequence, Parallel, Branch, Lambda)
│
├── Day10-Document-Loaders/       ← Load data from CSV, PDF, TXT, Web pages
│
├── Day11-Text-Splitters/         ← Split long documents into smaller chunks for AI
│
├── Day12-Vector-Stores/          ← Store document embeddings for fast search (Chroma)
│
├── Day13-Retrievers/             ← Search vector stores to find relevant documents
│
├── Day14-RAG/                    ← Full RAG pipeline (AI answers questions from your documents)
│
├── Day15-YouTube-Chatbot/        ← Chat about a YouTube video using RAG
│
├── Day16-Tools/                  ← Give AI tools (web search, calculator, custom functions)
│
├── Day17-Tool-Calling/           ← AI automatically decides to use tools to answer questions
│
├── Day18-AI-Agent/               ← Fully autonomous AI agent (thinks + acts + uses tools)
│
└── Projects/                     ← 2 real projects
    ├── paris_trip_planner.js     → Paris travel guide chatbot
    └── stock_market_enrichment.js → AI enriches stock data with sector + recommendation
```

---

## Key Concepts (Simple English)

| Concept | What it means |
|---|---|
| **LLM** | Text in → text out (old style) |
| **ChatModel** | Messages in → reply out (modern style) |
| **Embedding** | Convert text to numbers for comparison |
| **Chain** | Steps connected with pipe() |
| **Retriever** | Search engine for your documents |
| **RAG** | AI answers using YOUR documents (not just training data) |
| **Tool** | A function the AI can call (search, calculate, etc.) |
| **Agent** | AI that decides on its own which steps to take |
