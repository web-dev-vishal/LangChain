// ============================================================
// FILE: text_loader.js
// WHAT IT DOES: Reads a .txt file, then uses AI to summarize its content.
// WHY: TextLoader loads any plain text file into a Document.
//      Then you can chain it with an AI model to analyze the text.
// ============================================================

import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the text file
const filePath = path.join(__dirname, "sample_text.txt");
const loader = new TextLoader(filePath);
const docs = await loader.load(); // returns array (usually 1 document for a single file)

console.log("Number of documents:", docs.length);
console.log("\nMetadata:", docs[0].metadata);                        // shows file source
console.log("\nContent preview:", docs[0].pageContent.substring(0, 200)); // first 200 chars

// Now summarize the loaded text with AI
const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser();

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that summarizes documents."],
  ["human", "Summarize this text in 2-3 sentences:\n\n{text}"],
]);

const chain = prompt.pipe(model).pipe(parser);

// Pass the loaded file content to the chain
const summary = await chain.invoke({ text: docs[0].pageContent });
console.log("\nSummary:");
console.log(summary);
