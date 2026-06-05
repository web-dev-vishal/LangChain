// ============================================================
// FILE: webbase_loader.js
// WHAT IT DOES: Scrapes a web page and uses AI to answer questions about it.
// WHY: CheerioWebBaseLoader downloads a webpage's content so AI can read it.
//      Like asking AI "here's a webpage, answer my question about it".
// ============================================================

import "dotenv/config";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// The web page to scrape
const url = "https://en.wikipedia.org/wiki/Artificial_intelligence";

console.log(`Scraping: ${url}`);

// Download and parse the web page
const loader = new CheerioWebBaseLoader(url);
const docs = await loader.load();

console.log("Documents loaded:", docs.length);
console.log("Content length:", docs[0].pageContent.length, "characters");
console.log("Metadata:", docs[0].metadata); // shows the URL source

// Web pages can be very long → take only first 3000 characters to stay within token limits
const content = docs[0].pageContent.substring(0, 3000);

// Ask AI a question about the web page content
const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant. Answer questions based on the provided web content."],
  ["human", "Web page content:\n{content}\n\nQuestion: {question}"],
]);

const chain = prompt.pipe(model).pipe(parser);

const result = await chain.invoke({
  content,
  question: "What is artificial intelligence and when was the term first coined?",
});

console.log("\nAnswer:");
console.log(result);
