// ============================================================
// FILE: youtube_chatbot.js
// WHAT IT DOES: Downloads a YouTube video's transcript and lets you chat about it.
// WHY: Combines everything learned so far — document loading, splitting, vector store,
//      RAG, and chat history — into one complete chatbot project.
// HOW:
//   1. Load YouTube transcript
//   2. Split transcript into chunks
//   3. Store in Chroma vector store
//   4. Answer questions using RAG + remember conversation history
// HOW TO RUN: node youtube_chatbot.js  (then type questions in terminal)
// ============================================================

import "dotenv/config";
import readline from "readline"; // for reading keyboard input
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

// Change this to any YouTube video URL you want to chat about
const YOUTUBE_URL = "https://www.youtube.com/watch?v=LbT1yp6quS8";

// ============================================
// STEP 1: Load YouTube transcript
// ============================================
console.log(`Loading YouTube transcript from: ${YOUTUBE_URL}`);

const loader = YoutubeLoader.createFromUrl(YOUTUBE_URL, {
  language: "en",       // transcript language
  addVideoInfo: true,   // also get video title and description
});

let docs;
try {
  docs = await loader.load();
  console.log(`Loaded ${docs.length} document(s) from YouTube.`);
  console.log(`Video title: ${docs[0]?.metadata?.title ?? "unknown"}`);
  console.log(`Transcript length: ${docs[0]?.pageContent?.length} characters`);
} catch (err) {
  // Fallback if transcript can't be loaded (private video, no captions, etc.)
  console.error("Failed to load YouTube transcript:", err.message);
  console.log("Using fallback demo content...");
  docs = [{
    pageContent: `LangChain is a framework for developing applications powered by language models. 
    It provides tools for building chains, agents, and RAG pipelines. 
    LangChain supports OpenAI, Anthropic, Google, and many other LLM providers. 
    The framework includes components for prompts, memory, retrievers, and tools. 
    LCEL (LangChain Expression Language) makes it easy to compose these components.`,
    metadata: { title: "Demo: LangChain Introduction", source: YOUTUBE_URL },
  }];
}

// ============================================
// STEP 2: Split transcript into chunks
// ============================================
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,   // transcript chunks can be a bit larger
  chunkOverlap: 200, // good overlap for conversations
});
const chunks = await splitter.splitDocuments(docs);
console.log(`\nSplit into ${chunks.length} chunks.`);

// ============================================
// STEP 3: Build vector store
// ============================================
console.log("Building vector store...");
const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
const vectorStore = await Chroma.fromDocuments(chunks, embeddings, {
  collectionName: "youtube-chatbot",
});
const retriever = vectorStore.asRetriever({ k: 4 }); // get top 4 relevant chunks per question
console.log("Vector store ready.\n");

// ============================================
// STEP 4: Build RAG chatbot with memory
// ============================================
const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });
const parser = new StringOutputParser();

// Prompt uses both retrieved context AND chat history
const chatPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful assistant that answers questions about a YouTube video.
Use the provided context from the video transcript to answer questions.
If something isn't covered in the transcript, say so politely.

Video Context:
{context}`,
  ],
  new MessagesPlaceholder("chat_history"), // ← past conversation goes here
  ["human", "{question}"],
]);

// Helper: join retrieved chunks into one context string
function formatDocs(docs) {
  return docs.map((d) => d.pageContent).join("\n\n");
}

// Memory: keeps all past messages so AI remembers the conversation
const chatHistory = [];

// Chat function: retrieves context + uses history to answer
async function chat(question) {
  const context = await retriever.invoke(question).then(formatDocs);
  const chain = chatPrompt.pipe(model).pipe(parser);
  const response = await chain.invoke({ context, chat_history: chatHistory, question });

  // Save this turn to history
  chatHistory.push(new HumanMessage(question));
  chatHistory.push(new AIMessage(response));
  return response;
}

// ============================================
// STEP 5: Interactive terminal chat
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

    askQuestion(); // loop — ask next question
  });
}

askQuestion();
