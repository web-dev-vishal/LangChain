/**
 * Day 10 - PDF Loader
 * Python equivalent: pdf_loader.py
 *
 * Each page of the PDF becomes a Document.
 * Prints page count, content preview, and metadata.
 *
 * Requires: npm install pdf-parse
 * Place a PDF file named "sample.pdf" in this folder.
 */

import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "sample.pdf");

// Load the PDF — each page = one Document
const loader = new PDFLoader(filePath);
const docs = await loader.load();

console.log("Total pages:", docs.length);

docs.forEach((doc, i) => {
  console.log(`\n--- Page ${i + 1} ---`);
  console.log("Content (first 300 chars):", doc.pageContent.substring(0, 300));
  console.log("Metadata:", doc.metadata);
});
