// ============================================================
// FILE: semantic_meaning_based.js
// WHAT IT DOES: Splits text based on MEANING, not length.
// WHY: The smartest splitter — it groups sentences with similar meaning together.
//      If text switches from "AI topics" to "climate change", it creates a new chunk there.
//      Uses embeddings (numbers) to detect topic changes.
// ============================================================

import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SemanticChunker } from "@langchain/experimental/text_splitter";

// Text with 4 clearly different topics
const text = `Artificial intelligence is transforming industries worldwide.
Machine learning models can now recognize images with superhuman accuracy.
Natural language processing allows computers to understand and generate human text.
These technologies are built on neural networks inspired by the human brain.

Climate change is one of the most pressing challenges of our time.
Rising global temperatures are causing more frequent extreme weather events.
Sea levels are rising due to melting polar ice caps.
Governments worldwide are implementing carbon reduction policies.

The history of ancient Rome spans over a thousand years.
The Roman Republic was established in 509 BCE and lasted until 27 BCE.
Julius Caesar played a pivotal role in Rome's transition from republic to empire.
The Roman Empire at its height controlled territory from Britain to Mesopotamia.

Quantum computing leverages quantum mechanical phenomena like superposition and entanglement.
Qubits can exist in multiple states simultaneously unlike classical binary bits.
Quantum computers could solve certain problems exponentially faster than classical computers.
Companies like IBM, Google, and IonQ are leading quantum hardware development.`;

// SemanticChunker uses embeddings to detect where topics change
// breakpointThresholdType: "standard_deviation" = split when topic shifts significantly
const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

const splitter = new SemanticChunker(embeddings, {
  breakpointThresholdType: "standard_deviation",
});

const chunks = await splitter.createDocuments([text]);

// Ideally, each chunk should correspond to one topic (AI, climate, Rome, quantum)
console.log("Total semantic chunks:", chunks.length);
chunks.forEach((chunk, i) => {
  console.log(`\n--- Semantic Chunk ${i + 1} ---`);
  console.log(chunk.pageContent);
});
