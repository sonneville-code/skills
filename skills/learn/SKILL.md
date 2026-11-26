---
name: learn
description: Turn repeated corrections into structure so agents stop making the same mistake. Use for "learn from this", "you keep doing X", "stop making this mistake", after the user corrects the same thing twice, or at the end of a session to capture lessons.
disable-model-invocation: true
---

# Learn

A correction the user gives twice is a missing piece of structure. More text in a rules file is the weakest fix, because nothing fails when an agent skips it.

Routing misses (the wrong skill fired, a skill never fired) go to `routing-tune`. Everything else comes here.

## Find what to fix

1. **Collect the evidence.** This session's corrections, plus recent commits, reverts, review comments and workaround comments in the repo.
2. **Group mistakes into classes.** A class counts once it has happened twice.
3. **Keep a lesson only if** it will still hold in six months, would change what a future agent does, and the existing skill or rule does not already say it clearly. Drop one-offs.

## Fix each class at the strongest level that works

1. **Architecture**: give each piece of state one owner and each task one supported way, so the wrong path does not exist.
2. **Types or a lint**: the bad version does not compile, or a check fails with a message that names the right way.
3. **A test** that fails when the behavior breaks.
4. **Text last**: a skill edit or a rule line, only for judgment calls that no check can catch.

For each fix, show a check fails on a real past mistake before you rely on it.

## Ask before changing anything

Present three lists: **accepted** (problem, proposed change, where it goes), **rejected** (with the reason), and **later**. Wait for approval before editing any skill, rule or config. Never edit an installed plugin's cache. Propose a change to its source repository instead.

## Keep the record

Add each accepted lesson to a table in the project's agent instructions file: the rule, and what enforces it. When a rule exists but nothing enforces it, that is the next fix.

Done when each accepted lesson is enforced at the strongest workable level and listed in the table, or waiting on the user's approval.
