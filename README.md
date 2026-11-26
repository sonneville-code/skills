# momentum

Agent skills that keep work moving: one goal, a way to check it, evidence before "done", and agents that come back with a report you can read in ten seconds.

The name comes from one idea: keep moving forward, not aiming for perfection. Small, verified wins build speed, and speed gets real work finished.

momentum ships as two plugins for Claude Code, Codex, Cursor, Antigravity, Hermes and OpenCode, and as plain Agent Skills (`SKILL.md` folders) for every other harness.

| Plugin | For | Skills |
|---|---|---|
| `momentum` | Anyone | 17 skills for building, debugging, verifying, delegating and writing, plus the `momentum-worker` subagent |
| `momentum-adhd` | Optional add-on for ADHD readers, or anyone who wants action-first replies | `val-mode`, `first-step`, `scope-guard`, and an opt-in session hook (Claude Code only) |

The core plugin works alone. Without the add-on, nothing in it shapes your replies or interrupts tool setup.

## Install

### Claude Code

```bash
/plugin marketplace add sonneville-code/skills
/plugin install momentum@sonneville-code
/plugin install momentum-adhd@sonneville-code    # optional add-on
```

### Codex

```bash
codex plugin marketplace add sonneville-code/skills
codex plugin add momentum@sonneville-code
codex plugin add momentum-adhd@sonneville-code   # optional add-on
```

### Cursor

```bash
cursor-agent plugin marketplace add https://github.com/sonneville-code/skills
```

Then install `momentum`, and optionally `momentum-adhd`, from the marketplace panel in Cursor.

### Antigravity

```bash
agy plugin install https://github.com/sonneville-code/skills
agy plugin install https://github.com/sonneville-code/skills/tree/main/adhd   # optional add-on
```

### Hermes Agent

```bash
hermes plugins install sonneville-code/skills --enable
```

For the add-on, set `MOMENTUM_ADHD=1` in the environment Hermes runs in.

### OpenCode

Add the plugin to `opencode.json`:

```json
{
  "plugin": ["momentum@git+https://github.com/sonneville-code/skills.git"]
}
```

For the add-on, set `MOMENTUM_ADHD=1` in the environment OpenCode runs in.

### Any other harness

```bash
npx skills add sonneville-code/skills
```

Pick the skills you want when prompted. Leave out `val-mode`, `first-step` and `scope-guard` if you do not want the add-on.

### Hooks and the worker agent after `npx skills`

The `skills` CLI copies skill folders and nothing else, so it cannot add hooks or subagents. Run `/momentum-setup` once in each harness after the install. It asks what to add (the `val-mode` session hook, the `momentum-worker` subagent, or both), shows the files it will touch, and writes them only after you approve. `/momentum-setup uninstall` removes only what it added.

| Harness | Session hook | Worker agent |
|---|---|---|
| Claude Code | yes | yes |
| Codex | yes (trust it once on the Hooks screen) | yes |
| Cursor | yes | yes |
| Antigravity | yes | through `agy plugin install` |
| OpenCode | yes | yes |
| Hermes | yes | no, Hermes has no agent files |

### Name clashes

Claude Code, Codex and Cursor prefix plugin skills with the plugin name (`momentum:verify`). Antigravity, Hermes, OpenCode and the `skills` CLI do not. If you already have a skill with the same name, such as your own `verify`, one of the two wins. Rename or remove one of them.

## Core skills

Manual skills run only when you type their name. The rest fire on their own when the situation matches their description.

| Group | Skills | What they do |
|---|---|---|
| Thinking | `rd-method`, `diverge`, `grill` (manual) | Pick an approach with evidence, widen a hard design decision across isolated viewpoints, pressure-test a plan |
| Building | `build`, `tdd`, `debug`, `verify`, `micro-commits`, `create-verification-skill` (manual), `maintain-verification-skill` (manual) | A default order for real changes, test-first work, root-cause debugging, an evidence gate before "done", small commits, a project-local skill that proves behavior on the real app |
| Agents | `brief`, `review-window` (manual) | Brief and hand off agents so they finish without questions, then check on all of them in one batch |
| Writing | `unslop` | Cut AI tells from docs, commits, PR text and messages |
| Housekeeping | `archive-audit`, `routing-tune` (manual), `momentum-setup` (manual), `momentum` (manual router) | A wrap-up audit of what is still open, a fix for skills that fire wrong, a setup for hooks and the worker agent, and a router that names the right skill |

Not sure which one fits? Type `/momentum`.

## The ADHD add-on

`val-mode` shapes every reply around five facts about an ADHD reader: working memory is small, knowing is not doing, starting is the hardest step, vague time estimates all feel the same, and visible progress matters. It leads with the next action, numbers steps, restates state, and ends with one thing you can do in two minutes. `/val-mode terse` also compresses the prose and keeps every command, number and error exact.

`first-step` turns a stuck task into one physical action under two minutes. `scope-guard` fires when a request starts tool setup or a new idea, says what is due, and offers park, time-box or do it now. It never blocks.

### Your own profile

The add-on reads an optional profile at `~/.config/momentum/profile.md` (or the path in `MOMENTUM_PROFILE`). It holds your quiet hours, wording preferences and where your task list lives. Start from [docs/profile-template.md](docs/profile-template.md). Keep your profile out of version control.

### Session hook

The add-on registers a SessionStart hook that loads `val-mode` at the start of each session. It does nothing until you opt in:

```bash
echo > ~/.claude/.momentum-val-mode        # on; write "terse" in the file for terse mode
rm ~/.claude/.momentum-val-mode            # off
MOMENTUM_VAL_MODE=0 claude                 # off for one run
```

The hook reads one flag file, prints one instruction, and never blocks a session.

## Development

```bash
python3 scripts/check-skills.py
```

The script checks that every skill's frontmatter parses, names match folders, manual skills carry their Codex policy file, versions agree across manifests, and no absolute home paths ship. CI runs it on every push. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE). A few skills include material under its own MIT license, kept next to the skill in a `LICENSE` file.
