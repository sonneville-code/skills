---
name: brief
description: Delegation discipline for subagents and background agents. Use before spawning, briefing, handing off to or messaging another agent, and when planning parallel work across agents.
---

# Brief

The user runs several agents at once, and every switch between them costs attention. A good brief lets each agent finish without questions and report back in a form that reads in ten seconds.

## Before spawning

1. **Reuse first.** List agents (`paseo ls`, or your harness's agent list). An idle agent in the right project or worktree gets the task.
2. **Parallel only when disjoint and verifiable.** Spawn a second agent only when its files, branch and data do not overlap with running work, and its result can be checked without the user. Shared state gets one writer. Each parallel code agent works in its own git worktree, so agents never edit the same checkout.
3. **Cap at 3 active agents** that need the user. Queue the rest.
4. **Pick the route.** A quick sidecar that finishes this turn: a native subagent. Work that outlives the turn, needs another model or worktree, or should be visible to the user: a background agent in your orchestrator (for example Paseo). Work that belongs to another project goes to that project's agent. Never forward one project's data to another.

## The brief

Write it so a fresh agent with no chat history can finish:

```
Goal: <one sentence, the outcome, not the activity>
Context: <file paths and links, not pasted content>
Scope: <what to touch> / Out of scope: <what to leave>
Done when: <checkable condition, with the command that proves it; every agent on this project gets the same verify command or verify-<app> skill>
Constraints: <rules that apply: no deploys, no messages, package manager, branch>
Report back in this format:
  DONE: <what now works, with evidence>
  BLOCKED: <what stopped you, or "nothing">
  NEED FROM USER: <one decision or approval, or "nothing">
```

Add `Read the verify skill first.` as the first line, plus the val-mode skill when the momentum-adhd add-on is installed and the agent should follow the same working style.

## After the agent reports

1. **You own the result.** Read the diff or files yourself. Run `verify` on its claims.
2. **Follow-ups go to a fresh agent** with the original brief, the new directive and the prior report. Resume the same agent only when its checkout, uncommitted changes or running process matter.
3. **Retire agents** once their work is verified.
4. **Relay to the user** only the three report lines, merged across agents (`review-window`).
