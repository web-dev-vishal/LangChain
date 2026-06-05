/**
 * Day 05 - Prompt Generator — saves a PromptTemplate to JSON
 * Python equivalent: prompt_generator.py
 *
 * Generates a PromptTemplate for research paper summarization
 * and saves it as template.json (equivalent to Python's .save()).
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PromptTemplate } from "@langchain/core/prompts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define the prompt template
const template = PromptTemplate.fromTemplate(
  `You are an expert academic summarizer.

Summarize the following research paper titled "{paper_title}" in a {style} style.
The summary should be {length} words long.

Focus on:
- The main research question
- Key methodology
- Major findings
- Implications

Paper content:
{paper_content}`
);

// Serialize and save to JSON (equivalent to Python's template.save())
const templateData = {
  input_variables: template.inputVariables,
  template: template.template,
  template_format: "f-string",
  output_parser: null,
};

const savePath = path.join(__dirname, "template.json");
fs.writeFileSync(savePath, JSON.stringify(templateData, null, 2), "utf-8");

console.log("Template saved to template.json");
console.log("Input variables:", template.inputVariables);
console.log("\nTemplate preview:");
console.log(template.template.substring(0, 200) + "...");
