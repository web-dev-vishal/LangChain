/**
 * Day 04 - ChatModel with OpenAI
 * Python equivalent: 1_chatmodel_openai.py
 *
 * ChatModels take a list of messages and return an AIMessage.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
  model: "gpt-4",
  temperature: 1.5,
  maxTokens: 10,
});

const result = await model.invoke([new HumanMessage("What is the capital of France?")]);

console.log("ChatModel Result:", result);
console.log("Content:", result.content);
