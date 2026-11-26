---
name: build
description: Engineering workflow for code changes larger than a one-line fix. Use when implementing a feature, refactor, migration or multi-file change, or executing a spec, plan or set of tickets.
---

# Build

The steps are a default order, not a gate. Skip a step that does not fit the change and say so in one line. Each step points at a small skill that also works alone.

## Steps

1. **Goal and check.** Restate the goal, the smallest change that meets it, and how anyone will know it is done, in three lines. A new tool or product passes `scope-guard` first when the momentum-adhd add-on is installed.
2. **Know before you design.** Trace the affected code. Use the terms in `GLOSSARY.md` and respect ADRs. Ask only what changes the design: one batched question, or `grill` when decisions depend on each other.
3. **Name the data shape first.** Core types, state, and who writes what (Foundational Thinking, Model the Domain). A module boundary in question: prefer a few deep modules with simple interfaces over many shallow ones.
4. **Cut into verifiable units.** Each unit is one action that ends in a check: a test, a command, a screenshot. Order them so each check proves the next can start. Keep the units in your progress tool, not in a plan document. Work that spans sessions gets a written spec and a list of tickets in your tracker.
5. **Execute unit by unit.** Test-first where a cheap seam exists (`tdd`). A failure goes to `debug`. Independent units with disjoint files can go to subagents (`brief`): one git worktree per parallel code agent, the same verify command for all.
6. **Commit each verified unit** (`micro-commits`). Messages follow `unslop`.
7. **Finish.** Run `verify` on the whole change against the request, line by line, on the real app. Report what now works with evidence, the principles that changed a decision, and open decisions. Merge, push and PR wait for the user's go unless it was already given.

Done when every unit passed its check, the request is verified on the real artifact, and the report is sent.

## Principles

24 principles, one line each. The names work as steering words: when the user types one, apply it at once. Otherwise apply the ones whose trigger fits, and name each one that changed a decision.

**Core**
- **Laziness Protocol.** Bias to deletion and the smallest change that solves the problem.
- **Foundational Thinking.** Before logic: core types, data structures, what concurrent actors share.
- **Redesign from First Principles.** Treat a new requirement as if it had been there from day one.
- **Attack the Premise.** Two failed fixes on one premise: write the premise down and test it directly.
- **Subtract Before You Add.** Remove dead weight first, then build on the simpler base.
- **Minimize Reader Load.** Count layers and hidden state. Collapse one-caller wrappers.
- **Outcome-Oriented Execution.** In planned rewrites, converge on the target. No throwaway compatibility states.
- **Experience First.** User delight over implementation convenience. Fewer, polished features.
- **Exhaust the Design Space.** For a novel decision, build 2 or 3 competing prototypes and compare.
- **Build the Lever.** Build the script, codemod or generator that does or proves the work. A reviewer reruns it.

**Architecture**
- **Model the Domain.** Encode the domain in a structure (state machine, table, typed model), not scattered conditionals.
- **Boundary Discipline.** Guards at system edges. Trust internal types. Pure business logic.
- **Type System Discipline.** Make illegal states unrepresentable. Parse external data at boundaries.
- **Make Operations Idempotent.** Converge to the same end state after partial runs.
- **Migrate Callers Then Delete Legacy APIs.** One wave, no compatibility layer.
- **Separate Before Serializing Shared State.** Remove the sharing first. One writer only for a real invariant.

**Verification**
- **Prove It Works.** Check the real artifact, not a proxy or "it compiles" (`verify`).
- **Fix Root Causes.** Fix where the system first went wrong (`debug`).
- **Sequence Verifiable Units.** Small units, each checked before the next.
- **Test Behavior, Not Implementation.** Assert what users of the code can observe (`tdd`).
- **Explain the Number.** Find what limits a measured number before trusting it.

**Delegation**
- **Guard the Context Window.** Route bulk output to subagents or momentum. Keep summaries in the main thread.
- **Never Block on the Human.** Proceed on reversible work and present the result. Confirm only irreversible steps.

**Meta**
- **Encode Lessons in Structure.** A rule written twice becomes a lint, check or script (`routing-tune` for skills).

## Preferences

The user's and the project's own rules (package manager, commit style, dev servers, parallel agents on one branch) override this skill.
