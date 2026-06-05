// ============================================================
// FILE: chatbot.js
// WHAT IT DOES: A simple chatbot you can talk to in the terminal.
// WHY: Shows how to keep a conversation going (with memory of past messages).
//      Type your message, press Enter, AI replies. Type "exit" to stop.
// ============================================================

import "dotenv/config";
import readline from "readline"; // built-in Node.js library to read keyboard input
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Create the AI model
const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });

// StringOutputParser extracts just the text from the AI's response
const parser = new StringOutputParser();

// chatHistory keeps ALL past messages so the AI remembers the conversation
// We start with a SystemMessage to tell the AI how to behave
const chatHistory = [
  new SystemMessage("You are a helpful and friendly AI assistant."),
];

// Set up keyboard input from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Chatbot started. Type "exit" or "quit" to stop.\n');

// This function runs in a loop — it asks you for input, then calls itself again
function askQuestion() {
  rl.question("You: ", async (userInput) => {
    const trimmed = userInput.trim();

    // Skip empty input
    if (!trimmed) {
      askQuestion();
      return;
    }

    // Stop if user types exit or quit
    if (["exit", "quit"].includes(trimmed.toLowerCase())) {
      console.log("Goodbye!");
      rl.close();
      return;
    }

    // Add the user's message to history
    chatHistory.push(new HumanMessage(trimmed));

    try {
      // Send the full history to the AI (so it remembers past messages)
      const response = await model.pipe(parser).invoke(chatHistory);

      // Add the AI's reply to history too
      chatHistory.push(new AIMessage(response));

      // Print the reply
      console.log(`AI: ${response}\n`);
    } catch (err) {
      console.error("Error:", err.message);
    }

    // Ask for the next message
    askQuestion();
  });
}

// Start the chatbot
askQuestion();
