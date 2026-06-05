/**
 * Day 15 - YouTube Chatbot using RAG
 * Python equivalent: YouTube Chatbot using LangChain.ipynb + rag_using_langchain.ipynb
 *
 * Full pipeline:
 *   1. Load YouTube transcript via YoutubeLoader
 *   2. Split into chunks
 *   3. Embed and store in Chroma
 *   4. RAG chatbot with persistent in-memory history
 *
 * Requires: npm install @langchain/community youtube-transcript
 * Replace YOUTUBE_URL with any YouTube video URL.
 */

import "dotenv/config";
import readline from "readline";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

// ============================================
// CONFIGURATION
// ============================================
const YOUTUBE_URL = "https://www.youtube.com/watch?v=LbT1yp6quS8"; // LangChain intro — replace with any video

// ============================================
// STEP 1: Load YouTube transcript
// ============================================
console.log(`Loading YouTube transcript from: ${YOUTUBE_URL}`);

const loader = YoutubeLoader.createFromUrl(YOUTUBE_URL, {
  language: "en",
  addVideoInfo: true, // adds title, description to metadata
});

let docs;
try {
  docs = await loader.load();
  console.log(`Loaded ${docs.length} document(s) from YouTube.`);
  console.log(`Video title: ${docs[0]?.metadata?.title ?? "unknown"}`);
  console.log(`Transcript length: ${docs[0]?.pageContent?.length} characters`);
} catch (err) {
  console.error("Failed to load YouTube transcript:", err.message);
  console.log("Using fallback demo content...");
  docs = [
    {
      pageContent: `LangChain is a framework for developing applications powered by language models. 
      It provides tools for building chains, agents, and RAG pipelines. 
      LangChain supports OpenAI, Anthropic, Google, and many other LLM providers. 
      The framework includes components for prompts, memory, retrievers, and tools. 
      LCEL (LangChain Expression Language) makes it easy to compose these components.`,
      metadata: { title: "Demo: LangChain Introduction", source: YOUTUBE_URL },
    },
  ];
}

// ============================================
// STEP 2: Split transcript into chunks
// ============================================
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const chunks = await splitter.splitDocuments(docs);
console.log(`\nSplit into ${chunks.length} chunks.`);

// ============================================
// STEP 3: Embed and store in Chroma
// ============================================
console.log("Building vector store...");
const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

const vectorStore = await Chroma.fromDocuments(chunks, embeddings, {
  collectionName: "youtube-chatbot",
});

const retriever = vectorStore.asRetriever({ k: 4 });
console.log("Vector store ready.\n");

// ============================================
// STEP 4: RAG Chatbot with Memory
// ============================================
const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });
const parser = new StringOutputParser();

const chatPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful assistant that answers questions about a YouTube video.
Use the provided context from the video transcript to answer questions.
If something isn't covered in the transcript, say so politely.

Video Context:
{context}`,
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

function formatDocs(docs) {
  return docs.map((d) => d.pageContent).join("\n\n");
}

// Persistent in-memory chat history
const chatHistory = [];

async function chat(question) {
  const context = await retriever.invoke(question).then(formatDocs);

  const chain = chatPrompt.pipe(model).pipe(parser);

  const response = await chain.invoke({
    context,
    chat_history: chatHistory,
    question,
  });

  // Update history
  chatHistory.push(new HumanMessage(question));
  chatHistory.push(new AIMessage(response));

  return response;
}

// ============================================
// STEP 5: Interactive CLI
// ============================================
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('YouTube Chatbot ready. Ask questions about the video. Type "exit" to quit.\n');

function askQuestion() {
  rl.question("You: ", async (input) => {
    const question = input.trim();
    if (!question) return askQuestion();
    if (["exit", "quit"].includes(question.toLowerCase())) {
      console.log("Goodbye!");
      rl.close();
      return;
    }

    try {
      const answer = await chat(question);
      console.log(`\nBot: ${answer}\n`);
    } catch (err) {
      console.error("Error:", err.message);
    }

    askQuestion();
  });
}

askQuestion();
