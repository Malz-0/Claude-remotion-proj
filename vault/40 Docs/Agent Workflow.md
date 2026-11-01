---
type: runbook
tags: [docs, workflow, agents]
updated: 2026-11-01
---
# Agent Workflow

Up: [[Home]] · Decisions: [[Decision Log]]

## Roles
| Tool | Role |
|---|---|
| Claude Code | Coordinator: plans, edits main checkout, runs tests, merges, documents |
| Codex CLI | Second agent: independent reviews, consults, isolated delegated tasks |
| Remotion | Video rendering ([[Remotion]]) |
| Obsidian vault | Decisions, research, progress (this vault) |
| GitHub | Source of truth; feature branches; PRs only on request |

## Loop for a change
1. Plan → note non-trivial decisions in the project's Decision Log.
2. Implement (Claude) **or** delegate: `scripts/codex-agent.sh task <slug> "…"` → own worktree + branch.
3. Verify: `npx tsc --noEmit && npx eslint src` (+ render stills for video work).
4. Independent review: `scripts/codex-agent.sh review --uncommitted` (or `--base main`).
5. Reconcile: for each Codex finding, reproduce or refute with evidence (test, render, docs).
   Accept if reproduced; reject with reason; if unresolved, record both views and ask the user.
6. Commit + push; append to Progress Log; update project note status.

## Rules
- One writer per file set: Codex never edits the main checkout; Claude never edits a Codex worktree
  while it runs.
- Codex sees repository contents (sent to OpenAI). Don't point it at personal notes or secrets.
- Never claim a tool worked unless it was run and its output checked.
