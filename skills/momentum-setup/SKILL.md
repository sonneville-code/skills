---
name: momentum-setup
description: Install the extras the skills CLI cannot install, for the harness you run in. The val-mode session hook and the momentum-worker subagent. /momentum-setup, /momentum-setup uninstall.
disable-model-invocation: true
---

# Momentum setup

`npx skills add` copies skill folders and nothing else. This skill installs the two pieces that need harness config: a session-start hook that loads `val-mode`, and the `momentum-worker` subagent. Native plugin installs (Claude Code, Codex, Cursor and Antigravity marketplaces) already ship the worker agent, so this skill matters most after an `npx skills` install.

## Steps

1. **Name the harness you are running in**: `claude`, `codex`, `cursor`, `agy`, `opencode` or `hermes`. You know which one you are. If you do not, ask.
2. **Ask the user three things in one question**, with the first option pre-selected:
   - what to install: hook and agent / agent only / hook only
   - scope: user (every project) / project (this folder only)
   - val-mode level: default / terse
   The hook needs the `val-mode` skill. If it is missing, offer `npx skills add sonneville-code/skills -s val-mode` first.
3. **Dry run.** Run the script with `--dry-run` and show the user the list of files it will touch:

   ```bash
   node <this skill folder>/scripts/setup.mjs <harness> --scope user --only hook,agent --level default --dry-run
   ```

4. **Apply** after the user approves, with the same arguments and no `--dry-run`. The script backs up each config file once, as `<file>.momentum-backup`, before its first change.
5. **Verify.** Read back each file the script listed and confirm the entry is there. Then tell the user what changes next session: val-mode loads at the start, and `momentum-worker` appears in the agent list. Codex also asks the user to trust the new hook on its Hooks screen.

Done when the user has approved the plan, the files hold the new entries, and the user knows what to expect next session.

## What each harness gets

| Harness | Hook | Agent |
|---|---|---|
| claude | `SessionStart` in `settings.json` | `agents/momentum-worker.md` |
| codex | `SessionStart` in `hooks.json` | `agents/momentum-worker.toml` |
| cursor | `sessionStart` in `hooks.json` | `agents/momentum-worker.md` |
| agy | `SessionStart` group in `hooks.json` (user: `~/.gemini/config/`, project: `.agents/`) | Through the plugin install only |
| opencode | A plugin file, listed in `opencode.json` | `agents/momentum-worker.md` |
| hermes | A plugin that adds val-mode to the first turn | None (Hermes has no agent files) |

## Uninstall

Run the same command with `--uninstall`. It removes only the entries this script wrote. They carry the id `momentum-val-mode` or the line `managed-by: momentum-setup`. Everything else in those files stays.

## Off switches

- One run: start the harness with `MOMENTUM_VAL_MODE=0`.
- One session: say "stop val mode".
- For good: uninstall.
