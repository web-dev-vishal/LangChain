// ============================================================
// FILE: 2_chatmodel_anthropic.js
// WHAT IT DOES: Same as OpenAI chat but uses Anthropic's Claude model instead.
// WHY: Shows that LangChain works with different AI companies, not just OpenAI.
// ============================================================

import "dotenv/config";

// This time we import from Anthropic (Claude AI)
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage } from "@langchain/core/messages";

// Create a Claude model — same idea as GPT-4 but made by Anthropic
const model = new ChatAnthropic({
  model: "claude-3-5-sonnet-20241022",
  temperature: 0.7,
});

// Ask the same question
const result = await model.invoke([new HumanMessage("What is the capital of France?")]);

// Print only the text answer (result.content is the actual reply text)
console.log("Anthropic Result:", result.content);
