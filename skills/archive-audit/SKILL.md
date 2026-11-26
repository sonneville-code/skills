---
name: archive-audit
description: Wrap-up audit of the current session and its forked sessions. Use when the user says archive-audit, "anything left", "are we done", "what's pending", or before finishing or archiving a session. Reports unfinished tasks, pending decisions and approvals, undetermined items, and session leftovers (temp files, test setup) safe to delete or revert. Asks one batched question so the user can approve cleanup in the same reply.
user-invocable: true
---

# archive-audit

Goal: let the work finish without interruption, by surfacing everything still open in one pass. Scope is this conversation plus its forked sessions, nothing older.

Answer these five, using the conversation, your progress tracker if you keep one (for example `paseo-progress show`) and your own tool calls:
1. Unfinished tasks?
2. Decisions that need the user?
3. Approvals that need the user?
4. Items you cannot yet place in 1-3, and what would settle them?
5. Housekeeping: what this session created only for its own task, and what setup it changed only to test.

## Housekeeping (item 5)
The user should never have to remember or hunt for leftovers, so list them for them.
- **Candidates:** temp files and scratch dirs, test builds, probe scripts, `/tmp` files this session wrote, tmux sessions and background agents or schedules started for a test, backups made for this session's edits, temporary hook, config or plugin entries.
- **Worktrees:** in a repo with extra git worktrees, run `git worktree list` and list the merged, idle ones as `delete` candidates. Deleting stays the user's call.
- **Ledger first:** collect every temporary change logged during the session (for example `Temp: <what> — revert: <how>`), then add any of your own tool calls that were never logged.
- **Verify before listing:** confirm the item exists and this session made it (path, timestamps, your tool calls). When unsure, list it as `keep`, because a wrong delete costs more than a stray file.
- **Never propose deleting:** skills or skill links, harness configs or instructions, the user's original backups, anything that predates the session, or anything the user said to keep.
- Mark each item `delete` or `revert` with one line on why it was temporary and the exact command or step.

## Asking
Ask one batched question (your ask tool, or a form if the harness renders them) covering every decision, approval and deletion, asked before the report so the user can approve in the same reply. Pre-check the safe deletions, leave uncertain ones unchecked, include an open field, and make the default do nothing so ignoring it is safe. Afterwards do exactly the approved actions and confirm each in one line.
