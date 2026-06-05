// ============================================================
// FILE: temperature.js
// WHAT IT DOES: Runs the same prompt at 3 different temperature levels.
// WHY: Temperature controls how creative/random the AI is.
//      0.0 = always the same safe answer
//      0.7 = balanced
//      1.5 = very creative, random, sometimes weird
// ============================================================

import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

// Same question asked at 3 different creativity levels
const prompt = "Write a one-sentence creative tagline for a coffee shop.";

const temperatures = [0.0, 0.7, 1.5]; // low, medium, high

// Loop through each temperature and ask the AI
for (const temp of temperatures) {
  const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: temp });
  const result = await model.invoke([new HumanMessage(prompt)]);
  console.log(`Temperature ${temp}: ${result.content}`);
  // You'll notice: temp=0 gives same answer every time, temp=1.5 gives weird/fun answers
}
