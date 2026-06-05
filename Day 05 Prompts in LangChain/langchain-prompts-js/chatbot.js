/**
 * Day 05 - Interactive CLI Chatbot with persistent in-memory history
 * Python equivalent: chatbot.py
 *
 * Runs a while-loop reading user input from stdin.
 * Type "exit" or "quit" to stop.
 */

import "dotenv/config";
import readline from "readline";
import { ChatOpenAI } from "@langchain/openai";
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
} from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0.7 });
const parser = new StringOutputParser();

const chatHistory = [
  new SystemMessage("You are a helpful and friendly AI assistant."),
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Chatbot started. Type "exit" or "quit" to stop.\n');

function askQuestion() {
  rl.question("You: ", async (userInput) => {
    const trimmed = userInput.trim();

    if (!trimmed) {
      askQuestion();
      return;
    }

    if (["exit", "quit"].includes(trimmed.toLowerCase())) {
      console.log("Goodbye!");
      rl.close();
      return;
    }

    chatHistory.push(new HumanMessage(trimmed));

    try {
      const response = await model.pipe(parser).invoke(chatHistory);
      chatHistory.push(new AIMessage(response));
      console.log(`AI: ${response}\n`);
    } catch (err) {
      console.error("Error:", err.message);
    }

    askQuestion();
  });
}

askQuestion();
