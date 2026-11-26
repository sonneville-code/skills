---
name: review-window
description: One batched check-in across all running agents. Collects status, merges decisions into one form, and returns the user to focus.
disable-model-invocation: true
---

# Review window

The user checks agents at set times instead of watching them. This skill makes each check-in one screen and one reply.

## Steps

1. **Collect.** List running and idle agents (`paseo ls`, or your harness's agent list), plus native subagents of this session. For each, read its last report or the tail of its log, and its progress tracker if it keeps one.
2. **Reduce each agent to three lines**: DONE (with evidence), BLOCKED, NEED FROM USER. Mark claims you did not verify.
3. **Show one view.** If the harness renders rich blocks, use a table (agent, state, done, blocked) and one form holding every NEED FROM USER item as one field each, recommendation pre-selected, plus a free-text field. Otherwise a short list and numbered questions.
4. **Act on the reply.** Send each answer to its agent. Retire agents whose work is verified and done.
5. **Close** with the time of the next suggested window (30 to 45 minutes) and the user's current focus task in one line.

Done when every agent has an answer, nothing pending, or is retired, and the user has one line saying what to do next.
