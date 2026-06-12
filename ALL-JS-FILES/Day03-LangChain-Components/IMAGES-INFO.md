# Day 03 — LangChain Components (Image)

## 0.png — LangChain Core Components Diagram
**What the image shows:** All the building blocks of LangChain and how they relate to each other.

**In JavaScript — all components explained:**

```js
// ============================================================
// 1. MODELS — The AI brain
// ============================================================
import { ChatOpenAI } from "@langchain/openai";
const model = new ChatOpenAI({ model: "gpt-4o-mini" });
// Other models: ChatAnthropic, ChatGoogleGenerativeAI, ChatHuggingFace


// ============================================================
// 2. PROMPTS — Instructions template with fill-in-the-blank slots
// ============================================================
import { ChatPromptTemplate } from "@langchain/core/prompts";
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a {role}."],
  ["human", "{question}"],
]);


// ============================================================
// 3. CHAINS — Connect steps together using pipe()
// ============================================================
const chain = prompt.pipe(model).pipe(parser);
// .pipe() is the JS equivalent of Python's | operator


// ============================================================
// 4. OUTPUT PARSERS — Extract clean text from AI response
// ============================================================
import { StringOutputParser } from "@langchain/core/output_parsers";
import { JsonOutputParser } from "@langchain/core/output_parsers";
const parser = new StringOutputParser(); // gives you a plain string
const jsonParser = new JsonOutputParser(); // gives you a JS object


// ============================================================
// 5. DOCUMENT LOADERS — Load data from files/web
// ============================================================
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";


// ============================================================
// 6. TEXT SPLITTERS — Cut long text into small chunks
// ============================================================
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });


// ============================================================
// 7. EMBEDDINGS — Convert text to numbers
// ============================================================
import { OpenAIEmbeddings } from "@langchain/openai";
const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });


// ============================================================
// 8. VECTOR STORES — Store + search embeddings
// ============================================================
import { Chroma } from "@langchain/community/vectorstores/chroma";
const vectorStore = await Chroma.fromDocuments(docs, embeddings);


// ============================================================
// 9. RETRIEVERS — Search the vector store
// ============================================================
const retriever = vectorStore.asRetriever({ k: 3 });


// ============================================================
// 10. TOOLS — Functions the AI can call
// ============================================================
import { DynamicTool } from "@langchain/core/tools";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";


// ============================================================
// 11. AGENTS — AI that decides what to do next
// ============================================================
import { createReactAgent } from "@langchain/langgraph/prebuilt";
const agent = createReactAgent({ llm: model, tools: [searchTool] });
```
