/**
 * Day 13 - Retrievers in LangChain
 * Python equivalent: langchain_retrievers.ipynb
 *
 * Demonstrates:
 *   1. Wikipedia Retriever
 *   2. Chroma-based retriever (similarity search)
 *   3. Chroma with MMR (Maximum Marginal Relevance)
 *   4. Similarity search with score
 */

import "dotenv/config";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

// =============================================
// 1. Wikipedia Retriever
// =============================================
console.log("=== 1. Wikipedia Retriever ===");

const wikiTool = new WikipediaQueryRun({
  topKResults: 2,
  maxDocContentLength: 500,
});

const wikiResult = await wikiTool.invoke("LangChain AI framework");
console.log("Wikipedia result (preview):");
console.log(wikiResult.substring(0, 400));

// =============================================
// 2. Chroma-Based Retriever
// =============================================
console.log("\n=== 2. Chroma-Based Retriever ===");

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

// Create a retriever from the vector store
const retriever = vectorStore.asRetriever({ k: 3 });

const query = "Tell me about Paris landmarks";
console.log(`Query: "${query}"`);
const retrieved = await retriever.invoke(query);

retrieved.forEach((doc, i) => {
  console.log(`\n[${i + 1}] ${doc.pageContent}`);
  console.log(`    Topic: ${doc.metadata.topic}`);
});

// =============================================
// 3. MMR Retriever (Maximum Marginal Relevance)
// =============================================
console.log("\n=== 3. MMR Retriever ===");
// MMR balances relevance and diversity in results

const mmrRetriever = vectorStore.asRetriever({
  searchType: "mmr",
  searchKwargs: {
    k: 3,
    fetchK: 6,    // fetch more candidates, then select diverse subset
    lambda: 0.5,  // 0 = max diversity, 1 = max relevance
  },
});

const mmrResults = await mmrRetriever.invoke("France culture and history");
console.log("MMR results (diverse):");
mmrResults.forEach((doc, i) => {
  console.log(`\n[${i + 1}] [${doc.metadata.topic}] ${doc.pageContent}`);
});

// =============================================
// 4. Similarity Search with Scores
// =============================================
console.log("\n=== 4. Similarity Search with Scores ===");

const withScores = await vectorStore.similaritySearchWithScore("art museum Paris", 3);
withScores.forEach(([doc, score], i) => {
  console.log(`\n[${i + 1}] Score: ${score.toFixed(4)} | ${doc.pageContent}`);
});
