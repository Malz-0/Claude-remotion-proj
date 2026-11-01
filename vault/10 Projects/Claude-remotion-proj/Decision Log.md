---
type: decision-log
tags: [decisions, project]
project: "[[Claude-remotion-proj]]"
updated: 2026-11-01
---
# Decision Log

Up: [[Claude-remotion-proj]] · Template: `Templates/Decision`

## D-001 · Remotion is the default video framework — 2026-11-01
- **Context:** user wants professional, programmatic video.
- **Decision:** every video request is built with Remotion and rendered to MP4.
- **Consequences:** reusable components in `src/components/`; see [[Remotion]].

## D-002 · Self-host fonts instead of Google Fonts at render time — 2026-11-01
- **Context:** headless Chrome in the cloud sandbox rejects the proxy CA (`ERR_CERT_AUTHORITY_INVALID`).
- **Decision:** download OFL fonts into `public/fonts`, load with `@remotion/fonts`. Never disable TLS checks.
- **Consequences:** deterministic, offline-capable renders.

## D-003 · Drive Codex via `codex exec` / `codex review`, not MCP — 2026-11-01
- **Context:** OpenAI removed `codex mcp-server`; the replacement (app-server) is a JSON-RPC protocol,
  explicitly *not* MCP, and marked experimental. Third-party MCP wrappers exist but add an
  unvetted dependency that would see the code and the API key.
- **Decision:** use the official CLI through `scripts/codex-agent.sh` (read-only for review/ask;
  isolated git worktree for delegated tasks).
- **Consequences:** no MCP config to maintain; Claude reads Codex output from `.codex-runs/`.
  Revisit if OpenAI ships an official MCP endpoint. See [[OpenAI Codex CLI]].

## D-004 · Vault in git, edited as Markdown — 2026-11-01
- **Context:** the official Obsidian CLI requires the desktop app running; the cloud sandbox has no GUI.
  Headless Sync needs an Obsidian Sync subscription + account login.
- **Decision:** keep the vault as plain Markdown in git (`vault/`); Claude edits files directly and
  validates with `scripts/vault-check.mjs`. Optional: Obsidian Git plugin or Headless Sync later.
- **Consequences:** works everywhere; no credentials needed. See [[Obsidian CLI and Headless]].

## D-005 · One writer per file set — 2026-11-01
- **Decision:** Codex only writes inside its own worktree/branch; Claude merges after diff review +
  `tsc`/`eslint`/render checks. See [[Agent Workflow]].
