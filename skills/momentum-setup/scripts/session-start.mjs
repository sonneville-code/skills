// momentum-setup session-start hook: loads the val-mode skill at the start of a session.
// Installed by setup.mjs. Usage:
//   node session-start.mjs --format claude|codex|cursor|agy --skill <path to val-mode/SKILL.md> [--level default|terse]
// Off for one run: MOMENTUM_VAL_MODE=0. Never blocks a session: every failure exits 0 with no output.
import { readFileSync } from "node:fs";

try {
  if (process.env.MOMENTUM_VAL_MODE === "0") process.exit(0);
  const args = process.argv.slice(2);
  const arg = (name, fallback) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 && i + 1 < args.length ? args[i + 1] : fallback;
  };
  const format = arg("format", "claude");
  const level = arg("level", "default") === "terse" ? "terse" : "default";
  const skill = readFileSync(arg("skill", ""), "utf8").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  const context =
    `VAL MODE ON (level: ${level}). "stop val mode" turns it off for this session.\n\n` + skill;

  // Each harness reads a different shape. Emit only the one it consumes.
  const out =
    format === "cursor"
      ? { additional_context: context }
      : format === "agy"
        ? { injectSteps: [{ ephemeralMessage: context }] }
        : { hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: context } };
  process.stdout.write(JSON.stringify(out));
} catch {
  process.exit(0);
}
