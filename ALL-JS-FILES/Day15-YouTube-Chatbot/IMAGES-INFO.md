# Day 15 — YouTube Chatbot (Image)

## 0.png — YouTube Chatbot Architecture Diagram
**What the image shows:** The full pipeline from YouTube URL → transcript → RAG → chatbot answers.

**In JavaScript — the complete flow:**

```js
// ============================================================
// THE FULL YOUTUBE CHATBOT PIPELINE (shown in the image)
// ============================================================

// STEP 1: YouTube URL → Transcript (text)
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";

const loader = YoutubeLoader.createFromUrl("https://youtube.com/watch?v=...", {
  language: "en",      // get English transcript
  addVideoInfo: true,  // also grab video title, description
});
const docs = await loader.load();
// docs[0].pageContent = the full transcript text
// docs[0].metadata.title = "Video Title"


// STEP 2: Split long transcript into chunks
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,   // each chunk = 1000 characters
  chunkOverlap: 200, // 200 chars overlap for context
});
const chunks = await splitter.splitDocuments(docs);


// STEP 3: Store chunks in vector database
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";

const vectorStore = await Chroma.fromDocuments(
  chunks,
  new OpenAIEmbeddings({ model: "text-embedding-3-small" })
);


// STEP 4: Create retriever (finds relevant transcript parts for each question)
const retriever = vectorStore.asRetriever({ k: 4 });


// STEP 5: Build RAG chatbot with memory
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const chatHistory = []; // remembers conversation

async function chat(question) {
  const context = await retriever.invoke(question);
  // context = relevant parts of the video transcript

  const chain = chatPrompt.pipe(model).pipe(parser);
  const response = await chain.invoke({ context, chat_history: chatHistory, question });

  // Save to memory
  chatHistory.push(new HumanMessage(question));
  chatHistory.push(new AIMessage(response));
  return response;
}
```

---

### Python vs JavaScript: YoutubeLoader

| Python | JavaScript |
|--------|-----------|
| `YoutubeLoader.from_youtube_url(url)` | `YoutubeLoader.createFromUrl(url, options)` |
| `loader.load()` | `await loader.load()` |
| `docs[0].page_content` | `docs[0].pageContent` |
| `docs[0].metadata["title"]` | `docs[0].metadata.title` |
