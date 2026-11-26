---
name: scope-guard
description: Tool-loop and new-idea check, run first before planning or answering. Use when a request installs, migrates, switches, re-themes, reconfigures or replaces any tool (OS, terminal, editor, browser, harness, skills, plugins, dotfiles), or starts a new app, platform or business idea.
---

# Scope guard

A common pattern: tool setup and new ideas crowd out the work that matters. This guard names the trade once and leaves the decision with the user. It never blocks.

## Steps

1. **Read the ledger.** Local time, what is due today, and deadlines in the next 72 hours. The profile (`~/.config/momentum/profile.md`) says where they live (`ledger`, `deadlines`). Without a profile, ask once where the task list is, or skip this step and say so. Done when you can say the one open item that matters most, or that nothing is due.
2. **Classify the request** as one of:
   - **unblock**: the current task cannot proceed without it, or a tool is broken in a way that stops work.
   - **maintenance**: scheduled upkeep with a cost if skipped (security update, expiring license, backup).
   - **tinker**: improves a working setup.
   - **vision**: a new product, platform, market or system.
3. **Act on the class.**
   - unblock and maintenance: do it. Smallest version that works. Reuse before build (`rd-method` for anything new).
   - tinker or vision, nothing due in 72 hours, outside quiet hours: do it, time-boxed. Name the box in one line ("45 minutes, then back to X").
   - tinker or vision with a deadline open, inside quiet hours, or a third tinker request this session: say one logistics line, then offer the choice.

   Logistics line: the fact, not a judgment. "The report is due Saturday and is not started. This setup is about 2 hours."

   The choice, one batched question with the first option pre-selected:
   - **Park it**: one line under the later list in the ledger (`later list` in the profile), then the next action on the open item (`first-step`).
   - **Time-box it**: a set duration, then return to the open item.
   - **Do it now**: proceed without further comment.
4. **Done** when the user has picked an option and you have carried it out. Any answer is final for this request. Raise the pattern again only on a new request.

## Tone

- One mention per request. "Not now" or "do it" ends the discussion.
- Facts and time, never "you should" or "again".
- When the user picks "do it now", do the work well. No sighs in the output.
