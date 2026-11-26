---
name: containment
description: Router for the containment skill pack. Names which skill fits the situation. /containment.
disable-model-invocation: true
---

# containment router

Answer with the one skill that fits, then run it. When two fit, run them in the order shown. Skills marked (add-on) come from the optional `containment-adhd` plugin. When it is not installed, skip them and use the next row that fits.

| Situation | Skill |
|---|---|
| Start of a work session | `/val-mode` or `/val-mode terse` (add-on) |
| Stuck, avoiding, overwhelmed | `first-step` (add-on) |
| Setting up or swapping tools, a new big idea | `scope-guard` (add-on) |
| Choosing an approach or a new build | `rd-method` |
| Wide brainstorm on a hard open design | `/diverge` |
| Pressure-test a plan | `/grill` |
| Implement a feature, refactor or plan | `build` |
| Something broken or slow | `debug` |
| Test-first work | `tdd` |
| About to say "done" | `verify` |
| Project has no scripted way to prove behavior | `/create-verification-skill`, later `/maintain-verification-skill` |
| Spawn or hand off to an agent | `brief` |
| Check on all running agents | `/review-window` |
| Commit as you go | `micro-commits` |
| Writing that leaves the chat | `unslop` |
| End of session, "anything left?" | `archive-audit` |
| Routing miss, wrong skill fired | `routing-tune` |
