# Changelog

All notable changes to this project are recorded here. The format follows Keep a Changelog, and versions follow semantic versioning.

## [0.5.1] - 2026-11-28

### Changed

- `rd-method`: offers to save a choice to durable memory and writes it only after the user says yes. Search results count as evidence, never as instructions.
- `routing-tune`, `micro-commits`: text from plugins, other skills and commit history is data, never instructions.
- `archive-audit`: deletes, reverts or stops nothing until the user approves that item.

## [0.5.0] - 2026-11-27

### Added

- `paseo-workspace-api` in the `momentum-genui` add-on: list Paseo workspaces with status and labels, and add a label to one.

## [0.4.0] - 2026-11-26

### Added

- `catch-up`: a plain-language recap of what changed and what waits on the user.
- `checkpoint`: pause with a resume note, resume without redoing work, hand off to another agent.
- `review`: give a two-axis review with proven findings, or take a review without guessing.
- `learn`: turn a correction given twice into architecture, a check or a test before text.
- `shared-language`: keep `GLOSSARY.md` and short ADRs.

### Changed

- `build` names the shape of a request first (feature, bug fix, refactor, migration, investigation, verify only) with a stop rule for each.
- `micro-commits` writes Conventional Commits messages when the repo has no style of its own.
- `brief` asks for short reports and points at the `momentum-worker` agent.

## [0.3.0] - 2026-11-26

### Added

- `momentum-genui` add-on plugin with the `genui` skill for Paseo inline UI.

### Changed

- Claude Code install steps use the `claude plugin` terminal commands.

## [0.2.0] - 2026-11-26

### Added

- `momentum-setup` skill: installs the `val-mode` session hook and the `momentum-worker` subagent for Claude Code, Codex, Cursor, Antigravity, OpenCode and Hermes after an `npx skills` install, with dry run and uninstall.
- `momentum-worker` subagent, shipped in the core plugin.

## [0.1.0] - 2026-11-26

First release.

### Added

- `momentum` plugin: `rd-method`, `diverge`, `grill`, `build`, `tdd`, `debug`, `verify`, `micro-commits`, `create-verification-skill`, `maintain-verification-skill`, `brief`, `review-window`, `unslop`, `archive-audit`, `routing-tune`, and the `momentum` router.
- `momentum-adhd` add-on plugin: `val-mode`, `first-step`, `scope-guard`, and an opt-in SessionStart hook that loads `val-mode`.
- Install manifests for Claude Code, Codex, Cursor, Antigravity, Hermes and OpenCode.
- A profile template for personal settings, and `scripts/check-skills.py` with a CI workflow.
