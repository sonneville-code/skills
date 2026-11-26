---
name: routing-tune
disable-model-invocation: true
description: Propose (never silently apply) minimal fixes to the agent's own routing setup (skills, AGENTS.md rows, rules, hooks). Use on concrete evidence of a routing miss (MCP, raw CLI, curl or WebFetch used where a skill exists; no skill matched a search/docs/repo/lead/decision task; the same manual retrieval pattern twice; a skill that should have fired didn't; the user corrected the tool) or of redundancy (two skills, rows, rules or hooks doing the same job, a new fix that an existing item could absorb, or conflicting or contradicting instructions). Also use when the user asks to dedupe, merge or slim the routing setup. Skip normal tasks, hypotheticals and vague "improve my setup" chatter.
---

# routing-tune

Goal: after a real miss or overlap, make the smallest change that stops it recurring, so nobody has to type "use skill X" again. Skill descriptions and AGENTS.md load on every turn of every harness, so each added line has a standing token cost. That is why merging and deleting beat adding.

## Gate
State the concrete miss or overlap in one line. Without evidence, stop quietly: proposals built on guesses add lines that cost tokens and fix nothing. Audit the whole setup only when the user explicitly asks.

## Canon
The routing to preserve is the table plus the MCP and fallback rules in your global agent instructions file. It is the single source, so read it instead of copying it here (copies drift). Flag any change that contradicts it.

## Diagnose (pick one cause)
1. **No skill covers it**: widen an existing skill; a new skill is the last resort.
2. **Skill exists, didn't fire**: its description is too narrow or polite, or contradicts the canon. Make it a little pushy: name the trigger phrases and task shapes.
3. **Agent never saw the route**: the AGENTS.md row is missing or ambiguous.
4. **Seen and ignored**: the rule is too soft. Reword it with its reason; use a hook only as a last resort.
5. **Right route, too expensive**: default to the cheap mode, escalate only if thin, save output to a file.
6. **Redundant**: see below.

## Redundancy check
Run it before proposing any addition, scoped to the area you would touch, so the cost stays small. Compare the item against skill names and descriptions, AGENTS.md rows, `~/.claude/rules/`, hook configs and plugins, and per-harness pointer files. Grep names and trigger phrases and read only the hits. Look for:
- **Duplicates**: same job, same trigger.
- **Overlaps**: partly the same job, with competing descriptions that make the agent pick wrongly.
- **Copied routing**: canon restated in a harness file, rule or skill body instead of pointing at AGENTS.md.
- **Dead weight**: something a newer item now covers, or that never fires.
- **One workflow in pieces**: items that always run together.
- **Contradictions**: two items that disagree (a skill says prefer an MCP while AGENTS.md forbids it; a rule and a hook fight; a harness file overrides the canon). Lower items are copies or pointers of the canon, so edit the derived one: precedence is explicit user instruction, then your global agent instructions file, then the skill body, then a harness pointer file, then hook message text. Quote both in the proposal, and ask when precedence does not decide. A hook that denies what a rule allows wins at runtime, so changing its message does nothing: that needs a hook behavior change, which stays propose-only.

Resolve in this order: merge into the existing item (fold in its unique triggers and safety lines), delete the weaker one, reduce one to a thin pointer, or keep both with a one-line reason they differ. Prefer merging because one item with a clear owner is easier for the agent to pick correctly than two near-twins. If an existing item could absorb the change, extend it rather than adding a new one. Deleting or archiving a skill needs explicit approval, and the proposal lists what the merge would lose.

## Fix ladder (cheapest first; stop at the first rung that works)
1. Edit or merge into one skill description.
2. Edit or merge one row in your global agent instructions file (net growth at most 2 lines; harness files stay pointers).
3. Thin skill that delegates to the canon skill, with no logic copied.
4. Rule file, only if scoped to a path or project.
5. Hook: propose only, never write hook config, because a misfiring hook affects every session. Give the event, matcher, command, what it injects or blocks, tokens per fire, and what breaks on misfire. Prefer a matcher on the offending call over firing every prompt.

## Output
A compact list; each item reads: miss or overlap, then cause, then rung, then the exact diff (for merges: what moves, what is removed, what is lost). Then wait. Apply only approved items (hooks need approval of the exact config) and confirm each in one line. Settled decisions in `paseo-progress show` stay settled.
