#!/usr/bin/env node
// momentum-setup: installs the pieces the skills CLI cannot install, for one harness.
//
//   node setup.mjs <harness> [--scope user|project] [--only hook,agent] [--level default|terse]
//                  [--project-dir DIR] [--val-mode PATH] [--dry-run] [--uninstall]
//
// harness: claude | codex | cursor | copilot | agy | opencode | hermes
// hook:  a session-start hook that loads the val-mode skill (needs val-mode installed).
// agent: the momentum-worker subagent definition.
//
// Every entry this script writes carries the id "momentum-val-mode" or the line
// "managed-by: momentum-setup", and --uninstall removes only those. Other hooks and
// agents in the same files are left as they are. --dry-run prints the plan and writes nothing.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.dirname(HERE);
const HOOK_SCRIPT = path.join(HERE, "session-start.mjs");
const ID = "momentum-val-mode";
const MARK = "managed-by: momentum-setup";
const HARNESSES = ["claude", "codex", "cursor", "copilot", "agy", "opencode", "hermes"];

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : fallback;
};
const harness = argv[0];
if (!HARNESSES.includes(harness)) {
  console.error(`Usage: node setup.mjs <${HARNESSES.join("|")}> [--scope user|project] [--only hook,agent] [--level default|terse] [--dry-run] [--uninstall]`);
  process.exit(2);
}
const scope = opt("scope", "user");
const only = opt("only", "hook,agent").split(",");
const level = opt("level", "default") === "terse" ? "terse" : "default";
const projectDir = path.resolve(opt("project-dir", process.cwd()));
const dryRun = flag("dry-run");
const uninstall = flag("uninstall");
const home = os.homedir();
const actions = [];

// ---------- helpers ----------
const readJson = (file, fallback) => {
  if (!fs.existsSync(file)) return fallback;
  const text = fs.readFileSync(file, "utf8").trim();
  return text ? JSON.parse(text) : fallback;
};
function write(file, content, note) {
  actions.push(`${uninstall ? "update" : "write"} ${file}  (${note})`);
  if (dryRun) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file) && !fs.existsSync(`${file}.momentum-backup`)) fs.copyFileSync(file, `${file}.momentum-backup`);
  fs.writeFileSync(file, content);
}
function remove(file, note) {
  if (!fs.existsSync(file)) return;
  actions.push(`remove ${file}  (${note})`);
  if (!dryRun) fs.rmSync(file, { recursive: true, force: true });
}
const writeJson = (file, data, note) => write(file, JSON.stringify(data, null, 2) + "\n", note);
const quote = (s) => `"${s.replace(/(["\\$`])/g, "\\$1")}"`;
const ours = (entry) => JSON.stringify(entry).includes(ID);

function findValMode() {
  const given = opt("val-mode", "");
  const candidates = [
    given,
    path.join(SKILL_DIR, "..", "val-mode", "SKILL.md"),
    path.join(SKILL_DIR, "..", "..", "adhd", "skills", "val-mode", "SKILL.md"),
    path.join(home, ".agents", "skills", "val-mode", "SKILL.md"),
    path.join(home, ".claude", "skills", "val-mode", "SKILL.md"),
  ].filter(Boolean);
  const hit = candidates.find((c) => fs.existsSync(c));
  return hit ? fs.realpathSync(hit) : null;
}
function hookCommand(format) {
  const valMode = findValMode();
  if (!valMode) {
    console.error("val-mode is not installed. Install it first: npx skills add sonneville-code/skills -s val-mode (or pass --val-mode PATH).");
    process.exit(3);
  }
  return `node ${quote(HOOK_SCRIPT)} --format ${format} --skill ${quote(valMode)} --level ${level} --id ${ID}`;
}

function agentBody() {
  return fs.readFileSync(path.join(SKILL_DIR, "assets", "momentum-worker.md"), "utf8");
}
const AGENT_DESC =
  "Worker subagent for one scoped task from a brief. Finishes inside its scope, proves the result with a fresh check, and reports DONE, BLOCKED and NEED FROM USER in three lines. Use when delegating a self-contained implementation, fix or investigation.";
