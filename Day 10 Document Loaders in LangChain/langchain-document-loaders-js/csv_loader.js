/**
 * Day 10 - CSVLoader
 * Python equivalent: csv_loader.py
 *
 * Each row of the CSV becomes a Document.
 * Prints document count and the first document.
 */

import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "sample_data.csv");

// Load the CSV — each row becomes a Document
const loader = new CSVLoader(filePath);
const docs = await loader.load();

console.log("Total documents (rows):", docs.length);

console.log("\nFirst Document:");
console.log("  Content:", docs[0].pageContent);
console.log("  Metadata:", docs[0].metadata);

console.log("\nAll Documents:");
docs.forEach((doc, i) => {
  console.log(`\n[Doc ${i + 1}]`);
  console.log(doc.pageContent);
});
