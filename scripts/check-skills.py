#!/usr/bin/env python3
"""Check that every skill in this repo will load, and that nothing private ships.

Run from the repo root: python3 scripts/check-skills.py
Exit code 1 means at least one check failed. Standard library only.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKILL_DIRS = [ROOT / "skills", ROOT / "adhd" / "skills"]
FRONT = re.compile(r"\A---\r?\n(.*?)\r?\n---", re.S)
KEY = re.compile(r"^([A-Za-z][\w-]*):\s*(.*)$")
errors = []


def fail(where, msg):
    errors.append(f"{where}: {msg}")


def frontmatter(text):
    m = FRONT.match(text)
    if not m:
        return None
    data, lines, i = {}, m.group(1).split("\n"), 0
    while i < len(lines):
        k = KEY.match(lines[i])
        i += 1
        if not k:
            continue
        key, val = k.group(1), k.group(2).strip()
        if val in (">", "|", ">-", "|-"):
            block = []
            while i < len(lines) and (lines[i].startswith(" ") or not lines[i].strip()):
                block.append(lines[i].strip())
                i += 1
            val = " ".join(b for b in block if b)
        elif val.startswith('"'):
            try:
                val = json.loads(val)
            except ValueError:
                val = val.strip('"')
        elif val.startswith("'") and val.endswith("'"):
            val = val[1:-1]
        data[key] = val
    return data


names = {}
for md in sorted(m for d in SKILL_DIRS for m in d.glob("*/SKILL.md")):
    where = md.relative_to(ROOT).as_posix()
    fm = frontmatter(md.read_text())
    if fm is None:
        fail(where, "no frontmatter block")
        continue
    name, desc = fm.get("name", ""), fm.get("description", "")
    if name != md.parent.name:
        fail(where, f"name '{name}' must equal the folder name '{md.parent.name}'")
    if not desc:
        fail(where, "missing description")
    elif len(desc) > 1024:
        fail(where, f"description is {len(desc)} characters, the limit is 1024")
    if name in names:
        fail(where, f"duplicate name, also in {names[name]}")
    names[name] = where
    if fm.get("disable-model-invocation") == "true":
        policy = md.parent / "agents" / "openai.yaml"
        if not policy.exists() or "allow_implicit_invocation: false" not in policy.read_text():
            fail(where, "manual-only skill needs agents/openai.yaml with allow_implicit_invocation: false")

for folder in sorted(p for d in SKILL_DIRS for p in d.iterdir() if p.is_dir()):
    if not (folder / "SKILL.md").exists():
        fail(folder.relative_to(ROOT).as_posix(), "skill folder has no SKILL.md")

market = json.loads((ROOT / ".claude-plugin/marketplace.json").read_text())
for entry in market["plugins"]:
    manifest = ROOT / entry["source"] / ".claude-plugin/plugin.json"
    if not manifest.exists():
        fail(entry["name"], f"no plugin.json at {manifest.relative_to(ROOT)}")
        continue
    plugin = json.loads(manifest.read_text())
    if plugin["name"] != entry["name"]:
        fail(entry["name"], f"marketplace name differs from plugin.json name '{plugin['name']}'")
    if plugin["version"] != entry.get("version"):
        fail(entry["name"], "plugin.json and marketplace.json versions differ")

versions = {}
for manifest in ["package.json"] + [f"{d}/.{k}-plugin/plugin.json" for d in (".", "adhd") for k in ("claude", "codex", "cursor", "antigravity")]:
    path = ROOT / manifest
    if not path.exists():
        fail(manifest, "missing manifest")
        continue
    versions[manifest] = json.loads(path.read_text())["version"]
hermes = ROOT / ".hermes-plugin/plugin.yaml"
match = re.search(r"^version:\s*(\S+)", hermes.read_text(), re.M) if hermes.exists() else None
versions[".hermes-plugin/plugin.yaml"] = match.group(1) if match else None
if len(set(versions.values())) > 1:
    fail("versions", ", ".join(f"{k}={v}" for k, v in versions.items()))

asset = (ROOT / "skills/momentum-setup/assets/momentum-worker.md").read_text()
plugin_agent = ROOT / "agents/momentum-worker.md"
if not plugin_agent.exists() or not plugin_agent.read_text().endswith(asset):
    fail("agents/momentum-worker.md", "must end with skills/momentum-setup/assets/momentum-worker.md; regenerate it")

skip = {".git", "node_modules", "__pycache__"}
for path in ROOT.rglob("*"):
    if not path.is_file() or path.is_symlink() or skip & set(path.parts):
        continue
    if path.name == "check-skills.py":
        continue
    try:
        text = path.read_text()
    except (UnicodeDecodeError, OSError):
        continue
    if re.search(r"/home/\w+|/Users/\w+", text):
        fail(path.relative_to(ROOT).as_posix(), "holds an absolute home path")

if errors:
    print("\n".join(errors))
    print(f"\n{len(errors)} problem(s)")
    sys.exit(1)
print(f"{len(names)} skills OK")
