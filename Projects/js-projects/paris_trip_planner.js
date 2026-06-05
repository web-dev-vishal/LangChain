/**
 * Project 2 - Planning a Trip to Paris with OpenAI API
 * Python equivalent: Planning a Trip to Paris with the OpenAI API.ipynb
 *
 * Multi-turn chatbot with persistent conversation history.
 * Uses gpt-4o-mini with a travel assistant system persona.
 * Asks 3 Paris tourist questions and shows full conversation.
 */

import "dotenv/config";
import OpenAI from "openai";
import readline from "readline";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ============================================
// CHATBOT WITH PERSISTENT HISTORY
// ============================================
const conversationHistory = [
  {
    role: "system",
    content: `You are an expert Paris travel guide with deep knowledge of the city's history, 
    culture, cuisine, and attractions. You provide personalized, practical travel advice 
    and recommendations. You are enthusiastic about Paris and make travel planning exciting.
    Keep responses concise (3-5 sentences) but informative.`,
  },
];

async function chat(userMessage) {
  conversationHistory.push({ role: "user", content: userMessage });

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: conversationHistory,
    max_tokens: 200,
    temperature: 0.8,
  });

  const assistantMessage = response.choices[0].message.content;
  conversationHistory.push({ role: "assistant", content: assistantMessage });

  return assistantMessage;
}

// ============================================
// AUTO-DEMO: 3 Tourist Questions
// ============================================
async function runDemo() {
  console.log("🗼 Paris Trip Planner — AI Travel Assistant");
  console.log("=".repeat(60));

  const questions = [
    "What are the must-see attractions in Paris for a first-time visitor?",
    "What are the best neighborhoods to stay in Paris, and what is the typical cost per night?",
    "What are some authentic Parisian foods I must try, and where can I find them?",
  ];

  for (const question of questions) {
    console.log(`\nTourist: ${question}`);
    const answer = await chat(question);
    console.log(`\nGuide: ${answer}`);
    console.log("-".repeat(60));
  }

  // Show conversation history summary
  console.log("\n\n=== Conversation Summary ===");
  console.log(`Total turns: ${Math.floor((conversationHistory.length - 1) / 2)}`);
  console.log(`Messages in history: ${conversationHistory.length}`);
}

// ============================================
// INTERACTIVE MODE (if run directly)
// ============================================
async function runInteractive() {
  await runDemo();

  console.log('\n\n🎤 Continue chatting! Type "exit" to quit.\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  function askQuestion() {
    rl.question("You: ", async (input) => {
      const question = input.trim();
      if (!question) return askQuestion();
      if (["exit", "quit"].includes(question.toLowerCase())) {
        console.log("Bon voyage! 🗼");
        rl.close();
        return;
      }

      try {
        const answer = await chat(question);
        console.log(`\nGuide: ${answer}\n`);
      } catch (err) {
        console.error("Error:", err.message);
      }

      askQuestion();
    });
  }

  askQuestion();
}

await runInteractive();
