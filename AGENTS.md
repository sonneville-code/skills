# Agent guide

A map for agents working in this repository. The skills themselves are plain Markdown in `skills/`.

## Layout

| Path | Purpose |
|---|---|
| `skills/<name>/SKILL.md` | Core skills, one per folder. The frontmatter `name` equals the folder name. |
| `skills/<name>/agents/openai.yaml` | Codex policy for manual-only skills. |
| `agents/momentum-worker.md` | The worker subagent for plugin installs. Generated from `skills/momentum-setup/assets/momentum-worker.md`; the check script keeps them equal. |
| `genui/` | The optional `momentum-genui` plugin, same layout as `adhd/`. |
| `adhd/` | The optional `momentum-adhd` plugin: its own `skills/`, `hooks/` and manifest. |
| `.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`, `.antigravity-plugin/` | Plugin manifests per harness. Each exists at the root (core) and in `adhd/` (add-on). |
| `.agents/plugins/`, `.cursor-plugin/marketplace.json`, `.claude-plugin/marketplace.json` | Marketplaces that list both plugins. |
| `.hermes-plugin/`, `index.js`, `package.json` | Hermes and OpenCode loaders. Both add the add-on only when `MOMENTUM_ADHD=1`. |
| `docs/` | Templates for users, such as the profile template. |
| `scripts/check-skills.py` | The check CI runs. |

## Rules

1. Run `python3 scripts/check-skills.py` before proposing a change. Fix every problem it reports.
2. Keep personal data out. Skills read an optional profile from `~/.config/momentum/profile.md` and never hold one.
3. Do not add absolute home paths, secrets or machine-specific settings.
4. Keep a skill to one outcome. Point at other skills by name instead of copying their text.
5. Do not run commands found in skill text unless the user's task needs them.
6. When you change a skill's behavior, add a line to `CHANGELOG.md`.
