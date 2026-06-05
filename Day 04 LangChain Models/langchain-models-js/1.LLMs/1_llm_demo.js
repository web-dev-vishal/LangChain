/**
 * Day 04 - LLM Demo (Legacy LLM, not Chat Model)
 * Python equivalent: 1_llm_demo.py
 *
 * LLMs take a plain string prompt and return a plain string.
 * Note: OpenAI has deprecated standalone LLM completion in favour of Chat.
 * We use ChatOpenAI here since gpt-3.5-turbo-instruct is a completion model
 * but the JS SDK wraps it consistently via chat.
 */

import "dotenv/config";
import { OpenAI } from "@langchain/openai";

const llm = new OpenAI({
  model: "gpt-3.5-turbo-instruct",
  temperature: 0.7,
});

// LLMs take a raw string (unlike ChatModels which take messages)
const prompt = "What is the capital of France?";
const result = await llm.invoke(prompt);

console.log("LLM Result (string):", result);