function agentMarkdown(extra = {}) {
  const fm = { name: "momentum-worker", description: AGENT_DESC, ...extra };
  const lines = Object.entries(fm).map(([k, v]) => `${k}: ${typeof v === "string" ? JSON.stringify(v) : v}`);
  return `---\n# ${MARK}\n${lines.join("\n")}\n---\n\n${agentBody()}`;
}
function agentToml() {
  const body = agentBody().replace(/"""/g, '\\"\\"\\"');
  return `# ${MARK}\nname = "momentum-worker"\ndescription = ${JSON.stringify(AGENT_DESC)}\ndeveloper_instructions = """\n${body}"""\n`;
}
function writeAgent(file, content) {
  if (uninstall) {
    if (fs.existsSync(file) && fs.readFileSync(file, "utf8").includes(MARK)) remove(file, "momentum-worker agent");
    return;
  }
  if (fs.existsSync(file) && !fs.readFileSync(file, "utf8").includes(MARK)) {
    actions.push(`skip ${file}  (exists and was not written by momentum-setup)`);
    return;
  }
  write(file, content, "momentum-worker agent");
}

// Claude Code and Codex share the nested layout: { hooks: { SessionStart: [ { matcher?, hooks: [ {type, command} ] } ] } }
function nestedHook(file, format, withMatcher) {
  const data = readJson(file, {});
  data.hooks = data.hooks || {};
  const list = (data.hooks.SessionStart || []).filter((e) => !ours(e));
  if (!uninstall) {
    const entry = { hooks: [{ type: "command", command: hookCommand(format), timeout: 10 }] };
    if (withMatcher) entry.matcher = "startup|resume|clear|compact";
    list.push(entry);
  }
  if (list.length) data.hooks.SessionStart = list;
  else delete data.hooks.SessionStart;
  writeJson(file, data, `SessionStart hook ${uninstall ? "removed" : "added"}`);
}

// ---------- per harness ----------
const targets = {
  claude() {
    const base = scope === "project" ? path.join(projectDir, ".claude") : process.env.CLAUDE_CONFIG_DIR || path.join(home, ".claude");
    if (only.includes("hook")) nestedHook(path.join(base, "settings.json"), "claude", true);
    if (only.includes("agent")) writeAgent(path.join(base, "agents", "momentum-worker.md"), agentMarkdown());
  },
  codex() {
    const base = scope === "project" ? path.join(projectDir, ".codex") : process.env.CODEX_HOME || path.join(home, ".codex");
    if (only.includes("hook")) nestedHook(path.join(base, "hooks.json"), "codex", false);
    if (only.includes("agent")) writeAgent(path.join(base, "agents", "momentum-worker.toml"), agentToml());
  },
  cursor() {
    const base = scope === "project" ? path.join(projectDir, ".cursor") : path.join(home, ".cursor");
    if (only.includes("hook")) {
      const file = path.join(base, "hooks.json");
      const data = readJson(file, { version: 1, hooks: {} });
      data.version = data.version || 1;
      data.hooks = data.hooks || {};
      const list = (data.hooks.sessionStart || []).filter((e) => !ours(e));
      if (!uninstall) list.push({ command: hookCommand("cursor") });
      if (list.length) data.hooks.sessionStart = list;
      else delete data.hooks.sessionStart;
      writeJson(file, data, `sessionStart hook ${uninstall ? "removed" : "added"}`);
    }
    if (only.includes("agent")) writeAgent(path.join(base, "agents", "momentum-worker.md"), agentMarkdown());
  },
  copilot() {
    // Copilot CLI reads every JSON file in ~/.copilot/hooks (repo: .github/hooks), so the hook gets a file of its own.
    const base = scope === "project" ? path.join(projectDir, ".github") : process.env.COPILOT_HOME || path.join(home, ".copilot");
    if (only.includes("hook")) {
      const file = path.join(base, "hooks", `${ID}.json`);
      if (uninstall) remove(file, "sessionStart hook");
      else writeJson(file, { version: 1, hooks: { sessionStart: [{ type: "command", command: hookCommand("copilot"), timeoutSec: 10 }] } }, "sessionStart hook added");
    }
    if (only.includes("agent")) writeAgent(path.join(base, "agents", "momentum-worker.agent.md"), agentMarkdown());
  },
  agy() {
    // agy groups hooks under a name, with flat SessionStart entries. A malformed file disables every agy hook, so it is parsed and rewritten whole.
    if (only.includes("hook")) {
      const file = scope === "project" ? path.join(projectDir, ".agents", "hooks.json") : path.join(home, ".gemini", "config", "hooks.json");
      const data = readJson(file, {});
      if (uninstall) delete data[ID];
      else data[ID] = { SessionStart: [{ type: "command", command: hookCommand("agy"), timeout: 10 }] };
      writeJson(file, data, `SessionStart hook group "${ID}" ${uninstall ? "removed" : "added"}`);
    }
    if (only.includes("agent")) {
      actions.push("skip agent  (agy loads agents from plugins: agy plugin install https://github.com/sonneville-code/skills)");
    }
  },
  opencode() {
    const base = scope === "project" ? projectDir : process.env.XDG_CONFIG_HOME ? path.join(process.env.XDG_CONFIG_HOME, "opencode") : path.join(home, ".config", "opencode");
    const pluginDir = scope === "project" ? path.join(base, ".opencode", "plugins") : path.join(base, "plugins");
    const configFile = path.join(base, "opencode.json");
    if (only.includes("hook")) {
      const pluginFile = path.join(pluginDir, `${ID}.js`);
      const ref = `file://${pluginFile}`;
      const config = readJson(configFile, {});
      config.plugin = (config.plugin || []).filter((p) => !String(p).includes(ID));
      if (uninstall) {
        remove(pluginFile, "val-mode plugin");
      } else {
        const valMode = findValMode() || (hookCommand("claude"), "");
        const js = `// ${MARK}\n// Adds the val-mode skill to the system prompt. Off for one run: MOMENTUM_VAL_MODE=0.\nimport { readFileSync } from "node:fs";\nconst SKILL = ${JSON.stringify(valMode)};\nconst LEVEL = ${JSON.stringify(level)};\nexport const MomentumValMode = async () => ({\n  "experimental.chat.system.transform": async (_input, output) => {\n    try {\n      if (process.env.MOMENTUM_VAL_MODE === "0") return;\n      const body = readFileSync(SKILL, "utf8").replace(/^---\\r?\\n[\\s\\S]*?\\r?\\n---\\r?\\n/, "");\n      output.system.push(\`VAL MODE ON (level: \${LEVEL}). "stop val mode" turns it off for this session.\\n\\n\` + body);\n    } catch {}\n  },\n});\n`;
        write(pluginFile, js, "val-mode plugin");
        config.plugin.push(ref);
      }
      if (!config.plugin.length) delete config.plugin;
      writeJson(configFile, config, `plugin list ${uninstall ? "without" : "with"} ${ID}`);
    }
    if (only.includes("agent")) {
      writeAgent(path.join(base, scope === "project" ? ".opencode/agents" : "agents", "momentum-worker.md"), agentMarkdown({ mode: "subagent" }));
    }
  },
  hermes() {
    const base = process.env.HERMES_HOME || path.join(home, ".hermes");
    const dir = path.join(base, "plugins", ID);
    if (only.includes("hook")) {
      if (uninstall) {
        spawnSync("hermes", ["plugins", "disable", ID], { stdio: "ignore" });
        remove(dir, "val-mode plugin");
      } else {
        const valMode = findValMode() || (hookCommand("claude"), "");
        write(path.join(dir, "plugin.yaml"), `# ${MARK}\nname: ${ID}\nversion: 0.1.0\ndescription: Loads the val-mode skill on the first turn of each session.\nauthor: sonneville-code\nprovides_hooks:\n  - pre_llm_call\n`, "val-mode plugin manifest");
        write(
          path.join(dir, "__init__.py"),
          `# ${MARK}\n"""Adds the val-mode skill to the first turn of each session. Off for one run: MOMENTUM_VAL_MODE=0."""\nimport os\nimport re\n\nSKILL = ${JSON.stringify(valMode)}\nLEVEL = ${JSON.stringify(level)}\n\n\ndef register(ctx):\n    def pre_llm_call(is_first_turn=None, platform=None, **kwargs):\n        if not is_first_turn or platform == "subagent" or os.environ.get("MOMENTUM_VAL_MODE") == "0":\n            return None\n        try:\n            with open(SKILL, encoding="utf-8") as f:\n                body = re.sub(r"^---\\n[\\s\\S]*?\\n---\\n", "", f.read())\n        except OSError:\n            return None\n        return {"context": f'VAL MODE ON (level: {LEVEL}). "stop val mode" turns it off for this session.\\n\\n' + body}\n\n    ctx.register_hook("pre_llm_call", pre_llm_call)\n`,
          "val-mode plugin",
        );
        actions.push(`run hermes plugins enable ${ID}`);
        if (!dryRun) spawnSync("hermes", ["plugins", "enable", ID], { stdio: "ignore", env: process.env });
      }
    }
    if (only.includes("agent")) actions.push("skip agent  (Hermes has no agent definition files; it delegates with its own task tool)");
  },
};

targets[harness]();
console.log(`${dryRun ? "Plan" : "Done"} for ${harness} (${scope} scope${uninstall ? ", uninstall" : ""}):`);
for (const a of actions) console.log(`  - ${a}`);
if (!dryRun && !uninstall && harness === "codex" && only.includes("hook")) {
  console.log("  Codex asks you to trust new hooks: open Codex, go to the Hooks screen and trust the momentum-val-mode entry.");
}
