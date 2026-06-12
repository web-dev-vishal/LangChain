# Day 04 — Python vs JavaScript: LangChain Models

Every Python file from the original `langchain models/` folder is shown here side-by-side with its JS equivalent.

---

## requirements.txt → package.json dependencies

**Python (pip install):**
```
langchain, langchain-openai, langchain-anthropic,
langchain-google-genai, langchain-huggingface,
python-dotenv, numpy, scikit-learn
```

**JavaScript (npm install):**
```
langchain @langchain/core @langchain/openai @langchain/anthropic
@langchain/google-genai @langchain/community dotenv
@xenova/transformers (for local HuggingFace models)
```

---

## test.py → test.js

**Python:**
```python
import langchain
print(langchain.__version__)
```
**JavaScript:**
```js
import { VERSION } from "langchain/version";
console.log("LangChain.js version:", VERSION);
```

---

## 1.LLMs/1_llm_demo.py → 1.LLMs/1_llm_demo.js

**Python:**
```python
from langchain_openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

llm = OpenAI(model='gpt-3.5-turbo-instruct')
result = llm.invoke("What is the capital of India")
print(result)
```
**JavaScript:**
```js
import "dotenv/config";
import { OpenAI } from "@langchain/openai";
const llm = new OpenAI({ model: "gpt-3.5-turbo-instruct", temperature: 0.7 });
const result = await llm.invoke("What is the capital of India");
console.log(result);
```
**Key differences:** `load_dotenv()` → `import "dotenv/config"` | `llm.invoke()` → `await llm.invoke()`

---

## 2.ChatModels/1_chatmodel_openai.py → 2.ChatModels/1_chatmodel_openai.js

**Python:**
```python
from langchain_openai import ChatOpenAI
model = ChatOpenAI(model='gpt-4', temperature=1.5, max_completion_tokens=10)
result = model.invoke("Write a 5 line poem on cricket")
print(result.content)
```
**JavaScript:**
```js
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
const model = new ChatOpenAI({ model: "gpt-4", temperature: 1.5, maxTokens: 10 });
const result = await model.invoke([new HumanMessage("Write a 5 line poem on cricket")]);
console.log(result.content);
```
**Key difference:** Python passes a string, JS passes `[new HumanMessage(...)]`

---

## 2.ChatModels/2_chatmodel_anthropic.py → 2_chatmodel_anthropic.js

**Python:**
```python
from langchain_anthropic import ChatAnthropic
model = ChatAnthropic(model='claude-3-5-sonnet-20241022')
result = model.invoke('What is the capital of India')
print(result.content)
```
**JavaScript:**
```js
import { ChatAnthropic } from "@langchain/anthropic";
const model = new ChatAnthropic({ model: "claude-3-5-sonnet-20241022" });
const result = await model.invoke([new HumanMessage("What is the capital of India")]);
console.log(result.content);
```

---

## 2.ChatModels/3_chatmodel_google.py → 3_chatmodel_google.js

**Python:**
```python
from langchain_google_genai import ChatGoogleGenerativeAI
model = ChatGoogleGenerativeAI(model='gemini-1.5-pro')
result = model.invoke('What is the capital of India')
```
**JavaScript:**
```js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
const model = new ChatGoogleGenerativeAI({ model: "gemini-1.5-pro" });
const result = await model.invoke([new HumanMessage("What is the capital of India")]);
```

---

## 2.ChatModels/4_chatmodel_hf_api.py → 4_chatmodel_hf_api.js

**Python:**
```python
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
llm = HuggingFaceEndpoint(repo_id="TinyLlama/TinyLlama-1.1B-Chat-v1.0", task="text-generation")
model = ChatHuggingFace(llm=llm)
result = model.invoke("What is the capital of India")
```
**JavaScript:**
```js
import { ChatHuggingFace, HuggingFaceInference } from "@langchain/community/chat_models/huggingface";
const llm = new HuggingFaceInference({ model: "TinyLlama/TinyLlama-1.1B-Chat-v1.0" });
const model = new ChatHuggingFace({ llm });
const result = await model.invoke([new HumanMessage("What is the capital of India")]);
```

---

## 2.ChatModels/5_chatmodel_hf_local.py → 5_chatmodel_hf_local.js

**Python:**
```python
from langchain_huggingface import ChatHuggingFace, HuggingFacePipeline
import os
os.environ['HF_HOME'] = 'D:/huggingface_cache'
llm = HuggingFacePipeline.from_model_id(
    model_id='TinyLlama/TinyLlama-1.1B-Chat-v1.0',
    task='text-generation',
    pipeline_kwargs=dict(temperature=0.5, max_new_tokens=100)
)
model = ChatHuggingFace(llm=llm)
```
**JavaScript:**
```js
process.env.TRANSFORMERS_CACHE = process.env.HF_HOME ?? "./hf_cache";
const { pipeline } = await import("@xenova/transformers");
const generator = await pipeline("text-generation", "Xenova/TinyLlama-1.1B-Chat-v1.0", { quantized: true });
const result = await generator([{ role: "user", content: "What is the capital of India?" }], { max_new_tokens: 100 });
```

---

## 3.EmbeddingModels/1_embedding_openai_query.py → 1_embedding_openai_query.js

**Python:**
```python
from langchain_openai import OpenAIEmbeddings
embedding = OpenAIEmbeddings(model='text-embedding-3-large', dimensions=32)
result = embedding.embed_query("Delhi is the capital of India")
print(str(result))
```
**JavaScript:**
```js
import { OpenAIEmbeddings } from "@langchain/openai";
const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-large", dimensions: 32 });
const vector = await embeddings.embedQuery("Delhi is the capital of India");
console.log(vector);
```
**Key difference:** `.embed_query()` → `.embedQuery()`

---

## 3.EmbeddingModels/2_embedding_openai_docs.py → 2_embedding_openai_docs.js

**Python:**
```python
result = embedding.embed_documents(documents)
```
**JavaScript:**
```js
const vectors = await embeddings.embedDocuments(documents);
```
**Key difference:** `.embed_documents()` → `.embedDocuments()`

---

## 3.EmbeddingModels/3_embedding_hf_local.py → 3_embedding_hf_local.js

**Python:**
```python
from langchain_huggingface import HuggingFaceEmbeddings
embedding = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
vector = embedding.embed_documents(documents)
```
**JavaScript:**
```js
const { pipeline } = await import("@xenova/transformers");
const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { quantized: true });
const output = await extractor(text, { pooling: "mean", normalize: true });
```

---

## 3.EmbeddingModels/4_document_similarity.py → 4_document_similarity.js

**Python:**
```python
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
scores = cosine_similarity([query_embedding], doc_embeddings)[0]
index, score = sorted(list(enumerate(scores)), key=lambda x:x[1])[-1]
```
**JavaScript:**
```js
// No sklearn in JS — manually implement cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (normA * normB);
}
similarities.sort((a, b) => b.score - a.score);
```
**Key difference:** Python uses sklearn. JS computes it manually (only 7 lines).
