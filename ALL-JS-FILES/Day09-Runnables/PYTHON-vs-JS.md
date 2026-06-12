# Day 09 — Python vs JavaScript: Runnables

---

## runnable_sequence.py → runnable_sequence.js

**Python:**
```python
from langchain.schema.runnable import RunnableSequence
chain = RunnableSequence(prompt1, model, parser, prompt2, model, parser)
print(chain.invoke({'topic':'AI'}))
```
**JavaScript:**
```js
import { RunnableSequence } from "@langchain/core/runnables";
const chain = RunnableSequence.from([
  prompt1, model, parser,
  (text) => ({ report: text }),   // mapping step needed in JS
  prompt2, model, parser,
]);
const result = await chain.invoke({ topic: "AI" });
```

---

## runnable_parallel.py → runnable_parallel.js

**Python:**
```python
from langchain.schema.runnable import RunnableParallel, RunnableSequence
parallel_chain = RunnableParallel({
    'tweet': RunnableSequence(prompt1, model, parser),
    'linkedin': RunnableSequence(prompt2, model, parser)
})
result = parallel_chain.invoke({'topic':'AI'})
print(result['tweet'])
print(result['linkedin'])
```
**JavaScript:**
```js
import { RunnableParallel } from "@langchain/core/runnables";
const parallelChain = new RunnableParallel({
  tweet: tweetPrompt.pipe(model).pipe(parser),
  linkedin: linkedinPrompt.pipe(model).pipe(parser),
});
const result = await parallelChain.invoke({ topic: "AI" });
console.log(result.tweet);
console.log(result.linkedin);
```

---

## runnable_passthrough.py → runnable_passthrough.js

**Python:**
```python
from langchain.schema.runnable import RunnableSequence, RunnableParallel, RunnablePassthrough

joke_gen_chain = RunnableSequence(prompt1, model, parser)

parallel_chain = RunnableParallel({
    'joke': RunnablePassthrough(),           # pass the joke text as-is
    'explanation': RunnableSequence(prompt2, model, parser)  # also explain it
})

final_chain = RunnableSequence(joke_gen_chain, parallel_chain)
print(final_chain.invoke({'topic':'cricket'}))
# result = { 'joke': '...', 'explanation': '...' }
```
**JavaScript:**
```js
import { RunnableParallel, RunnablePassthrough } from "@langchain/core/runnables";

const jokeChain = jokePrompt.pipe(model).pipe(parser);
const jokeResult = await jokeChain.invoke({ topic: "cricket" });
const explanation = await explainChain.invoke({ joke: jokeResult });
// RunnablePassthrough carries original value through unchanged
```
**What RunnablePassthrough does:** Imagine data flowing through a pipe. Passthrough = a "Y junction" that copies the data and passes the original unchanged alongside new data.

---

## runnable_lambda.py → runnable_lambda.js

**Python:**
```python
from langchain.schema.runnable import RunnableLambda, RunnableParallel, RunnablePassthrough

def word_count(text):
    return len(text.split())

joke_gen_chain = RunnableSequence(prompt, model, parser)
parallel_chain = RunnableParallel({
    'joke': RunnablePassthrough(),
    'word_count': RunnableLambda(word_count)   # wraps plain function
})
final_chain = RunnableSequence(joke_gen_chain, parallel_chain)
result = final_chain.invoke({'topic':'AI'})
print("{} \n word count - {}".format(result['joke'], result['word_count']))
```
**JavaScript:**
```js
import { RunnableLambda } from "@langchain/core/runnables";

function wordCount(text) {
  return `Word count: ${text.trim().split(/\s+/).length}\n\nOriginal:\n${text}`;
}
const wordCountRunnable = new RunnableLambda({ func: wordCount });
const chain = prompt.pipe(model).pipe(parser).pipe(wordCountRunnable);
const result = await chain.invoke({ topic: "AI" });
```
**Key mapping:** `RunnableLambda(my_function)` → `new RunnableLambda({ func: myFunction })`

---

## runnable_branch.py → runnable_branch.js

**Python:**
```python
from langchain.schema.runnable import RunnableSequence, RunnableBranch, RunnablePassthrough

report_gen_chain = prompt1 | model | parser

branch_chain = RunnableBranch(
    (lambda x: len(x.split()) > 300, prompt2 | model | parser),   # if > 300 words → summarize
    RunnablePassthrough()                                           # else → pass through
)

final_chain = RunnableSequence(report_gen_chain, branch_chain)
print(final_chain.invoke({'topic':'Russia vs Ukraine'}))
```
**JavaScript:**
```js
import { RunnableBranch, RunnableLambda } from "@langchain/core/runnables";

const conditionalChain = new RunnableBranch(
  [
    (text) => text.trim().split(/\s+/).length > 300,   // condition
    new RunnableLambda({                                // if true → summarize
      func: async (text) => {
        const summary = await summaryChain.invoke({ text });
        return `[SUMMARIZED]\n\n${summary}`;
      },
    }),
  ],
  new RunnableLambda({ func: (text) => `[SHORT]\n\n${text}` })  // default
);
```
**Key mapping:** `(lambda x: condition, runnable)` → `[(condition), new RunnableLambda({func})]`
