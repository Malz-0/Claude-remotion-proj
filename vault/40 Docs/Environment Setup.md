---
type: runbook
tags: [docs, setup]
updated: 2026-11-01
---
# Environment Setup

Up: [[Home]] · Manual steps: [[Setup Actions]]

## Verified in cloud sandbox (2026-11-01)
| Item | State |
|---|---|
| Node 22, npm, git, ffmpeg, Chromium | ✅ present |
| Remotion render → MP4 | ✅ rendered & probed |
| Firecrawl connector | ✅ used |
| GitHub (branch push) | ✅ |
| Codex CLI 0.166.0 | ✅ installed · ✅ reaches OpenAI · ❌ no credentials |
| Codex as MCP server | ⛔ removed upstream — using CLI wrapper instead |
| Obsidian desktop / `obsidian` CLI | ⛔ needs GUI app; not possible here |
| Obsidian Headless `ob` 0.0.14 | ✅ installed · ❌ not logged in (needs Sync subscription) |
| Your local vault | ❌ not reachable (no Remote Control folders shared) |

## Reuse in a new project
1. Copy `CLAUDE.md`, `AGENTS.md`, `scripts/`, and `vault/` (empty the project folder) into the repo.
2. Run `bash scripts/bootstrap-dev-env.sh` (or set it as the environment setup script).
3. Add `CODEX_API_KEY` as an environment secret.
