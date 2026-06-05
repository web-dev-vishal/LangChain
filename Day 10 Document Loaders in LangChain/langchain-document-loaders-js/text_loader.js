/**
 * Day 10 - TextLoader
 * Python equivalent: text_loader.py
 *
 * Loads a .txt file, prints page_content and metadata,
 * then chains with PromptTemplate + ChatOpenAI to summarize.
 */

import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "sample_text.txt");

// --- Load the text file ---
const loader = new TextLoader(filePath);
const docs = await loader.load();

console.log("Number of documents:", docs.length);
console.log("\nMetadata:", docs[0].metadata);
console.log("\nContent preview:", docs[0].pageContent.substring(0, 200));

// --- Chain with ChatOpenAI to summarize ---
const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that summarizes documents."],
  ["human", "Summarize this text in 2-3 sentences:\n\n{text}"],
]);

const chain = prompt.pipe(model).pipe(parser);

const summary = await chain.invoke({ text: docs[0].pageContent });
console.log("\nSummary:");
console.log(summary);
