// ============================================================
// FILE: stock_market_enrichment.js
// PROJECT: Enriching Stock Market Data using OpenAI API
// WHAT IT DOES: Takes a list of companies, asks AI to classify their sector
//               and write an investment recommendation for each one.
// WHY: Shows how to use AI in a batch data processing pipeline —
//      AI "enriches" boring data with intelligent analysis.
// HOW TO RUN: node stock_market_enrichment.js
// ============================================================

import "dotenv/config";
import OpenAI from "openai"; // using OpenAI SDK directly (no LangChain)

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ============================================
// SAMPLE DATA: 10 Nasdaq-100 California Companies
// ============================================
const nasdaq100CaCompanies = [
  { ticker: "AAPL", name: "Apple Inc.", market_cap_b: 2900 },
  { ticker: "GOOGL", name: "Alphabet Inc.", market_cap_b: 1800 },
  { ticker: "META", name: "Meta Platforms Inc.", market_cap_b: 1200 },
  { ticker: "NVDA", name: "NVIDIA Corporation", market_cap_b: 2200 },
  { ticker: "NFLX", name: "Netflix Inc.", market_cap_b: 250 },
  { ticker: "ADBE", name: "Adobe Inc.", market_cap_b: 220 },
  { ticker: "INTC", name: "Intel Corporation", market_cap_b: 130 },
  { ticker: "AMAT", name: "Applied Materials Inc.", market_cap_b: 140 },
  { ticker: "LRCX", name: "Lam Research Corporation", market_cap_b: 100 },
  { ticker: "KLAC", name: "KLA Corporation", market_cap_b: 90 },
];

// ============================================
// FUNCTION 1: Classify company into a sector
// ============================================
async function classifyIntoSector(company) {
  const prompt = `Classify the following company into ONE of these sectors:
  Technology, Semiconductors, Software, Entertainment/Media, E-commerce, Healthcare, Finance.
  
  Company: ${company.name} (${company.ticker})
  
  Return ONLY the sector name, nothing else.`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 20,  // we only need a short answer (just the sector name)
    temperature: 0,  // 0 = no randomness → always same answer
  });

  return response.choices[0].message.content.trim(); // e.g. "Technology"
}

// ============================================
// FUNCTION 2: Generate an investment recommendation
// ============================================
async function generateRecommendation(company, sector) {
  const prompt = `You are a financial analyst. Provide a brief investment recommendation (2-3 sentences) for:
  
  Company: ${company.name} (${company.ticker})
  Sector: ${sector}
  Market Cap: ~$${company.market_cap_b}B
  
  Keep it concise and professional. Include a Buy/Hold/Sell rating.`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 100, // short recommendation
    temperature: 0.7, // slight creativity for the recommendation text
  });

  return response.choices[0].message.content.trim();
}

// ============================================
// MAIN: Process all companies
// ============================================
console.log("Enriching Nasdaq-100 California Companies...\n");
console.log("=".repeat(80));

const enrichedData = [];

// Loop through each company and enrich it with sector + recommendation
for (const company of nasdaq100CaCompanies) {
  process.stdout.write(`Processing ${company.ticker}... `); // show progress

  const sector = await classifyIntoSector(company);
  const recommendation = await generateRecommendation(company, sector);

  enrichedData.push({ ...company, sector, recommendation });
  console.log(`✓ (${sector})`); // show sector it was classified into
}

// ============================================
// DISPLAY RESULTS
// ============================================
console.log("\n" + "=".repeat(80));
console.log("ENRICHED STOCK DATA");
console.log("=".repeat(80));

enrichedData.forEach((stock) => {
  console.log(`\n📈 ${stock.ticker} — ${stock.name}`);
  console.log(`   Sector: ${stock.sector}`);
  console.log(`   Market Cap: ~$${stock.market_cap_b}B`);
  console.log(`   Recommendation: ${stock.recommendation}`);
});

// Group companies by sector
console.log("\n" + "=".repeat(80));
console.log("COMPANIES BY SECTOR");
console.log("=".repeat(80));

const bySector = enrichedData.reduce((acc, stock) => {
  acc[stock.sector] = acc[stock.sector] ?? [];
  acc[stock.sector].push(stock.ticker);
  return acc;
}, {});

Object.entries(bySector).forEach(([sector, tickers]) => {
  console.log(`\n${sector}: ${tickers.join(", ")}`);
});
