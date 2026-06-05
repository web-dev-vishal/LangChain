// ============================================================
// FILE: paris_trip_planner.js
// PROJECT: Planning a Trip to Paris with OpenAI API
// WHAT IT DOES: A Paris travel guide chatbot. Ask it anything about Paris!
// WHY: Real project showing how to use OpenAI API directly (without LangChain)
//      to build a multi-turn conversational chatbot with a custom persona.
// HOW TO RUN: node paris_trip_planner.js
// ============================================================

import "dotenv/config";
import OpenAI from "openai"; // using OpenAI SDK directly (no LangChain)
import readline from "readline";

// Connect to OpenAI using your API key from .env
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ============================================
// CONVERSATION HISTORY (AI memory)
// ============================================
// conversationHistory keeps ALL messages so the AI remembers context
const conversationHistory = [
  {
    role: "system",
    content: `You are an expert Paris travel guide with deep knowledge of the city's history, 
    culture, cuisine, and attractions. You provide personalized, practical travel advice 
    and recommendations. You are enthusiastic about Paris and make travel planning exciting.
    Keep responses concise (3-5 sentences) but informative.`,
    // ↑ This tells the AI to act like a Paris tour guide
  },
];

// ============================================
// CHAT FUNCTION — sends a message, gets a reply
// ============================================
async function chat(userMessage) {
  // Add user's message to history
  conversationHistory.push({ role: "user", content: userMessage });

  // Send the full history to OpenAI (so AI knows context)
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: conversationHistory,
    max_tokens: 200,   // keep replies short
    temperature: 0.8,  // slightly creative
  });

  const assistantMessage = response.choices[0].message.content;

  // Add AI's reply to history for next turn
  conversationHistory.push({ role: "assistant", content: assistantMessage });

  return assistantMessage;
}

// ============================================
// AUTO-DEMO: 3 pre-set tourist questions
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

  // Summary of the conversation
  console.log("\n\n=== Conversation Summary ===");
  console.log(`Total turns: ${Math.floor((conversationHistory.length - 1) / 2)}`);
  console.log(`Messages in history: ${conversationHistory.length}`);
}

// ============================================
// INTERACTIVE MODE — keep chatting after the demo
// ============================================
async function runInteractive() {
  await runDemo(); // first show the 3 demo questions

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

// Start the chatbot
await runInteractive();
