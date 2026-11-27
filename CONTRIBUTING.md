# Contributing

Thanks for improving momentum. Keep changes small, reviewable, and safe to run.

## Where each request goes

| You have | Go to |
|---|---|
| A skill that fires wrong or gives bad guidance | A bug issue |
| A change to an existing skill | An issue first, then a pull request |
| An idea for a new skill | An issue that describes the situation it handles |
| A question, or "how do I...?" | [Discussions](https://github.com/sonneville-code/skills/discussions) |

## What a skill needs

- One folder under `skills/`, with `SKILL.md` inside. The `name` in the frontmatter equals the folder name.
- A `description` that says when to use the skill, in the words a user would use to describe the situation. It loads on every session, so keep it under 1,024 characters and cut anything the body repeats.
- One outcome and a "done when" line. A skill that tries to do two jobs becomes two skills.
- Manual-only skills set `disable-model-invocation: true` and ship `agents/openai.yaml` with `policy: allow_implicit_invocation: false`.
- No personal data, no absolute home paths, no secrets. Personal settings belong in the user's profile file.

## Test a skill change

Run the check script, then try the skill against a realistic prompt under pressure: a deadline, a tempting shortcut, an ambiguous request. Watch where an agent ignores the skill, and tighten the wording at that point. Say in the pull request what you tried and what changed.

```bash
python3 scripts/check-skills.py
```

## Pull requests

- One topic per pull request. No drive-by formatting.
- Say if an agent wrote any of it, which one, and what you reviewed and ran yourself. You own the whole diff.
- Update `CHANGELOG.md` for any change a user would notice.
