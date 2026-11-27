---
name: catch-up
description: Plain-language recap of what changed in this chat since the user last spoke, plus every decision waiting on them. Use for "catch me up", "where are we", "what happened", "I lost track", after a long autonomous run, or when the user returns from a break.
---

# Catch-up

The user stepped away, or the work moved faster than they could follow. Show them, on one screen, what changed for them and what they need to decide.

Keep this turn read-only. Change no files and post nothing.

## Gather

1. **Find the starting point**: the last message the user wrote before asking for the catch-up.
2. **Collect what happened since**: your own work, subagent reports, and messages from anyone else in the chat.
3. **Collect the calls waiting on the user.** A call is a step only they can take: a product choice, an approval, an irreversible action, access you lack. Include calls raised before their last message that are still open. For each call, note what it changes for users, the evidence behind your pick, the risk, and your pick. Write "unknown" for a fact you do not have.

## Write

1. **First sentence:** what waits on the user, or that nothing does. If nothing happened and nothing waits, say so and stop.
2. **What happened**, in under 100 words. One short bullet per thing the user asked for: what came of it, and whether it is done. Say what changed for the user, not how you did it: "the tests pass", not "CI is green". Leave out work that changed nothing for them.
3. **The calls**, about 30 words each. Name the call, give your pick, what it changes for users, the evidence, and the risk. For a choice between options, give each option what it gets and what it costs. Calls that share one decision share one bullet.
4. **One next action** the user can take in under two minutes.

## Voice

Use plain words and short sentences, the way one person catches up another. Use the project's own terms from `GLOSSARY.md` when one exists. If the harness renders rich blocks, a small table or picture can replace a paragraph, but never a status board.

## When the user says "wait, what?"

Re-pitch the last message: a little context first, then the point, in plain words and short sentences.
