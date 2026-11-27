---
name: checkpoint
description: Stop work cleanly with a resume note, or resume from one without redoing work. Use for "pause", "stop here", "I need to go", "save where we are", "hand this off", "resume", "pick up where we left off", or before a session runs out of context.
---

# Checkpoint

The next session, or another agent, starts where this one stopped instead of from scratch.

Two modes: **pause** and **resume**. "Keep going", "don't stop" and "I'm going to bed, keep working" are not pauses.

## Pause

1. **Stop between steps.** Finish the current small step or undo it. Start nothing new. Stop any subagents you started.
2. **Take no irreversible step to pause.** No push, no PR, no deploy, no message to anyone.
3. **Make the work durable.** In a git repo, commit uncommitted edits as one `wip:` commit on the current branch, unless the user said not to commit. If the code does not build, say so in one line of the commit body.
4. **Write the resume note.** In a git repo, write it to `.git/momentum/checkpoint.md`, which git never commits and a reboot does not clear. Otherwise use the system temp folder and give the full path. The note holds:
   - the goal, in one sentence
   - what is done and verified, with the command that proved it
   - what is in progress and where it stopped
   - the next action, specific enough to start at once
   - key files, and details that would mislead someone reading the note fresh
   - open decisions waiting on the user
   Point at specs, commits and issues by path or link instead of copying them. Leave out secrets.
5. **Reply** with where the work stands, the commit if you made one, the note's path, and the first action on resume.

## Resume

1. **Find the record**: the resume note if one exists, else the latest session transcript for this workspace, else `git log` and the progress tracker. Read only this workspace's history.
2. **Rebuild the state**: branch, what landed (`git log`, `git diff` against the base), open tasks, decisions made. Trust what the record says is done. Do not redo finished work to check it from scratch.
3. **Name the resume point**: what is done, what is left, and the next action.
4. **Verify inherited claims** on the real artifact before building on them (skill `verify`). A past "tests pass" is not proof today.
5. **Continue**, or report the resume point first if a decision from the note is still open.

## Handoff to another agent

Same as pause, but write the note for a reader with no context, add which skills the next agent should load, and brief it with the `brief` skill.
