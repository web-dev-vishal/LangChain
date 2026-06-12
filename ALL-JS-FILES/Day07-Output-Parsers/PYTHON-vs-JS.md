# Day 07 — Python vs JavaScript: Output Parsers

---

## stroutputparser.py → stroutputparser.js

**Python (manual, no parser, uses HuggingFace):**
```python
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
template1 = PromptTemplate(template='Write a detailed report on {topic}', input_variables=['topic'])
template2 = PromptTemplate(template='Write a 5 line summary on the following text. /n {text}', input_variables=['text'])

prompt1 = template1.invoke({'topic':'black hole'})
result = model.invoke(prompt1)
prompt2 = template2.invoke({'text':result.content})   # manually pass .content
result1 = model.invoke(prompt2)
print(result1.content)
```
**JavaScript (manual, same pattern):**
```js
const reportMessages = await reportPrompt.invoke({ topic: "black hole" });
const reportResponse = await model.invoke(reportMessages);
const reportText = reportResponse.content;    // manually extract .content
const summaryMessages = await summaryPrompt.invoke({ report: reportText });
const summaryResponse = await model.invoke(summaryMessages);
console.log(summaryResponse.content);
```

---

## stroutputparser1.py → stroutputparser1.js

**Python (with StrOutputParser, clean chain):**
```python
from langchain_core.output_parsers import StrOutputParser
parser = StrOutputParser()
chain = template1 | model | parser | template2 | model | parser
result = chain.invoke({'topic':'black hole'})
print(result)
```
**JavaScript (with StringOutputParser, clean chain):**
```js
import { StringOutputParser } from "@langchain/core/output_parsers";
const parser = new StringOutputParser();
const fullChain = reportPrompt
  .pipe(model)
  .pipe(parser)
  .pipe((text) => ({ report: text }))   // JS needs explicit mapping
  .pipe(summaryPrompt)
  .pipe(model)
  .pipe(parser);
const result = await fullChain.invoke({ topic: "black hole" });
```
**Key difference:** Python `|` operator vs JS `.pipe()` method. Python PromptTemplate accepts strings directly; JS needs `(text) => ({ key: text })` mapping step.

---

## jsonoutputparser.py → jsonoutputparser.js

**Python (uses HuggingFace):**
```python
from langchain_core.output_parsers import JsonOutputParser
parser = JsonOutputParser()
template = PromptTemplate(
    template='Give me 5 facts about {topic} \n {format_instruction}',
    input_variables=['topic'],
    partial_variables={'format_instruction': parser.get_format_instructions()}
)
chain = template | model | parser
result = chain.invoke({'topic':'black hole'})
```
**JavaScript:**
```js
import { JsonOutputParser } from "@langchain/core/output_parsers";
const parser = new JsonOutputParser();
// partial_variables → await prompt.partial({})
const partialPrompt = await prompt.partial({ format_instructions: formatInstructions });
const chain = partialPrompt.pipe(model).pipe(parser);
const result = await chain.invoke({ query: "Tell me about Tom Hanks" });
```
**Key difference:** `partial_variables={}` in Python → `await prompt.partial({})` in JS

---

## pydanticoutputparser.py → pydanticoutputparser.js

**Python (PydanticOutputParser):**
```python
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field

class Person(BaseModel):
    name: str = Field(description='Name of the person')
    age: int = Field(gt=18, description='Age of the person')
    city: str = Field(description='Name of the city')

parser = PydanticOutputParser(pydantic_object=Person)
template = PromptTemplate(
    template='Generate the name, age and city of a fictional {place} person \n {format_instruction}',
    partial_variables={'format_instruction': parser.get_format_instructions()}
)
chain = template | model | parser
result = chain.invoke({'place': 'sri lankan'})
print(result)  # result is a Person Pydantic instance
```
**JavaScript (withStructuredOutput + Zod):**
```js
import { z } from "zod";
const PersonSchema = z.object({
  name: z.string().describe("Name of the person"),
  age: z.number().int().describe("Age of the person"),
  city: z.string().describe("Name of the city"),
});
const structuredModel = model.withStructuredOutput(PersonSchema);
const chain = prompt.pipe(structuredModel);
const result = await chain.invoke({ place: "sri lankan" });
// result is a plain validated JS object, not a class instance
```
**Key difference:** Python uses `PydanticOutputParser` class. JS uses `model.withStructuredOutput(zodSchema)` — simpler and more direct.

---

## structuredoutputparser.py → structuredoutputparser.js

**Python (ResponseSchema + StructuredOutputParser):**
```python
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
schema = [
    ResponseSchema(name='fact_1', description='Fact 1 about the topic'),
    ResponseSchema(name='fact_2', description='Fact 2 about the topic'),
    ResponseSchema(name='fact_3', description='Fact 3 about the topic'),
]
parser = StructuredOutputParser.from_response_schemas(schema)
template = PromptTemplate(
    template='Give 3 fact about {topic} \n {format_instruction}',
    partial_variables={'format_instruction': parser.get_format_instructions()}
)
chain = template | model | parser
result = chain.invoke({'topic':'black hole'})
```
**JavaScript (StructuredOutputParser.fromZodSchema):**
```js
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    answer: z.string().describe("Answer to the user's question"),
    source: z.string().describe("Source of the answer"),
    confidence: z.string().describe("high, medium, or low"),
    follow_up_questions: z.array(z.string()),
  })
);
const formatInstructions = parser.getFormatInstructions();
const chain = partialPrompt.pipe(model).pipe(parser);
```
**Key difference:** `ResponseSchema` list → Zod object schema | `from_response_schemas()` → `fromZodSchema()`
