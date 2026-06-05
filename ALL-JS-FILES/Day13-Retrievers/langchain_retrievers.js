// ============================================================
// FILE: langchain_retrievers.js
// WHAT IT DOES: Shows 4 ways to retrieve documents from a vector store.
// WHY: A "retriever" is a tool that fetches relevant documents for a query.
//      It's the core of RAG (Retrieval Augmented Generation) systems.
// ============================================================

import "dotenv/config";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

// =============================================
// 1. Wikipedia Retriever — searches Wikipedia
// =============================================
console.log("=== 1. Wikipedia Retriever ===");

const wikiTool = new WikipediaQueryRun({
  topKResults: 2,          // get top 2 results
  maxDocContentLength: 500, // max characters to return
});

const wikiResult = await wikiTool.invoke("LangChain AI framework");
console.log("Wikipedia result (preview):");
console.log(wikiResult.substring(0, 400));

// =============================================
// 2. Chroma-Based Retriever — simple similarity search
// =============================================
console.log("\n=== 2. Chroma-Based Retriever ===");

// Load documents about France into vector store
const documents = [
  new Document({ pageContent: "Paris is the capital and largest city of France.", metadata: { topic: "geography" } }),
  new Document({ pageContent: "The Eiffel Tower was built in 1889 and stands 330 meters tall.", metadata: { topic: "landmark" } }),
  new Document({ pageContent: "French cuisine is known for its sophistication and diversity.", metadata: { topic: "food" } }),
  new Document({ pageContent: "The Louvre is the world's largest art museum, located in Paris.", metadata: { topic: "culture" } }),
  new Document({ pageContent: "France is a founding member of the European Union.", metadata: { topic: "politics" } }),
  new Document({ pageContent: "The Seine river flows through Paris for about 13 km.", metadata: { topic: "geography" } }),
  new Document({ pageContent: "Versailles Palace was the home of French kings from 1682 to 1789.", metadata: { topic: "history" } }),
];

const vectorStore = await Chroma.fromDocuments(documents, embeddings, {
  collectionName: "france-knowledge",
});

// asRetriever() turns the vector store into a retriever object
const retriever = vectorStore.asRetriever({ k: 3 }); // return top 3 matches

const query = "Tell me about Paris landmarks";
console.log(`Query: "${query}"`);
const retrieved = await retriever.invoke(query);

retrieved.forEach((doc, i) => {
  console.log(`\n[${i + 1}] ${doc.pageContent}`);
  console.log(`    Topic: ${doc.metadata.topic}`);
});

// =============================================
// 3. MMR Retriever — gets DIVERSE results (not just the most similar)
// =============================================
console.log("\n=== 3. MMR Retriever ===");
// MMR = Maximum Marginal Relevance
// Balances relevance + diversity — avoids returning 3 nearly identical documents

const mmrRetriever = vectorStore.asRetriever({
  searchType: "mmr",       // use MMR algorithm
  searchKwargs: {
    k: 3,       // return 3 documents
    fetchK: 6,  // first fetch 6 candidates, then pick 3 diverse ones
    lambda: 0.5, // 0 = max diversity, 1 = max relevance (0.5 = balanced)
  },
});

const mmrResults = await mmrRetriever.invoke("France culture and history");
console.log("MMR results (diverse):");
mmrResults.forEach((doc, i) => {
  console.log(`\n[${i + 1}] [${doc.metadata.topic}] ${doc.pageContent}`);
});

// =============================================
// 4. Search with similarity scores
// =============================================
console.log("\n=== 4. Similarity Search with Scores ===");

const withScores = await vectorStore.similaritySearchWithScore("art museum Paris", 3);
withScores.forEach(([doc, score], i) => {
  console.log(`\n[${i + 1}] Score: ${score.toFixed(4)} | ${doc.pageContent}`);
});
