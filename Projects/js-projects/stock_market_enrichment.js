/**
 * Project 1 - Enriching Stock Market Data using OpenAI API
 * Python equivalent: Enriching Stock Market Data using the OpenAI API.ipynb
 *
 * Uses the OpenAI API directly (no LangChain) to:
 *   1. Classify Nasdaq-100 California-based companies into sectors
 *   2. Generate investment recommendations for each
 */

import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ============================================
// SAMPLE NASDAQ-100 CA COMPANIES
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
// CLASSIFY INTO SECTORS
// ============================================
async function classifyIntoSector(company) {
  const prompt = `Classify the following company into ONE of these sectors:
  Technology, Semiconductors, Software, Entertainment/Media, E-commerce, Healthcare, Finance.
  
  Company: ${company.name} (${company.ticker})
  
  Return ONLY the sector name, nothing else.`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 20,
    temperature: 0,
  });

  return response.choices[0].message.content.trim();
}

// ============================================
// GENERATE INVESTMENT RECOMMENDATION
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
    max_tokens: 100,
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
}

// ============================================
// ENRICH ALL COMPANIES
// ============================================
console.log("Enriching Nasdaq-100 California Companies...\n");
console.log("=".repeat(80));

const enrichedData = [];

for (const company of nasdaq100CaCompanies) {
  process.stdout.write(`Processing ${company.ticker}... `);

  const sector = await classifyIntoSector(company);
  const recommendation = await generateRecommendation(company, sector);

  enrichedData.push({ ...company, sector, recommendation });

  console.log(`✓ (${sector})`);
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

// Group by sector
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
