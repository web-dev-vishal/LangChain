/**
 * Day 10 - WebBaseLoader (Web Scraper)
 * Python equivalent: webbase_loader.py
 *
 * Scrapes a web page and passes the content to ChatOpenAI via chain.
 * Python used WebBaseLoader; JS uses CheerioWebBaseLoader from @langchain/community.
 */

import "dotenv/config";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// --- Load web page ---
const url = "https://en.wikipedia.org/wiki/Artificial_intelligence";

console.log(`Scraping: ${url}`);
const loader = new CheerioWebBaseLoader(url);
const docs = await loader.load();

console.log("Documents loaded:", docs.length);
console.log("Content length:", docs[0].pageContent.length, "characters");
console.log("Metadata:", docs[0].metadata);

// Truncate content for the prompt (web pages can be very long)
const content = docs[0].pageContent.substring(0, 3000);

// --- Chain with ChatOpenAI ---
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
