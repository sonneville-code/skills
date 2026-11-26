"""containment plugin for Hermes Agent.

Registers the core skills with Hermes' skill loader. The ADHD add-on skills
(adhd/skills) are registered only when CONTAINMENT_ADHD=1 is set.
No network calls, no writes, no hooks.
"""
import os
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent


def _skill_dirs():
    for root in (HERE.parent, HERE):
        core = root / "skills"
        if (core / "verify" / "SKILL.md").is_file():
            dirs = [core]
            if os.environ.get("CONTAINMENT_ADHD") == "1":
                dirs.append(root / "adhd" / "skills")
            return dirs
    raise RuntimeError(
        "containment plugin: cannot find the skills/ folder. "
        "Reinstall with `hermes plugins install sonneville-code/skills`."
    )


def _description(text):
    match = re.match(r"^---\n([\s\S]*?)\n---\n", text)
    if not match:
        return ""
    for line in match.group(1).splitlines():
        key, sep, value = line.partition(":")
        if sep and key.strip() == "description":
            return value.strip().strip("\"'")
    return ""


def register(ctx):
    for skills in _skill_dirs():
        for folder in sorted(p for p in skills.iterdir() if p.is_dir()):
            skill_md = folder / "SKILL.md"
            if skill_md.is_file():
                ctx.register_skill(
                    folder.name,
                    skill_md,
                    description=_description(skill_md.read_text(encoding="utf-8")),
                )
