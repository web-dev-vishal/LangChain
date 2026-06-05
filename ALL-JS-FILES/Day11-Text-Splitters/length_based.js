// ============================================================
// FILE: length_based.js
// WHAT IT DOES: Splits a long text into smaller chunks based on character count.
// WHY: AI models can only process a limited amount of text at once (called "context window").
//      You must split long documents into smaller pieces before sending to AI.
//      Length-based = cut every N characters, no matter what.
// ============================================================

import "dotenv/config";
import { CharacterTextSplitter } from "@langchain/textsplitters";

const text = `Artificial intelligence (AI) is the simulation of human intelligence processes 
by computer systems. These processes include learning (the acquisition of information 
and rules for using the information), reasoning (using rules to reach approximate or 
definite conclusions) and self-correction. Particular applications of AI include 
expert systems, speech recognition and machine vision.

AI was coined as a term by John McCarthy in 1956 at a conference at Dartmouth College. 
Since then, AI has developed in many directions. Machine learning, a subset of AI, 
enables systems to automatically learn and improve from experience without being 
explicitly programmed. Deep learning is a subset of machine learning that uses 
neural networks with many layers to learn representations from data.

Modern AI applications include natural language processing, computer vision, 
robotics, and autonomous vehicles. Large language models like GPT and Claude 
have brought AI capabilities to mainstream users.`;

// Length-based splitter — cuts every 200 characters, no overlap
// chunkSize: max characters per chunk
// chunkOverlap: how many characters to repeat between chunks (0 = none)
// separator: "" = pure length, no respect for word/sentence boundaries
const splitter = new CharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 0,
  separator: "",
});

const chunks = await splitter.createDocuments([text]);

console.log("Total chunks:", chunks.length);
chunks.forEach((chunk, i) => {
  console.log(`\n--- Chunk ${i + 1} (${chunk.pageContent.length} chars) ---`);
  console.log(chunk.pageContent);
});
