// ============================================================
// FILE: prompt_ui.js
// WHAT IT DOES: Creates a web page where you can summarize research papers.
// WHY: Shows how to turn a LangChain chain into a real web app using Express.js.
//      Open http://localhost:3000 in your browser after running this file.
// HOW TO RUN: node prompt_ui.js
// ============================================================

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express"; // web server library
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // allow JSON in request body

// Load the saved template from template.json (created by prompt_generator.js)
function loadTemplate() {
  const templatePath = path.join(__dirname, "template.json");
  if (!fs.existsSync(templatePath)) {
    throw new Error("template.json not found. Run prompt_generator.js first.");
  }
  const data = JSON.parse(fs.readFileSync(templatePath, "utf-8"));
  return PromptTemplate.fromTemplate(data.template);
}

// --- GET / → Show the HTML form ---
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Research Paper Summarizer</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    label { display: block; margin: 12px 0 4px; font-weight: bold; }
    select, textarea { width: 100%; padding: 8px; margin-bottom: 8px; }
    button { padding: 10px 24px; background: #0066cc; color: white; border: none; cursor: pointer; border-radius: 4px; }
    button:hover { background: #0052a3; }
    #result { margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 4px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>Research Paper Summarizer</h1>
  <form id="form">
    <label>Paper Title</label>
    <input type="text" name="paper_title" value="Attention Is All You Need" style="width:100%;padding:8px">

    <label>Summary Style</label>
    <select name="style">
      <option>simple</option>
      <option>technical</option>
      <option>executive</option>
      <option>bullet-point</option>
    </select>

    <label>Summary Length (words)</label>
    <select name="length">
      <option value="50">50</option>
      <option value="100" selected>100</option>
      <option value="200">200</option>
      <option value="300">300</option>
    </select>

    <label>Paper Content (paste abstract or full text)</label>
    <textarea name="paper_content" rows="8">The Transformer model was introduced in the paper "Attention Is All You Need" (Vaswani et al., 2017). It uses self-attention mechanisms to process sequences in parallel, eliminating the need for recurrent networks. The model achieved state-of-the-art results on machine translation tasks and became the foundation for models like BERT and GPT.</textarea>

    <br>
    <button type="submit">Generate Summary</button>
  </form>

  <div id="result" style="display:none"></div>

  <script>
    // When the form is submitted, send data to /summarize and show the result
    document.getElementById('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const resultDiv = document.getElementById('result');
      resultDiv.style.display = 'block';
      resultDiv.textContent = 'Generating summary...';

      const formData = new FormData(e.target);
      const body = Object.fromEntries(formData.entries());

      const res = await fetch('/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      resultDiv.textContent = data.summary || data.error;
    });
  </script>
</body>
</html>
  `);
});

// --- POST /summarize → Run the LangChain chain and return summary ---
app.post("/summarize", async (req, res) => {
  try {
    const { paper_title, style, length, paper_content } = req.body;

    // Load template, build chain, run it
    const template = loadTemplate();
    const model = new ChatOpenAI({ model: "gpt-4o-mini" });
    const parser = new StringOutputParser();
    const chain = template.pipe(model).pipe(parser);

    const summary = await chain.invoke({ paper_title, style, length, paper_content });
    res.json({ summary }); // send result back as JSON
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Start the web server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Research Paper Summarizer running at http://localhost:${PORT}`);
});
