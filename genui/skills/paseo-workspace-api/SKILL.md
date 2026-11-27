---
name: paseo-workspace-api
description: Inspect the Paseo sidebar through the workspace API. Use to find workspace IDs, list status and labels, or add workspace labels without navigating the GUI.
---

# Paseo workspace API

Use the `paseo` skill for host discovery and ordinary workspace operations. MCP `list_workspaces` and `paseo workspace ls --json` are enough to identify a workspace. On the release this skill was tested with (CLI and SDK 0.17.4), those lists leave out workspace status and sidebar labels. Agent labels are a separate feature.

## Inspect the sidebar

1. Use Paseo MCP `list_hosts` to identify the intended daemon. The helper below targets the running local daemon discovered by `paseo status --json`. For a remote host, use its MCP tools for discovery and run the helper on that host if authorized.
2. Run the helper from any directory. Resolve `skill_dir` to the directory containing this file. The helper caches the SDK version matching the CLI under the user's cache directory. It uses Paseo's local CLI credential without printing it.
3. Match the workspace by project, directory and title. Use its full `wks_…` ID for changes. The same directory may have several workspaces.

```bash
node "$skill_dir/scripts/workspaces.mjs" list
node "$skill_dir/scripts/workspaces.mjs" list --include-background
node "$skill_dir/scripts/workspaces.mjs" labels
```

The list returns compact JSON. Filter or summarize it before showing the user. If the CLI reports the local daemon unreachable inside a sandbox, retry the same read through the approved host shell. For a real connection or authentication failure, use the `paseo-help` diagnostics.

## Interpret and update

- Workspace `status` summarizes activity. Live values include `running`, `attention`, and `done`. Preserve any other status returned by Paseo. For the reason behind attention, use MCP `list_agents` and inspect `requiresAttention` and `attentionReason` for the workspace's agents. If several workspaces share a directory, use the CLI workspace IDs to match agents.
- For actual task completion, check the task in the user's own task list. The workspace status alone does not show it.
- Workspace labels describe ownership. Use an existing label if its name matches. Leave unclear ownership to the user. The helper adds one label and verifies the saved assignment. Existing labels stay in place. The optional color applies when creating a label, with `sky` as the default.

```bash
node "$skill_dir/scripts/workspaces.mjs" add-label wks_FULL_ID "Personal Admin" sky
```

The helper uses the exported Node client and Paseo's lower-level workspace label calls, verified on CLI and SDK 0.17.4. If a version lacks these calls, check the current SDK before attempting writes. For local sidebar display preferences such as grouping and sort order, use desktop controls when requested.

[Paseo SDK workspaces](https://paseo.sh/docs/sdk/workspaces) · [Workspace label implementation](https://github.com/getpaseo/paseo/pull/3510)
