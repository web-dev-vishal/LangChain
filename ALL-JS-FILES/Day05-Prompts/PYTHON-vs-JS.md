# Day 05 — Python vs JavaScript: Prompts

---

## chatbot.py → chatbot.js

**Python:**
```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
model = ChatOpenAI()
chat_history = [SystemMessage(content='You are a helpful AI assistant')]
while True:
    user_input = input('You: ')
    chat_history.append(HumanMessage(content=user_input))
    if user_input == 'exit': break
    result = model.invoke(chat_history)
    chat_history.append(AIMessage(content=result.content))
    print("AI: ", result.content)
```
**JavaScript:**
```js
import readline from "readline";
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
// uses rl.question() in a recursive loop instead of Python's input()
```
**Key difference:** Python uses `input()` for terminal input. JS uses `readline` module.

---

## chat_prompt_template.py → chat_prompt_template.js

**Python:**
```python
from langchain_core.prompts import ChatPromptTemplate
chat_template = ChatPromptTemplate([
    ('system', 'You are a helpful {domain} expert'),
    ('human', 'Explain in simple terms, what is {topic}')
])
prompt = chat_template.invoke({'domain':'cricket','topic':'Dusra'})
```
**JavaScript:**
```js
import { ChatPromptTemplate } from "@langchain/core/prompts";
const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful {domain} expert"],
  ["human", "Explain in simple terms, what is {topic}"],
]);
const prompt = await chatPrompt.invoke({ domain: "cricket", topic: "Dusra" });
```
**Key difference:** Python constructor takes list directly. JS uses `.fromMessages()`.

---

## messages.py → messages.js

**Python:**
```python
messages = [
    SystemMessage(content='You are a helpful assistant'),
    HumanMessage(content='Tell me about LangChain')
]
result = model.invoke(messages)
messages.append(AIMessage(content=result.content))
```
**JavaScript:**
```js
const history = [new SystemMessage("You are a helpful assistant")];
history.push(new HumanMessage("Tell me about LangChain"));
const response = await model.invoke(history);
history.push(new AIMessage(response.content));
```
**Same logic, different syntax:** Python uses `content=` keyword arg; JS passes string directly.

---

## message_placeholder.py → message_placeholder.js

**Python:**
```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
chat_template = ChatPromptTemplate([
    ('system','You are a helpful customer support agent'),
    MessagesPlaceholder(variable_name='chat_history'),
    ('human','{query}')
])
with open('chat_history.txt') as f:
    chat_history.extend(f.readlines())
prompt = chat_template.invoke({'chat_history':chat_history, 'query':'Where is my refund'})
```
**JavaScript:**
```js
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful customer support agent"],
  new MessagesPlaceholder("chat_history"),
  ["human", "{query}"],
]);
// Read file with fs.readFileSync() instead of open()
const chain = prompt.pipe(model).pipe(parser);
```
**Key difference:** `MessagesPlaceholder(variable_name='x')` → `new MessagesPlaceholder("x")`

---

## prompt_generator.py → prompt_generator.js

**Python:**
```python
template = PromptTemplate(
    template="Please summarize the research paper...",
    input_variables=['paper_input', 'style_input','length_input'],
    validate_template=True
)
template.save('template.json')  # saves to JSON file
```
**JavaScript:**
```js
const template = PromptTemplate.fromTemplate("Please summarize...");
// No built-in .save() in JS, so we manually write to JSON:
fs.writeFileSync("template.json", JSON.stringify({ template: template.template, input_variables: template.inputVariables }));
```

---

## prompt_template.py → prompt_template.js

**Python:**
```python
template2 = PromptTemplate(
    template='Greet this person in 5 languages. The name of the person is {name}',
    input_variables=['name']
)
prompt = template2.invoke({'name':'nitish'})
result = model.invoke(prompt)
print(result.content)
```
**JavaScript:**
```js
const template = PromptTemplate.fromTemplate(
  "Greet this person in 5 languages. The name of the person is {name}"
);
const chain = template.pipe(model).pipe(parser);
const result = await chain.invoke({ name: "nitish" });
console.log(result);
```

---

## prompt_ui.py → prompt_ui.js

**Python uses Streamlit:**
```python
import streamlit as st
paper_input = st.selectbox("Select Research Paper Name", [...])
style_input = st.selectbox("Select Explanation Style", [...])
if st.button('Summarize'):
    chain = template | model
    result = chain.invoke({...})
    st.write(result.content)
```
**JavaScript uses Express.js:**
```js
import express from "express";
// HTML form served at GET /
// POST /summarize runs the chain and returns JSON
app.post("/summarize", async (req, res) => {
  const summary = await chain.invoke(req.body);
  res.json({ summary });
});
app.listen(3000);
```
**Key difference:** Python → Streamlit web UI. JavaScript → Express.js web server + HTML form.

---

## temperature.py → temperature.js

**Python:**
```python
model = ChatOpenAI(model='gpt-4', temperature=1.5)
result = model.invoke("Write a 5 line poem on cricket")
```
**JavaScript:**
```js
const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 1.5 });
const result = await model.invoke([new HumanMessage("Write a 5 line poem on cricket")]);
```
