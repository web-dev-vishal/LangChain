// ============================================================
// FILE: text_structure_based.js
// WHAT IT DOES: Splits text respecting natural structure (paragraphs first, then sentences).
// WHY: Better than length_based.js — it tries to keep complete paragraphs together.
//      RecursiveCharacterTextSplitter is the most commonly used splitter in LangChain.
// HOW: Tries to split at paragraphs first, then sentences, then words, then characters.
// ============================================================

import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const text = `# Introduction to Machine Learning

Machine learning is a method of data analysis that automates analytical model building.
It is based on the idea that systems can learn from data, identify patterns, and make 
decisions with minimal human intervention.

## Types of Machine Learning

### Supervised Learning
Supervised learning uses labeled training data to learn a mapping from inputs to outputs.
Common algorithms include linear regression, decision trees, and neural networks.
Applications: spam detection, image classification, fraud detection.

### Unsupervised Learning
Unsupervised learning finds patterns in data without labeled responses.
Common algorithms include k-means clustering, PCA, and autoencoders.
Applications: customer segmentation, anomaly detection, dimensionality reduction.

### Reinforcement Learning
Reinforcement learning trains agents to make sequences of decisions.
The agent learns by interacting with an environment and receiving rewards or penalties.
Applications: game playing (AlphaGo), robotics, recommendation systems.

## Key Concepts

The bias-variance tradeoff is a fundamental concept in machine learning.
High bias means underfitting; high variance means overfitting.
Regularization techniques like L1/L2 help control variance.

Cross-validation is used to evaluate model performance on unseen data.
The train-test split ensures models generalize beyond training examples.`;

// RecursiveCharacterTextSplitter — respects structure (tries to keep paragraphs together)
// chunkOverlap: 50 means 50 chars repeat between chunks → better context continuity
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});

const chunks = await splitter.createDocuments([text]);

console.log("Total chunks:", chunks.length);
chunks.forEach((chunk, i) => {
  console.log(`\n--- Chunk ${i + 1} (${chunk.pageContent.length} chars) ---`);
  console.log(chunk.pageContent);
});
