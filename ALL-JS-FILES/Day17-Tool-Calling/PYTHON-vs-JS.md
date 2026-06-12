# Day 17 — Python vs JavaScript: Tool Calling

---

## Python (from tool_calling_in_langchain.ipynb) vs JavaScript

**Python — Define Tools:**
```python
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

@tool
def get_conversion_factor(base_currency: str, target_currency: str) -> str:
    """Gets the conversion rate between two currencies."""
    rates = {"USD": 1.0, "EUR": 0.92, "GBP": 0.79, "JPY": 149.5}
    factor = rates[target_currency] / rates[base_currency]
    return str(factor)

@tool
def convert_currency(amount: float, conversion_factor: float) -> str:
    """Converts an amount using a conversion factor."""
    return str(amount * conversion_factor)

tools = [get_conversion_factor, convert_currency]
```

**JavaScript — Define Tools:**
```js
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const getConversionFactor = new DynamicStructuredTool({
  name: "get_conversion_factor",
  description: "Gets the conversion rate between two currencies.",
  schema: z.object({
    base_currency: z.string().describe("Source currency code"),
    target_currency: z.string().describe("Target currency code"),
  }),
  func: async ({ base_currency, target_currency }) => {
    const rates = { USD: 1.0, EUR: 0.92, GBP: 0.79, JPY: 149.5 };
    const factor = rates[target_currency] / rates[base_currency];
    return JSON.stringify({ factor: factor.toFixed(4) });
  },
});
const tools = [getConversionFactor, convertCurrency];
```
**Key difference:** Python uses `@tool` decorator on a function. JS uses `new DynamicStructuredTool({})`.

---

**Python — Bind tools and run:**
```python
model = ChatOpenAI(model="gpt-4o-mini")
model_with_tools = model.bind_tools(tools)

messages = [HumanMessage("What is 250 USD in EUR?")]

while True:
    response = model_with_tools.invoke(messages)
    messages.append(response)
    
    if not response.tool_calls:
        print(response.content)
        break
    
    for tool_call in response.tool_calls:
        tool_name = tool_call["name"]
        tool_args = tool_call["args"]
        tool_result = eval(f"{tool_name}({tool_args})")  # run the tool
        
        messages.append(ToolMessage(
            content=str(tool_result),
            tool_call_id=tool_call["id"]
        ))
```

**JavaScript — Bind tools and run:**
```js
const modelWithTools = model.bindTools(tools);   // bindTools (camelCase)
const messages = [new HumanMessage("What is 250 USD in EUR?")];

while (true) {
  const response = await modelWithTools.invoke(messages);
  messages.push(response);
  
  if (!response.tool_calls || response.tool_calls.length === 0) {
    console.log(response.content);
    break;
  }
  
  for (const toolCall of response.tool_calls) {
    const tool = toolMap[toolCall.name];
    const toolResult = await tool.invoke(toolCall.args);
    
    messages.push(new ToolMessage({
      content: toolResult,
      tool_call_id: toolCall.id
    }));
  }
}
```

---

## Key Mapping Table

| Python | JavaScript |
|--------|-----------|
| `@tool` decorator | `new DynamicStructuredTool({ name, description, schema, func })` |
| `model.bind_tools(tools)` | `model.bindTools(tools)` |
| `response.tool_calls[0]["name"]` | `response.tool_calls[0].name` |
| `response.tool_calls[0]["args"]` | `response.tool_calls[0].args` |
| `ToolMessage(content=..., tool_call_id=...)` | `new ToolMessage({ content, tool_call_id })` |
| `tool.invoke(args)` | `await tool.invoke(args)` |
