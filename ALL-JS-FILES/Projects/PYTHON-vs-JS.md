# Projects — Python vs JavaScript

---

## Project 1: Stock Market Data Enrichment

**Python (Enriching Stock Market Data using the OpenAI API.ipynb):**
```python
from openai import OpenAI
import pandas as pd

client = OpenAI()

# Load companies from CSV
df = pd.read_csv('nasdaq_companies.csv')

def classify_sector(company_name, ticker):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": f"Classify {company_name} ({ticker}) into a sector. Return only sector name."}],
        max_tokens=20,
        temperature=0
    )
    return response.choices[0].message.content.strip()

def generate_recommendation(company_name, ticker, sector, market_cap):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": f"Give a 2-3 sentence investment recommendation for {company_name} ({ticker}), sector: {sector}, market cap: ${market_cap}B. Include Buy/Hold/Sell."}],
        max_tokens=100,
        temperature=0.7
    )
    return response.choices[0].message.content.strip()

# Process all companies
for _, row in df.iterrows():
    sector = classify_sector(row['name'], row['ticker'])
    recommendation = generate_recommendation(row['name'], row['ticker'], sector, row['market_cap_b'])
    print(f"{row['ticker']}: {sector} | {recommendation}")
```

**JavaScript (stock_market_enrichment.js):**
```js
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Data defined inline (no pandas/CSV needed for demo)
const companies = [
  { ticker: "AAPL", name: "Apple Inc.", market_cap_b: 2900 },
  // ...
];

async function classifyIntoSector(company) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: `Classify ${company.name} into a sector. Return only the sector name.` }],
    max_tokens: 20,
    temperature: 0,
  });
  return response.choices[0].message.content.trim();
}

for (const company of companies) {
  const sector = await classifyIntoSector(company);
  const recommendation = await generateRecommendation(company, sector);
  console.log(`${company.ticker}: ${sector}`);
}
```

**Key differences:**
- Python uses `pandas` DataFrame for data. JS uses a plain array of objects.
- Python iterates with `df.iterrows()`. JS uses `for...of` loop.
- Both use `openai` SDK directly (not LangChain).

---

## Project 2: Paris Trip Planner

**Python (Planning a Trip to Paris with the OpenAI API.ipynb):**
```python
from openai import OpenAI

client = OpenAI()

conversation_history = [
    {"role": "system", "content": "You are an expert Paris travel guide..."}
]

def chat(user_message):
    conversation_history.append({"role": "user", "content": user_message})
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=conversation_history,
        max_tokens=200,
        temperature=0.8
    )
    
    assistant_message = response.choices[0].message.content
    conversation_history.append({"role": "assistant", "content": assistant_message})
    return assistant_message

# Ask questions
print(chat("What are the must-see attractions in Paris?"))
print(chat("What are the best neighborhoods to stay?"))
print(chat("What Parisian foods must I try?"))
```

**JavaScript (paris_trip_planner.js):**
```js
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const conversationHistory = [
  { role: "system", content: "You are an expert Paris travel guide..." }
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

console.log(await chat("What are the must-see attractions in Paris?"));
```

**The Python and JS code are nearly identical** — same API structure, same conversation logic. Main difference is `async/await` in JS.

---

## Python vs JS: OpenAI SDK Comparison

| Python | JavaScript |
|--------|-----------|
| `from openai import OpenAI` | `import OpenAI from "openai"` |
| `client = OpenAI()` | `const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })` |
| `client.chat.completions.create(...)` | `await client.chat.completions.create(...)` |
| `response.choices[0].message.content` | `response.choices[0].message.content` (identical!) |
| `conversation_history.append({...})` | `conversationHistory.push({...})` |
| `for _, row in df.iterrows()` | `for (const item of items)` |
