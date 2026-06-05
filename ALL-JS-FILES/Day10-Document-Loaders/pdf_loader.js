// ============================================================
// FILE: pdf_loader.js
// WHAT IT DOES: Reads a PDF file — each page becomes a Document.
// WHY: PDFs are common document formats. This loads them so AI can read them.
// NOTE: Place a file named "sample.pdf" in the same folder before running.
//       Requires: npm install pdf-parse
// ============================================================

import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to the PDF file
const filePath = path.join(__dirname, "sample.pdf");

// Load the PDF — each page = one Document
const loader = new PDFLoader(filePath);
const docs = await loader.load();

// How many pages?
console.log("Total pages:", docs.length);

// Show content and info for each page
docs.forEach((doc, i) => {
  console.log(`\n--- Page ${i + 1} ---`);
  console.log("Content (first 300 chars):", doc.pageContent.substring(0, 300));
  console.log("Metadata:", doc.metadata); // includes page number, total pages, source
});
