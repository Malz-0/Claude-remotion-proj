---
type: tasks
tags: [tasks, setup]
status: open
updated: 2026-11-01
---
# Setup Actions (only you can do these)

Up: [[Home]] · Context: [[Environment Setup]]

- [ ] **Codex auth:** create an OpenAI API key, add it to the cloud environment as `CODEX_API_KEY`
      (environment settings → Edit → secrets / env vars). Start a new session. Never paste it in chat.
- [ ] **Persist installs:** set the environment *setup script* to `bash scripts/bootstrap-dev-env.sh`.
- [ ] **Open the vault:** clone the repo locally → Obsidian → *Open folder as vault* → `vault/`.
- [ ] Optional: Obsidian Git community plugin to auto-pull/push the vault.
- [ ] Optional: dedicated private repo for a cross-project vault (tell Claude its name to attach it).
- [ ] Optional: Obsidian Sync users — `ob login` + `ob sync-setup` yourself in a terminal.
- [ ] Optional: to use the live `obsidian` CLI, run Claude Code on your computer with Obsidian open,
      or share the vault folder via Remote Control.
