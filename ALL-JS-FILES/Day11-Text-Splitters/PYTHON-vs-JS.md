# Day 11 — Python vs JavaScript: Text Splitters

---

## length_based.py → length_based.js

**Python (splits a PDF):**
```python
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader('dl-curriculum.pdf')
docs = loader.load()
splitter = CharacterTextSplitter(chunk_size=200, chunk_overlap=0, separator='')
result = splitter.split_documents(docs)
print(result[1].page_content)
```
**JavaScript (splits inline text):**
```js
import { CharacterTextSplitter } from "@langchain/textsplitters";
const splitter = new CharacterTextSplitter({ chunkSize: 200, chunkOverlap: 0, separator: "" });
const chunks = await splitter.createDocuments([text]);
console.log(chunks[1].pageContent);
```
**Key mapping:** `CharacterTextSplitter` same name | `split_documents(docs)` → `createDocuments([text])` | `page_content` → `pageContent`

---

## text_structure_based.py → text_structure_based.js

**Python:**
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
text = "Space exploration has led to incredible..."
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
chunks = splitter.split_text(text)
print(len(chunks))
print(chunks)
```
**JavaScript:**
```js
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
const chunks = await splitter.createDocuments([text]);
console.log(chunks.length);
chunks.forEach((chunk) => console.log(chunk.pageContent));
```
**Key difference:** `split_text(text)` → `createDocuments([text])` | JS returns Document objects, not plain strings

---

## markdown_splitting.py → markdown_splitting.js

**Python:**
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter, Language
splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.MARKDOWN,
    chunk_size=200,
    chunk_overlap=0,
)
chunks = splitter.split_text(text)
```
**JavaScript:**
```js
import { MarkdownTextSplitter } from "@langchain/textsplitters";
const splitter = new MarkdownTextSplitter({ chunkSize: 200, chunkOverlap: 20 });
const chunks = await splitter.createDocuments([markdownText]);
```
**Key difference:** Python uses `RecursiveCharacterTextSplitter.from_language(Language.MARKDOWN)`. JS has a dedicated `MarkdownTextSplitter` class — cleaner.

---

## python_code_splitting.py → code_splitting.js

**Python (splits Python code):**
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter, Language
splitter = RecursiveCharacterTextSplitter.from_language(
    language=Language.PYTHON,    # splits at class/def boundaries
    chunk_size=300,
    chunk_overlap=0,
)
chunks = splitter.split_text(text)
print(chunks[1])
```
**JavaScript (splits JS code):**
```js
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// fromLanguage("js") instead of Language.PYTHON
const splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
  chunkSize: 300,
  chunkOverlap: 30,
});
const chunks = await splitter.createDocuments([jsCode]);
```
**Key difference:** `Language.PYTHON` → `"js"` string | `from_language()` → `fromLanguage()`

---

## semantic_meaning_based.py → semantic_meaning_based.js

**Python:**
```python
from langchain_experimental.text_splitter import SemanticChunker
from langchain_openai.embeddings import OpenAIEmbeddings

text_splitter = SemanticChunker(
    OpenAIEmbeddings(),
    breakpoint_threshold_type="standard_deviation",
    breakpoint_threshold_amount=3
)
docs = text_splitter.create_documents([sample])
print(len(docs))
print(docs)
```
**JavaScript:**
```js
import { SemanticChunker } from "@langchain/experimental/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";

const splitter = new SemanticChunker(
  new OpenAIEmbeddings({ model: "text-embedding-3-small" }),
  { breakpointThresholdType: "standard_deviation" }
);
const chunks = await splitter.createDocuments([text]);
console.log(chunks.length);
```
**Key difference:** `breakpoint_threshold_type` (snake_case Python) → `breakpointThresholdType` (camelCase JS)

---

## Summary: Python text_splitter → JS equivalent

| Python | JavaScript |
|--------|-----------|
| `from langchain.text_splitter import X` | `import { X } from "@langchain/textsplitters"` |
| `CharacterTextSplitter` | `CharacterTextSplitter` (same name) |
| `RecursiveCharacterTextSplitter` | `RecursiveCharacterTextSplitter` (same name) |
| `.from_language(Language.MARKDOWN)` | `new MarkdownTextSplitter()` |
| `.from_language(Language.PYTHON)` | `RecursiveCharacterTextSplitter.fromLanguage("js")` |
| `SemanticChunker` | `SemanticChunker` (from `@langchain/experimental`) |
| `splitter.split_text(text)` | `await splitter.createDocuments([text])` |
| `doc.page_content` | `doc.pageContent` |
