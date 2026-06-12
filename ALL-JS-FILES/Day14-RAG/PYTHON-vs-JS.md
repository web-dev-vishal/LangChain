# Day 14 — Python vs JavaScript: RAG Pipeline

The Python version is in a Jupyter notebook. Here is the full Python code vs JS comparison.

---

## Full RAG Pipeline: Python vs JavaScript

**Python (from Retrieval Augmented Generation.ipynb):**
```python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.document_loaders import TextLoader

# INDEXING
loader = TextLoader("my_document.txt")
docs = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
chunks = splitter.split_documents(docs)

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(documents=chunks, embedding=embeddings)

# RETRIEVAL + GENERATION
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

rag_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Answer ONLY from the context:\n{context}"),
    ("human", "{question}")
])

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
parser = StrOutputParser()

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | rag_prompt
    | model
    | parser
)

answer = rag_chain.invoke("What is LangChain?")
print(answer)
```

**JavaScript (rag_pipeline.js):**
```js
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

// INDEXING
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 300, chunkOverlap: 50 });
const chunks = await splitter.createDocuments([knowledgeBase]);

const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
const vectorStore = await Chroma.fromDocuments(chunks, embeddings, { collectionName: "rag-kb" });

// RETRIEVAL + GENERATION
const retriever = vectorStore.asRetriever({ k: 3 });

const ragPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant. Answer ONLY from the context:\n{context}"],
  ["human", "{question}"],
]);

function formatDocs(docs) {
  return docs.map((doc) => doc.pageContent).join("\n\n");
}

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });
const parser = new StringOutputParser();

const ragChain = RunnableSequence.from([
  { context: retriever.pipe(formatDocs), question: new RunnablePassthrough() },
  ragPrompt,
  model,
  parser,
]);

const answer = await ragChain.invoke("What is LangChain?");
console.log(answer);
```

---

## Python vs JS Mapping Table

| Python | JavaScript |
|--------|-----------|
| `Chroma.from_documents(documents=chunks, embedding=emb)` | `Chroma.fromDocuments(chunks, emb, { collectionName })` |
| `vectorstore.as_retriever(search_kwargs={"k":3})` | `vectorStore.asRetriever({ k: 3 })` |
| `retriever \| format_docs` | `retriever.pipe(formatDocs)` |
| `RunnablePassthrough()` | `new RunnablePassthrough()` |
| `{"context": ..., "question": RunnablePassthrough()}` | `{ context: retriever.pipe(formatDocs), question: new RunnablePassthrough() }` |
| `StrOutputParser` | `StringOutputParser` |
| `chain.invoke("question")` | `await chain.invoke("question")` |
| `doc.page_content` | `doc.pageContent` |
