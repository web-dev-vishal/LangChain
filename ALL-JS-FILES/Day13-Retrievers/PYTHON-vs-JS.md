# Day 13 — Python vs JavaScript: Retrievers

The Python version is in Jupyter notebooks. Here is the equivalent Python code vs JS.

---

## Python (from langchain_retrievers.ipynb) → langchain_retrievers.js

**Python — Basic Retriever:**
```python
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

vectorstore = Chroma.from_documents(documents=docs, embedding=embeddings)

# Convert vectorstore to retriever
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# Retrieve relevant documents for a query
results = retriever.invoke("Tell me about Paris landmarks")
for doc in results:
    print(doc.page_content)
```
**JavaScript:**
```js
const vectorStore = await Chroma.fromDocuments(documents, embeddings);
const retriever = vectorStore.asRetriever({ k: 3 });
const retrieved = await retriever.invoke("Tell me about Paris landmarks");
retrieved.forEach((doc) => console.log(doc.pageContent));
```
**Key mapping:** `as_retriever()` → `asRetriever()` | `search_kwargs={"k":3}` → `{ k: 3 }`

---

## MMR Retriever

**Python:**
```python
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 3,
        "fetch_k": 6,
        "lambda_mult": 0.5
    }
)
```
**JavaScript:**
```js
const mmrRetriever = vectorStore.asRetriever({
  searchType: "mmr",
  searchKwargs: {
    k: 3,
    fetchK: 6,
    lambda: 0.5,
  },
});
```
**Key difference:** `fetch_k` → `fetchK` | `lambda_mult` → `lambda` (camelCase in JS)

---

## Wikipedia Retriever

**Python:**
```python
from langchain_community.retrievers import WikipediaRetriever
retriever = WikipediaRetriever(top_k_results=2, doc_content_chars_max=500)
docs = retriever.invoke("LangChain AI framework")
```
**JavaScript:**
```js
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
const wikiTool = new WikipediaQueryRun({ topKResults: 2, maxDocContentLength: 500 });
const result = await wikiTool.invoke("LangChain AI framework");
```

---

## Using Retriever in a Chain (RAG)

**Python:**
```python
from langchain_core.runnables import RunnablePassthrough

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | rag_prompt
    | model
    | parser
)
answer = rag_chain.invoke("What is the capital of France?")
```
**JavaScript:**
```js
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

function formatDocs(docs) {
  return docs.map((doc) => doc.pageContent).join("\n\n");
}

const ragChain = RunnableSequence.from([
  { context: retriever.pipe(formatDocs), question: new RunnablePassthrough() },
  ragPrompt,
  model,
  parser,
]);
const answer = await ragChain.invoke("What is the capital of France?");
```

---

## Summary

| Python | JavaScript |
|--------|-----------|
| `vectorstore.as_retriever(search_kwargs={"k":3})` | `vectorStore.asRetriever({ k: 3 })` |
| `search_type="mmr"` | `searchType: "mmr"` |
| `retriever.invoke(query)` | `await retriever.invoke(query)` |
| `doc.page_content` | `doc.pageContent` |
| `WikipediaRetriever` | `WikipediaQueryRun` (as a tool) |
