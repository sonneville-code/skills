---
name: grill
description: Relentless interview that pressure-tests a plan, design or decision until nothing is silently assumed. /grill, "grill me", "stress-test this".
disable-model-invocation: true
---

# Grill

An interview built on a design tree and frontier rounds. Answers come in one batched form, facts are never asked, and each round stays small. Look before you ask, and attack the intent.

## Method

Map the plan as a **design tree**: each decision branches into the decisions that hang off it. The **frontier** is every decision whose prerequisites are settled.

1. **Restate the intent** in one sentence and the smallest version that meets it. The user corrects it or says yes.
2. **Look before you ask.** Facts are your job: read files, run commands, search. Dispatch a subagent for slow lookups and ask the rest of the frontier meanwhile. Put only decisions and taste to the user.
3. **Ask the frontier in rounds of up to 5 questions.** Each question has your recommended answer, worded so "yes" accepts it. If the harness renders forms, use one form per round with recommendations pre-selected and a free-text field. Otherwise:

   ```
   Q1. <title>: <question, options if any>
   Recommended: <answer>
   ```

4. **Attack your own recommendations.** Before each round, name the premise each recommendation rests on and the cheapest way it could be wrong. Put the riskiest premise in the round.
5. **Recompute the frontier** after each answer set. A question that depends on an open question waits for a later round.
6. **Build the shared language as you go** when the plan touches a codebase. A new term you agree on goes in `GLOSSARY.md`, and a hard-to-reverse decision goes in an ADR. One agreed term replaces a sentence in every later chat and code name.
7. **Done** when the frontier is empty and the user confirms the summary: decisions made, assumptions still open, first concrete step. Act on nothing before that confirmation.

## Pairing

Open questions with many viable answers: run `diverge` first to widen the options, then grill the pick.
