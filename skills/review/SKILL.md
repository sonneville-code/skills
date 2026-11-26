---
name: review
description: Code review in both directions. Give one (the diff since a fixed point, checked against the project's standards and the spec, with proven findings) or take one (evaluate feedback before changing code). Use for "review this", "review my branch", "what could this break", or when review comments arrive.
---

# Review

## Give a review

1. **Pin the fixed point**: a commit, branch, tag or `main`. If the user named none, ask. Check it resolves (`git rev-parse`) and that `git diff <point>...HEAD` is not empty before going further.
2. **Find the spec**: issue references in the commit messages, a path the user gave, or the request in this chat. No spec found: say so and review standards only.
3. **Review two axes separately.** If you can run subagents, give each axis its own fresh one so they do not color each other:
   - **Standards**: does the change follow this repo's written rules (`AGENTS.md`, `CONTRIBUTING.md`, lint config, `GLOSSARY.md` terms)?
   - **Spec**: does it do what the spec asked, all of it and nothing more?
4. **Check what it could break elsewhere.** Listing callers is not enough. Find the one or two facts the change's safety rests on, and prove each as far down this ladder as is cheap, then say where you stopped:
   1. you said so (worth nothing alone)
   2. you pointed at the line (`file:line`)
   3. you walked the failure case and showed it cannot happen
   4. you ran a script or test against the real code
   5. you reproduced it in the running app
5. **Report findings one per line**, most severe first:

   ```
   bug   src/auth.ts:42  Token expiry uses < instead of <=. Use <=.
   risk  src/queue.ts:88  Retry has no cap. Cap at 5.
   nit   src/util.ts:12  Name says list, returns a set. Rename.
   q     api/orders.ts:30  Is partial cancel allowed here?
   ```

   `bug` breaks behavior, `risk` works but is fragile, `nit` is optional, `q` is a real question. One line each: location, problem, fix. No praise per line and no restating what the code does. Mark each finding with its proof level.

Done when both axes are covered, each finding has a location, a fix and a proof level, and the report says what was not checked.

## Take a review

1. **Read all of it** before changing anything.
2. **Restate each item** as a technical requirement. If any item is unclear, ask about the unclear ones before changing anything, because items often depend on each other.
3. **Check each against the code.** Is it true here? Does it break something else? Was the current design chosen on purpose?
4. **Answer with substance.** Agree by doing the work, or push back with the technical reason. No "great point" or "you're absolutely right".
5. **Change one item at a time**, and test each before the next.

Done when every item is fixed and tested, answered with a reason, or waiting on a clarifying question.
