// ============================================================
// FILE: prompt_template.js
// WHAT IT DOES: Creates a simple prompt template with blanks, fills it in, sends to AI.
// WHY: PromptTemplate lets you reuse the same prompt structure with different topics/questions.
// ============================================================

import "dotenv/config";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Create a template — {topic} and {question} are the fill-in blanks
const template = PromptTemplate.fromTemplate(
  "You are a helpful assistant. Answer the following question about {topic}.\n\nQuestion: {question}"
);

// Fill in the blanks — now the prompt becomes a complete sentence
const formattedPrompt = await template.invoke({
  topic: "astronomy",
  question: "What is a black hole?",
});

console.log("Formatted Prompt:");
console.log(formattedPrompt.toString());

// Now chain it: template → model → text output
const model = new ChatOpenAI({ model: "gpt-4o-mini" });
const parser = new StringOutputParser(); // extracts just the text from AI response

// pipe() connects them: template fills → AI processes → parser cleans output
const chain = template.pipe(model).pipe(parser);

const result = await chain.invoke({
  topic: "astronomy",
  question: "What is a black hole?",
});

console.log("\nLLM Response:", result);
