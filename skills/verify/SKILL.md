---
name: verify
description: Evidence gate before any completion claim. Use before saying done, fixed, passing, working or shipped, before a commit, PR or handoff, and when a subagent reports success.
---

# Verify

**Evidence before claims.** A claim about state needs output produced in this turn.

## Use the project's check first

Verification is what makes parallel agents safe, and every agent should prove work the same way. When the project has a `verify-<app>` skill or one documented verify command (in `AGENTS.md`, `package.json` scripts, a Makefile), use it. When it has neither and the project will see repeated agent work, offer `/create-verification-skill` once.

## Gate

1. **Name the proof.** Which command or observation proves the claim? Use the real artifact, not a proxy: the app running, the page rendered, the message delivered. "It compiles" proves only that it compiles.
2. **Run it fresh and in full.** Read the whole output and the exit code. Count the failures.
3. **Compare.** Does the output show the claim? If yes, state the claim with the evidence. If no, state the actual status with the evidence.
4. **Report** what now works, how the user can see it, and anything not verified, labelled as such.

Done when every claim in the reply points at output from this turn, or is labelled unverified.

## What counts

| Claim | Proof | Not proof |
|---|---|---|
| Tests pass | Test run with 0 failures | An earlier run, "should pass" |
| Build works | Build exit 0 | Lint passing |
| Bug fixed | The original symptom no longer reproduces | Code changed |
| Agent finished | The diff or file exists and you read it | The agent's own report |
| Requirement met | Each line of the request checked off | Tests passing |
| Number improved | Before and after on the same setup, cause explained | One run |
| UI works | Screenshot or browser check of the flow | The component renders in a test |

## Numbers

Before trusting a measured number (speedup, latency, eval score), find what limits it and rule out that it measured something else: warm cache, a different input, noise. Report the spread, not one run.

## Unattended work

Long or unattended runs leave a trail the user can audit: commands run, outputs, decisions with reasons (in your progress tool or a log file). A check the user could run themselves is one you run first.

## Signals to stop and run the check

"Should", "probably" or "seems to" in your draft. Satisfaction before evidence. Trusting a report you did not verify. Wanting the task to be over.
