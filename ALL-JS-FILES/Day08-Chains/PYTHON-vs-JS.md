# Day 08 — Python vs JavaScript: Chains

---

## simple_chain.py → simple_chain.js

**Python:**
```python
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = PromptTemplate(template='Generate 5 interesting facts about {topic}', input_variables=['topic'])
chain = prompt | model | parser     # Python uses | pipe operator
result = chain.invoke({'topic':'cricket'})
chain.get_graph().print_ascii()     # visualize the chain
```
**JavaScript:**
```js
import { ChatPromptTemplate } from "@langchain/core/prompts";
const prompt = ChatPromptTemplate.fromMessages([["human", "Generate 5 interesting facts about {topic}"]]);
const chain = prompt.pipe(model).pipe(parser);   // JS uses .pipe()
const result = await chain.invoke({ topic: "cricket" });
const graph = chain.getGraph();
console.log(graph.toString());
```
**Key mapping:** `|` → `.pipe()` | `chain.get_graph().print_ascii()` → `chain.getGraph().toString()`

---

## sequential_chain.py → sequential_chain.js

**Python:**
```python
prompt1 = PromptTemplate(template='Generate a detailed report on {topic}', input_variables=['topic'])
prompt2 = PromptTemplate(template='Generate a 5 pointer summary from the following text \n {text}', input_variables=['text'])
chain = prompt1 | model | parser | prompt2 | model | parser
result = chain.invoke({'topic': 'Unemployment in India'})
```
**JavaScript:**
```js
const chain = reportPrompt
  .pipe(model)
  .pipe(parser)
  .pipe((text) => ({ report: text }))   // ← this mapping step is needed in JS
  .pipe(summaryPrompt)
  .pipe(model)
  .pipe(parser);
const result = await chain.invoke({ topic: "Unemployment in India" });
```
**Key difference:** In Python, `StrOutputParser` output feeds directly into the next `PromptTemplate`. In JS you need an explicit `(text) => ({ key: text })` mapping step between prompts.

---

## parallel_chain.py → parallel_chain.js

**Python:**
```python
from langchain.schema.runnable import RunnableParallel
parallel_chain = RunnableParallel({
    'notes': prompt1 | model1 | parser,
    'quiz': prompt2 | model2 | parser
})
merge_chain = prompt3 | model1 | parser
chain = parallel_chain | merge_chain

text = "Support vector machines (SVMs)..."
result = chain.invoke({'text': text})
```
**JavaScript:**
```js
import { RunnableParallel } from "@langchain/core/runnables";
const parallelChain = new RunnableParallel({
  notes: notesChain,
  quiz: quizChain,
});
const fullChain = parallelChain
  .pipe((result) => ({ topic: "quantum computing", notes: result.notes, quiz: result.quiz }))
  .pipe(mergeChain);
const result = await fullChain.invoke({ topic: "quantum computing" });
```

---

## conditional_chain.py → conditional_chain.js

**Python (RunnableBranch + PydanticOutputParser):**
```python
from langchain.schema.runnable import RunnableBranch, RunnableLambda
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import Literal

class Feedback(BaseModel):
    sentiment: Literal['positive', 'negative'] = Field(description='Sentiment of the feedback')

parser2 = PydanticOutputParser(pydantic_object=Feedback)
classifier_chain = prompt1 | model | parser2

branch_chain = RunnableBranch(
    (lambda x: x.sentiment == 'positive', prompt2 | model | parser),
    (lambda x: x.sentiment == 'negative', prompt3 | model | parser),
    RunnableLambda(lambda x: "could not find sentiment")
)
chain = classifier_chain | branch_chain
print(chain.invoke({'feedback': 'This is a beautiful phone'}))
```
**JavaScript:**
```js
import { z } from "zod";
const SentimentSchema = z.object({
  sentiment: z.enum(["positive", "negative"]),
});
const classifierModel = model.withStructuredOutput(SentimentSchema);
const classifyChain = classifyPrompt.pipe(classifierModel);

// Manual branching with if/else (cleaner than RunnableBranch in JS)
const classification = await classifyChain.invoke({ feedback });
const response = classification.sentiment === "positive"
  ? await positiveChain.invoke({ feedback })
  : await negativeChain.invoke({ feedback });
```
**Key difference:** Python uses `RunnableBranch` with lambdas. JS uses simple `if/else` which is cleaner and easier to read.
