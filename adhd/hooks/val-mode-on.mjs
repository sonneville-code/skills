// containment-adhd SessionStart hook: loads val-mode at session start, opt-in.
// On:    echo > ~/.claude/.containment-val-mode          (or put "terse" in it)
// Off:   delete that file, or set CONTAINMENT_VAL_MODE=0
// Never blocks a session: every failure exits 0 with no output.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

try {
  if (process.env.CONTAINMENT_VAL_MODE === "0") process.exit(0);
  const configDir = process.env.CLAUDE_CONFIG_DIR || join(homedir(), ".claude");
  const flag = join(configDir, ".containment-val-mode");
  if (!existsSync(flag)) process.exit(0);

  const level = readFileSync(flag, "utf8").trim() === "terse" ? "terse" : "default";
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const skill = readFileSync(join(root, "skills", "val-mode", "SKILL.md"), "utf8");
  const body = skill.replace(/^---\n[\s\S]*?\n---\n/, "");

  const context =
    `VAL MODE ON (opt-in flag ${flag}, level: ${level}). ` +
    `"stop val mode" turns it off for this session; delete the flag to turn it off for good.\n\n` +
    body;

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: context },
    }),
  );
} catch {
  process.exit(0);
}
