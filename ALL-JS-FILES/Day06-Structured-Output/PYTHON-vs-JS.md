# Day 06 — Python vs JavaScript: Structured Output

---

## pydantic_demo.py → pydantic_demo.js (Zod)

**Python (Pydantic):**
```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class Student(BaseModel):
    name: str = 'nitish'
    age: Optional[int] = None
    email: EmailStr
    cgpa: float = Field(gt=0, lt=10, default=5, description='cgpa of the student')

new_student = {'age':'32', 'email':'abc@gmail.com'}
student = Student(**new_student)     # validates + coerces types
student_dict = dict(student)
student_json = student.model_dump_json()
```
**JavaScript (Zod — direct equivalent of Pydantic):**
```js
import { z } from "zod";
const PersonSchema = z.object({
  name: z.string().min(1),
  age: z.coerce.number(),           // coerces "32" → 32 (same as Pydantic)
  email: z.string().email(),
  score: z.number().min(0).max(100).default(0),
});
const student = PersonSchema.parse({ age: "32", email: "abc@gmail.com", name: "nitish" });
const json = JSON.stringify(student);
```
**Key mapping:** `BaseModel` → `z.object()` | `Field(gt=0)` → `z.number().positive()` | `model_dump_json()` → `JSON.stringify()`

---

## typeddict_demo.py → typeddict_demo.js

**Python (TypedDict — no runtime validation):**
```python
from typing import TypedDict
class Person(TypedDict):
    name: str
    age: int
new_person: Person = {'name':'nitish', 'age':'35'}  # no error even though age is string!
print(new_person)
```
**JavaScript (JSDoc — same: documentation only, no runtime validation):**
```js
/** @typedef {Object} Person
 * @property {string} name
 * @property {number} age
 */
/** @type {Person} */
const newPerson = { name: "nitish", age: "35" };  // also no error!
console.log(newPerson);
```
**Both Python TypedDict and JS JSDoc only document types, they don't enforce them. Use Pydantic/Zod for enforcement.**

---

## with_structured_output_json.py → with_structured_output_json.js

**Python:**
```python
from langchain_openai import ChatOpenAI
json_schema = {
  "title": "Review",
  "type": "object",
  "properties": {
    "key_themes": { "type": "array", "items": {"type": "string"} },
    "summary": { "type": "string" },
    "sentiment": { "type": "string", "enum": ["pos", "neg"] },
    "pros": { "type": ["array", "null"], "items": {"type": "string"} },
    "cons": { "type": ["array", "null"], "items": {"type": "string"} },
    "name": { "type": ["string", "null"] }
  },
  "required": ["key_themes", "summary", "sentiment"]
}
structured_model = model.with_structured_output(json_schema)
result = structured_model.invoke("review text here...")
```
**JavaScript:**
```js
import { ChatOpenAI } from "@langchain/openai";
const reviewSchema = { /* same JSON schema object */ };
const structuredModel = model.withStructuredOutput(reviewSchema);  // note: withStructuredOutput not with_structured_output
const result = await structuredModel.invoke("review text here...");
```
**Key difference:** `.with_structured_output()` (Python) → `.withStructuredOutput()` (JS camelCase)

---

## with_structured_output_pydantic.py → with_structured_output_zod.js

**Python (Pydantic BaseModel):**
```python
from pydantic import BaseModel, Field
from typing import Optional, Literal

class Review(BaseModel):
    key_themes: list[str] = Field(description="Key themes in the review")
    summary: str = Field(description="Brief summary")
    sentiment: Literal["pos", "neg"] = Field(description="Sentiment")
    pros: Optional[list[str]] = Field(default=None)
    cons: Optional[list[str]] = Field(default=None)
    name: Optional[str] = Field(default=None)

structured_model = model.with_structured_output(Review)
result = structured_model.invoke("review...")
print(result.name)   # result is a Review instance
```
**JavaScript (Zod — exact equivalent):**
```js
import { z } from "zod";
const ReviewSchema = z.object({
  key_themes: z.array(z.string()).describe("Key themes in the review"),
  summary: z.string().describe("Brief summary"),
  sentiment: z.enum(["pos", "neg"]).describe("Sentiment"),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  name: z.string().optional(),
});
const structuredModel = model.withStructuredOutput(ReviewSchema);
const result = await structuredModel.invoke("review...");
console.log(result.name);   // result is a plain validated JS object
```

---

## with_structured_output_typeddict.py → with_structured_output_typeddict.js

**Python (TypedDict + Annotated):**
```python
from typing import TypedDict, Annotated, Optional, Literal
class Review(TypedDict):
    key_themes: Annotated[list[str], "Write down all the key themes"]
    sentiment: Annotated[Literal["pos", "neg"], "Return sentiment"]
    name: Annotated[Optional[str], "Write the name of the reviewer"]

structured_model = model.with_structured_output(Review)
result = structured_model.invoke("review...")
print(result['name'])   # access like a dict
```
**JavaScript (plain JSON Schema object):**
```js
const schema = {
  title: "Review",
  type: "object",
  properties: {
    key_themes: { type: "array", items: { type: "string" }, description: "Write down all the key themes" },
    sentiment: { type: "string", description: "Return sentiment" },
    name: { type: "string", description: "Write the name of the reviewer" },
  },
};
const structuredModel = model.withStructuredOutput(schema);
const result = await structuredModel.invoke("review...");
console.log(result["name"]);   // access like a dict — same as Python TypedDict
```

---

## with_structured_output_llama.py → (no direct JS equivalent file)

**Python (HuggingFace + Pydantic):**
```python
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from pydantic import BaseModel

llm = HuggingFaceEndpoint(repo_id="TinyLlama/TinyLlama-1.1B-Chat-v1.0", task="text-generation")
model = ChatHuggingFace(llm=llm)
structured_model = model.with_structured_output(Review)  # Review is a Pydantic model
```
**JavaScript equivalent (Zod + HuggingFace):**
```js
import { ChatHuggingFace, HuggingFaceInference } from "@langchain/community/chat_models/huggingface";
const llm = new HuggingFaceInference({ model: "TinyLlama/TinyLlama-1.1B-Chat-v1.0" });
const model = new ChatHuggingFace({ llm });
// Note: not all HF models support structured output natively
// Use withStructuredOutput with a Zod schema:
const structuredModel = model.withStructuredOutput(ReviewZodSchema);
```

---

## json_schema.json (data file)
This file defines a JSON schema for validating student data. It is the same in both Python and JavaScript — plain JSON is universal.
```json
{
  "title": "student",
  "type": "object",
  "properties": { "name": "string", "age": "integer" },
  "required": ["name"]
}
```
