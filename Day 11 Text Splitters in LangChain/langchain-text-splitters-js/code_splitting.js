/**
 * Day 11 - Code-Aware Text Splitting (JavaScript)
 * Python equivalent: python_code_splitting.py
 *
 * RecursiveCharacterTextSplitter.from_language(Language.PYTHON) in Python.
 * JS equivalent: use RecursiveCharacterTextSplitter with JS/Python separators.
 * Splits at class/function definition boundaries.
 */

import "dotenv/config";
import { RecursiveCharacterTextSplitter, SupportedTextSplitterLanguages } from "@langchain/textsplitters";

const jsCode = `/**
 * Utility functions for a simple task management app.
 */

class TaskManager {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  addTask(title, priority = "medium") {
    const task = {
      id: this.nextId++,
      title,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(task);
    return task;
  }

  completeTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new Error(\`Task \${id} not found\`);
    task.completed = true;
    return task;
  }

  getByPriority(priority) {
    return this.tasks.filter((t) => t.priority === priority && !t.completed);
  }
}

function sortTasksByPriority(tasks) {
  const order = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => order[a.priority] - order[b.priority]);
}

function formatTask(task) {
  const status = task.completed ? "✓" : "○";
  return \`[\${status}] [\${task.priority.toUpperCase()}] \${task.title}\`;
}

async function fetchTasksFromAPI(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(\`HTTP error: \${response.status}\`);
  return response.json();
}

export { TaskManager, sortTasksByPriority, formatTask, fetchTasksFromAPI };`;

// Code-aware splitter using JS language separators
const splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
  chunkSize: 300,
  chunkOverlap: 30,
});

const chunks = await splitter.createDocuments([jsCode]);

console.log("Total chunks:", chunks.length);
chunks.forEach((chunk, i) => {
  console.log(`\n--- Chunk ${i + 1} (${chunk.pageContent.length} chars) ---`);
  console.log(chunk.pageContent);
});

// Also show available languages
console.log("\n\nSupported Languages:", SupportedTextSplitterLanguages);
