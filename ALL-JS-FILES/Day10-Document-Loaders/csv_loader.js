// ============================================================
// FILE: csv_loader.js
// WHAT IT DOES: Reads a CSV file and turns each row into a LangChain Document.
// WHY: Before AI can answer questions about your data, it needs to load it.
//      Each row becomes a Document with pageContent (the data) and metadata (source info).
// ============================================================

import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to the CSV file
const filePath = path.join(__dirname, "sample_data.csv");

// Load the CSV — each row → one Document object
const loader = new CSVLoader(filePath);
const docs = await loader.load();

// How many rows (documents) did we load?
console.log("Total documents (rows):", docs.length);

// Show the first document
console.log("\nFirst Document:");
console.log("  Content:", docs[0].pageContent); // the row data as text
console.log("  Metadata:", docs[0].metadata);   // file info (source, row number, etc.)

// Show all documents
console.log("\nAll Documents:");
docs.forEach((doc, i) => {
  console.log(`\n[Doc ${i + 1}]`);
  console.log(doc.pageContent);
});
