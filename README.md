# GenAI Roadmap — JavaScript Port

Complete JavaScript/Node.js port of the original Python GenAI roadmap using **LangChain.js**.

---

## Stack

| Python | JavaScript Equivalent |
|--------|----------------------|
| `langchain` | `langchain` |
| `langchain-openai` | `@langchain/openai` |
| `langchain-anthropic` | `@langchain/anthropic` |
| `langchain-google-genai` | `@langchain/google-genai` |
| `langchain-community` | `@langchain/community` |
| `langchain-core` | `@langchain/core` |
| `@langchain/langgraph` | `@langchain/langgraph` |
| `python-dotenv` | `dotenv` |
| `pydantic` | `zod` |
| `streamlit` | `express` (REST API + HTML) |
| `scikit-learn cosine_similarity` | Manual implementation |
| `sentence-transformers (local)` | `@xenova/transformers` |
| `chromadb` | `chromadb` + `@langchain/community` |

---

## Setup

```bash
cd js-port
npm install
cp .env.example .env
# Fill in your API keys in .env
```

### Required API Keys (in `.env`)
```
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...          # Day 08 parallel chain only
GOOGLE_API_KEY=...             # Day 04 Google model only
HUGGINGFACEHUB_API_TOKEN=...   # Day 04 HF models only
```

---

## Project Structure

Each JS folder lives **inside** the matching Python day folder — Python and JavaScript side by side:

```
GenAI-Roadmap-with-Notes-and-Projects/
├── package.json                              ← npm config (run npm install here)
├── .env.example                              ← copy to .env and add API keys
│
├── Day 04 LangChain Models/
│   ├── langchain models/                     ← Python files
│   └── langchain-models-js/                  ← JavaScript files
│       ├── 1.LLMs/1_llm_demo.js
│       ├── 2.ChatModels/
│       │   ├── 1_chatmodel_openai.js         ← ChatOpenAI (gpt-4)
│       │   ├── 2_chatmodel_anthropic.js      ← ChatAnthropic (claude-3-5-sonnet)
│       │   ├── 3_chatmodel_google.js         ← ChatGoogleGenerativeAI (gemini-1.5-pro)
│       │   ├── 4_chatmodel_hf_api.js         ← HuggingFace Inference API
│       │   └── 5_chatmodel_hf_local.js       ← Local HF (@xenova/transformers)
│       └── 3.EmbeddingModels/
│           ├── 1_embedding_openai_query.js   ← embedQuery()
│           ├── 2_embedding_openai_docs.js    ← embedDocuments()
│           ├── 3_embedding_hf_local.js       ← Local HF embeddings
│           └── 4_document_similarity.js      ← Cosine similarity + best match
│
├── Day 05 Prompts in LangChain/
│   ├── langchain prompts/                    ← Python files
│   └── langchain-prompts-js/                 ← JavaScript files
│       ├── prompt_template.js
│       ├── chat_prompt_template.js
│       ├── messages.js
│       ├── message_placeholder.js
│       ├── chatbot.js                        ← Interactive CLI chatbot
│       ├── temperature.js
│       ├── prompt_generator.js               ← Saves template to JSON
│       └── prompt_ui.js                      ← Express.js web UI (replaces Streamlit)
│
├── Day 06 Structured Output in LangChain/
│   └── langchain-structured-output-js/
│       ├── pydantic_demo.js                  ← Zod (replaces Pydantic)
│       ├── typeddict_demo.js
│       ├── with_structured_output_json.js
│       ├── with_structured_output_zod.js     ← withStructuredOutput + Zod
│       └── with_structured_output_typeddict.js
│
├── Day 07 Output Parsers in LangChain/
│   └── langchain-output-parsers-js/
│       ├── stroutputparser.js
│       ├── stroutputparser1.js               ← Clean LCEL pipe chain
│       ├── jsonoutputparser.js
│       ├── pydanticoutputparser.js
│       └── structuredoutputparser.js
│
├── Day 08 Chains in LangChain/
│   ├── langchain-chains/                     ← Python files
│   └── langchain-chains-js/
│       ├── simple_chain.js
│       ├── sequential_chain.js
│       ├── parallel_chain.js                 ← RunnableParallel (OpenAI + Anthropic)
│       └── conditional_chain.js              ← Sentiment routing
│
├── Day 09 Runnables in LangChain/
│   └── langchain-runnables-js/
│       ├── runnable_sequence.js
│       ├── runnable_parallel.js
│       ├── runnable_passthrough.js
│       ├── runnable_lambda.js
│       └── runnable_branch.js
│
├── Day 10 Document Loaders in LangChain/
│   └── langchain-document-loaders-js/
│       ├── text_loader.js
│       ├── csv_loader.js
│       ├── pdf_loader.js
│       ├── directory_loader.js
│       └── webbase_loader.js                 ← CheerioWebBaseLoader
│
├── Day 11 Text Splitters in LangChain/
│   └── langchain-text-splitters-js/
│       ├── length_based.js
│       ├── text_structure_based.js
│       ├── markdown_splitting.js
│       ├── code_splitting.js
│       └── semantic_meaning_based.js         ← SemanticChunker
│
├── Day 12 Vector Stores in LangChain/
│   └── langchain-vector-stores-js/
│       └── langchain_chroma.js
│
├── Day 13 Retrievers in LangChain/
│   └── langchain-retrievers-js/
│       └── langchain_retrievers.js
│
├── Day 14 Retrieval Augmented Generation/
│   └── langchain-rag-js/
│       └── rag_pipeline.js                   ← Full RAG pipeline
│
├── Day 15 YouTube Chatbot using LangChain/
│   └── langchain-youtube-chatbot-js/
│       └── youtube_chatbot.js
│
├── Day 16 Tools in LangChain/
│   └── langchain-tools-js/
│       └── tools_in_langchain.js
│
├── Day 17 Tool Calling in LangChain/
│   └── langchain-tool-calling-js/
│       └── tool_calling_in_langchain.js
│
├── Day 18 Building end-to-end AI Agent in LangChain/
│   └── langchain-agents-js/
│       └── agents_in_langchain.js            ← ReAct agent (createReactAgent)
│
└── Projects/
    ├── Enriching Stock Market Data.../      ← Python notebook
    ├── Planning a Trip to Paris.../         ← Python notebook
    └── js-projects/
        ├── stock_market_enrichment.js
        └── paris_trip_planner.js
```

