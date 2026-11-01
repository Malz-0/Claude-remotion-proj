---
type: research
tags: [research, codex, agents]
source: https://developers.openai.com/codex
updated: 2026-11-01
---
# OpenAI Codex CLI

Related: [[Agent Workflow]] · [[Decision Log]]

- Install: `npm i -g @openai/codex` (Apache-2.0, github.com/openai/codex). Verified: v0.166.0.
- Non-interactive: `codex exec [-s read-only|workspace-write] [-C dir] [-o last-message.md] "prompt"`.
  Default sandbox for `exec` is read-only. `--output-schema` for structured JSON.
- Reviews: `codex review --uncommitted | --base <branch> | --commit <sha> ["focus"]`.
- Auth (headless): env `CODEX_API_KEY` (documented for automation), or
  `printenv OPENAI_API_KEY | codex login --with-api-key`, or `--with-access-token`.
  Browser login needs a local browser — not usable in the cloud sandbox.
- **MCP:** `codex mcp-server` was **removed**. Replacement `codex app-server` speaks its own JSON-RPC
  (not MCP, experimental). Codex can still *consume* MCP servers via `codex mcp add`.
- Codex reads `AGENTS.md` for project instructions (repo root has one).
- Sandbox note: in the cloud container HTTPS goes through a proxy; `codex doctor` warns that the
  WebSocket transport fails but HTTPS fallback works.
