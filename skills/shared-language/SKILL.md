---
name: shared-language
description: Build and keep the project's shared vocabulary in GLOSSARY.md, and record hard decisions as short ADRs. Use when naming domain concepts, when two words are used for one thing, when writing or editing GLOSSARY.md or an ADR, or during design talk about a codebase.
---

# Shared language

One agreed word replaces a sentence in every later chat, prompt and code name. Agents read faster, name things the same way, and spend fewer tokens explaining.

## During design talk

- **Challenge conflicts.** When a word clashes with `GLOSSARY.md`, say so at once: "The glossary defines cancellation as X. You seem to mean Y. Which one?"
- **Sharpen fuzzy words.** Propose one precise term for a vague or overloaded one: "Do you mean the Customer or the User? They differ."
- **Test with scenarios.** Invent concrete edge cases that force the boundary between two terms into the open.
- **Check the code.** When the user says how something works, check the code agrees, and point out a mismatch.
- **Write terms down as they settle**, not in a batch at the end.

## GLOSSARY.md

One file at the repo root. A repo with several separate areas gets a `GLOSSARY-MAP.md` that lists each area's glossary. Create it when the first term settles.

```md
# Ordering

What this area is, in one or two sentences.

## Language

**Order**:
A request from a **Customer** to buy one or more products.
_Avoid_: purchase, transaction
```

- Pick one word per concept, and list the rejected synonyms under `_Avoid_`.
- One or two sentences per term. Say what it is, not what it does.
- Bold other glossary terms inside a definition.
- Only terms specific to this project. No general programming words.
- No implementation details. It is a glossary, not a spec.

## ADRs

Offer an ADR only when all three hold: the decision is hard to reverse, a future reader would be surprised by it, and there was a real choice between options. Otherwise skip it.

Save as `docs/adr/0001-short-slug.md`, numbered one above the highest existing file. Create the folder when the first ADR is needed.

```md
# Use Postgres for the order store

Orders need multi-row transactions and the team already runs Postgres. We chose it over a document store, which would have needed hand-written consistency checks.
```

One paragraph is enough. Add status, rejected options or consequences only when they matter.
