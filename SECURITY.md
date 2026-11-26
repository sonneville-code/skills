# Security

containment is mostly Markdown. The parts that run code are `adhd/hooks/val-mode-on.mjs` (a SessionStart hook) and `scripts/check-skills.py` (a read-only check).

The hook is off by default. When you opt in, it reads one flag file in your Claude config directory and prints one instruction. It makes no network calls and writes nothing.

## Reporting a problem

Report a vulnerability, or a skill that could cause an agent to leak data or take a destructive action, through a private GitHub security advisory on this repository. Please do not open a public issue for it. Expect a first reply within a week.
