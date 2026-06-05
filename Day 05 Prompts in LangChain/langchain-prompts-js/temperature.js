/**
 * Day 05 - Temperature parameter effect on creativity
 * Python equivalent: temperature.py
 *
 * Runs the same prompt at different temperatures to show
 * how temperature controls randomness/creativity.
 */

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

const prompt = "Write a one-sentence creative tagline for a coffee shop.";

const temperatures = [0.0, 0.7, 1.5];

for (const temp of temperatures) {
  const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: temp });
  const result = await model.invoke([new HumanMessage(prompt)]);
  console.log(`Temperature ${temp}: ${result.content}`);
}
