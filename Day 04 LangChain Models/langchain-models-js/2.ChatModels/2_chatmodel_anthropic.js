/**
 * Day 04 - ChatModel with Anthropic (Claude)
 * Python equivalent: 2_chatmodel_anthropic.py
 */

import "dotenv/config";
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatAnthropic({
  model: "claude-3-5-sonnet-20241022",
  temperature: 0.7,
});

const result = await model.invoke([new HumanMessage("What is the capital of France?")]);

console.log("Anthropic Result:", result.content);