---

## Running Each File

All files use ES Modules (`"type": "module"` in package.json).
Run from the **project root** (where `package.json` lives).

```bash
# Day 04 - Models
node "Day 04 LangChain Models/langchain-models-js/2.ChatModels/1_chatmodel_openai.js"
node "Day 04 LangChain Models/langchain-models-js/3.EmbeddingModels/4_document_similarity.js"

# Day 05 - Prompts
node "Day 05 Prompts in LangChain/langchain-prompts-js/chatbot.js"
node "Day 05 Prompts in LangChain/langchain-prompts-js/prompt_ui.js"   # → http://localhost:3000

# Day 06 - Structured Output
node "Day 06 Structured Output in LangChain/langchain-structured-output-js/with_structured_output_zod.js"

# Day 07 - Output Parsers
node "Day 07 Output Parsers in LangChain/langchain-output-parsers-js/structuredoutputparser.js"

# Day 08 - Chains
node "Day 08 Chains in LangChain/langchain-chains-js/parallel_chain.js"

# Day 09 - Runnables
node "Day 09 Runnables in LangChain/langchain-runnables-js/runnable_branch.js"

# Day 10 - Document Loaders
node "Day 10 Document Loaders in LangChain/langchain-document-loaders-js/text_loader.js"
node "Day 10 Document Loaders in LangChain/langchain-document-loaders-js/webbase_loader.js"

# Day 11 - Text Splitters
node "Day 11 Text Splitters in LangChain/langchain-text-splitters-js/semantic_meaning_based.js"

# Day 12 - Vector Stores
node "Day 12 Vector Stores in LangChain/langchain-vector-stores-js/langchain_chroma.js"

# Day 13 - Retrievers
node "Day 13 Retrievers in LangChain/langchain-retrievers-js/langchain_retrievers.js"

# Day 14 - RAG
node "Day 14 Retrieval Augmented Generation/langchain-rag-js/rag_pipeline.js"

# Day 15 - YouTube Chatbot
node "Day 15 YouTube Chatbot using LangChain/langchain-youtube-chatbot-js/youtube_chatbot.js"

# Day 16 - Tools
node "Day 16 Tools in LangChain/langchain-tools-js/tools_in_langchain.js"

# Day 17 - Tool Calling
node "Day 17 Tool Calling in LangChain/langchain-tool-calling-js/tool_calling_in_langchain.js"

# Day 18 - Agents
node "Day 18 Building end-to-end AI Agent in LangChain/langchain-agents-js/agents_in_langchain.js"

# Projects
node "Projects/js-projects/stock_market_enrichment.js"
node "Projects/js-projects/paris_trip_planner.js"
```

---

## Key Differences: Python vs JavaScript

| Concept | Python | JavaScript |
|---------|--------|------------|
| Pipe operator | `chain = prompt \| model \| parser` | `chain = prompt.pipe(model).pipe(parser)` |
| Pydantic model | `class Person(BaseModel)` | `z.object({...})` (Zod) |
| `with_structured_output` | `model.with_structured_output(schema)` | `model.withStructuredOutput(schema)` |
| `load_dotenv()` | `from dotenv import load_dotenv` | `import "dotenv/config"` |
| TypedDict | `class Person(TypedDict)` | JSDoc `@typedef` or plain objects |
| Streamlit UI | `streamlit run app.py` | `node prompt_ui.js` → Express server |
| Local HF models | `HuggingFacePipeline` | `@xenova/transformers` |
| `async for` streaming | `for chunk in stream` | `for await (const chunk of stream)` |
| `AgentExecutor` | `AgentExecutor(agent, tools)` | `createReactAgent({ llm, tools })` |

---

## Node.js Version Requirement

Node.js **18+** is required for native `fetch`, top-level `await`, and ES Modules support.

```bash
node --version  # Should be v18.0.0 or higher
```
