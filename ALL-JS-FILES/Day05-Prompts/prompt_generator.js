// ============================================================
// FILE: prompt_generator.js
// WHAT IT DOES: Creates a prompt template and saves it to a JSON file.
// WHY: You can save prompt templates so other files can load and reuse them.
//      Like saving a Word template to use later.
// ============================================================

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PromptTemplate } from "@langchain/core/prompts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a prompt template for summarizing research papers
// {paper_title}, {style}, {length}, {paper_content} are the fill-in blanks
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

// Save the template to a JSON file so other files can load it
const templateData = {
  input_variables: template.inputVariables, // list of {placeholders}
  template: template.template,             // the actual template text
  template_format: "f-string",
  output_parser: null,
};

const savePath = path.join(__dirname, "template.json");
fs.writeFileSync(savePath, JSON.stringify(templateData, null, 2), "utf-8");

console.log("Template saved to template.json");
console.log("Input variables:", template.inputVariables); // shows what blanks need to be filled
console.log("\nTemplate preview:");
console.log(template.template.substring(0, 200) + "...");
