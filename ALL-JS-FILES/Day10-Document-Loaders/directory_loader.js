// ============================================================
// FILE: directory_loader.js
// WHAT IT DOES: Loads ALL files from a folder (PDFs and text files) at once.
// WHY: Instead of loading files one by one, DirectoryLoader loads an entire folder.
//      Useful when you have many documents (like a books folder).
// NOTE: Create a ./books/ subfolder and put PDF or TXT files in it to test.
// ============================================================

import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Point to the books folder
const booksDir = path.join(__dirname, "books");

// Map file extensions to loader classes:
// ".pdf" files use PDFLoader, ".txt" files use TextLoader
const loader = new DirectoryLoader(booksDir, {
  ".pdf": (filePath) => new PDFLoader(filePath),
  ".txt": (filePath) => new TextLoader(filePath),
});

try {
  console.log(`Loading all documents from: ${booksDir}`);
  const docs = await loader.load();

  console.log(`\nTotal documents loaded: ${docs.length}`);

  // Show a preview of each document
  docs.forEach((doc, i) => {
    console.log(`\n[${i + 1}] Source: ${doc.metadata.source}`);   // which file it came from
    console.log(`    Page: ${doc.metadata.page ?? "N/A"}`);        // page number (for PDFs)
    console.log(`    Content preview: ${doc.pageContent.substring(0, 100).replace(/\n/g, " ")}...`);
  });
} catch (err) {
  console.error("Error loading directory:", err.message);
  console.log("\nTip: Create a ./books/ folder with some .pdf or .txt files to test.");
}
