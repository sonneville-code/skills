# Changelog

All notable changes to this project are recorded here. The format follows Keep a Changelog, and versions follow semantic versioning.

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
