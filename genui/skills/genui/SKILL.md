---
name: genui
description: Use before writing your first ```ui block (Paseo inline UI) in a session, and whenever a reply holds a table, plan, comparison, decision, form, test or log result, or a list of choices; it gives the exact syntax so the block renders. Skip it if the "Inline UI reference" is already in your context.
---

# Paseo ```ui in 1 minute

Use ```ui by default in Paseo for tables, plans, comparisons, choices, forms and results. Open with one plain sentence outside the block (previews show only text); the block carries the rest. Wrap each UI in one `Card(title, children)`.

## Syntax
- One statement per line. State: `$x = ""`, `$ch = []`, `$n = 8`. Inputs bind to state. Named args go last. No `if`, `for` or reassignment.
- `Load("path")` reads JSON, CSV or text from a file. Never retype data a file holds.

## Components I use most
- Layout: `Card(title, [..])` `Row([..])` `Grid([..], columns)` `Tabs(labels, [..])` `Details(title, [..])`
- Content: `Text(md)` `Callout(text, tone:, title:)` `Metric(label, value, note)` `Badge(text, tone:)` `KeyValue({k: v})` `List([{title, detail, value}])`
- Data: `Table(columns, rows)` `Steps([{title, detail, status: done|current|blocked}])` `Chart(type, labels, series)` `Diff(patch)` `Code(code, lang)` `Logs(Load(f), cmd, exit)` `Tests(Load(f))` `Findings([{severity, title, file, line, detail, fix}])`
- Decide: `Plan([{title, detail, risk}])` `Decision(options, criteria)` `Button(label, action, variant: "primary")` `FollowUps([..])`
- Tones: neutral | good | warn | bad | info.

## Asking the user (one batched Form)
```ui
$pick = ""
$notes = ""
Card("A few questions", [Form([
  Radio($pick, [{value: "a", detail: "Safe"}, {value: "b", detail: "Faster"}], label: "Which one?"),
  TextArea($notes, label: "Anything else, or anything I missed?")
], submit: "Send answers")])
```
Rules: `Form(children, submit:)` takes input components, never a title string. Every input's first argument is a declared `$state`. Always end with an open-ended `TextArea`. Inputs: `Select Radio Choice Checklist Toggle Slider Stepper Input TextArea ListEditor EditableTable DateInput Rating OptionCards`.

## Never
- Markdown tables or pasted output when a component fits.
- `Form("title", [...])`, `Select("name", ...)`, undeclared `$x`, unknown component names.
- ```ui in files, commits, PR text or progress notes.

If your setup runs a lint hook on ```ui blocks and it reports errors, resend the reply with them fixed.
