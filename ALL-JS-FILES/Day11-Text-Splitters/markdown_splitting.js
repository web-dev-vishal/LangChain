// ============================================================
// FILE: markdown_splitting.js
// WHAT IT DOES: Splits markdown text at header boundaries (##, ###, etc.)
// WHY: Markdown documents have headers that separate topics. Splitting at headers
//      keeps related content together, giving better chunks than plain length splitting.
// ============================================================

import "dotenv/config";
import { MarkdownTextSplitter } from "@langchain/textsplitters";

const markdownText = `# Deep Learning Guide

## Introduction
Deep learning is a subset of machine learning using neural networks with many layers.
It has achieved remarkable success in image recognition, NLP, and game playing.

## Neural Network Basics

### Neurons and Layers
Each neuron applies a weighted sum followed by an activation function.
Networks have input, hidden, and output layers.

### Activation Functions
- ReLU: max(0, x) — most common for hidden layers
- Sigmoid: outputs 0-1 — used for binary classification
- Softmax: outputs probabilities — used for multi-class classification

## Training Process

### Forward Pass
Input data flows through the network to produce predictions.

### Backpropagation
Gradients of the loss are computed and used to update weights.
The chain rule is applied to propagate gradients backward.

### Optimizers
- SGD: basic gradient descent
- Adam: adaptive learning rates — most popular
- RMSProp: good for RNNs

## Applications
- Computer Vision: CNNs for image classification and object detection
- NLP: Transformers for text generation and understanding  
- Generative Models: GANs and VAEs for image synthesis

## Conclusion
Deep learning continues to advance rapidly with models like GPT-4 and Gemini
pushing the boundaries of what AI can achieve.`;

// MarkdownTextSplitter — respects the ## header hierarchy when splitting
const splitter = new MarkdownTextSplitter({
  chunkSize: 200,  // max characters per chunk
  chunkOverlap: 20, // 20 chars overlap between chunks
});

const chunks = await splitter.createDocuments([markdownText]);

console.log("Total chunks:", chunks.length);
chunks.forEach((chunk, i) => {
  console.log(`\n--- Chunk ${i + 1} ---`);
  console.log(chunk.pageContent);
});
