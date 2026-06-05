/**
 * Day 10 - DirectoryLoader
 * Python equivalent: directory_loader.py
 *
 * Loads all files of a given type from a directory.
 * Each file (or page for PDFs) becomes a Document.
 *
 * Place PDFs in a ./books/ subfolder to test.
 */

import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const booksDir = path.join(__dirname, "books");

// DirectoryLoader maps file extensions to loader classes
const loader = new DirectoryLoader(booksDir, {
  ".pdf": (filePath) => new PDFLoader(filePath),
  ".txt": (filePath) => new TextLoader(filePath),
});

try {
  console.log(`Loading all documents from: ${booksDir}`);
  const docs = await loader.load();

  console.log(`\nTotal documents loaded: ${docs.length}`);

  // Print metadata for each document (equivalent to Python's directory_loader.py)
  docs.forEach((doc, i) => {
    console.log(`\n[${i + 1}] Source: ${doc.metadata.source}`);
    console.log(`    Page: ${doc.metadata.page ?? "N/A"}`);
    console.log(`    Content preview: ${doc.pageContent.substring(0, 100).replace(/\n/g, " ")}...`);
  });
} catch (err) {
  console.error("Error loading directory:", err.message);
  console.log("\nTip: Create a ./books/ folder with some .pdf or .txt files to test.");
}
