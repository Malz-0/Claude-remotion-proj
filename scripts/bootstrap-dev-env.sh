#!/usr/bin/env bash
# Idempotent dev-environment bootstrap. Safe to use as a cloud environment *setup script*
# or to run by hand on a new machine. Installs tools only — never handles credentials.
#
#   bash scripts/bootstrap-dev-env.sh
set -euo pipefail

CODEX_VERSION="${CODEX_VERSION:-0.166.0}"
OB_VERSION="${OB_VERSION:-0.0.14}"

have() { command -v "$1" >/dev/null 2>&1; }

have node || { echo "Node.js >= 20 is required" >&2; exit 1; }

# OpenAI Codex CLI (Apache-2.0, github.com/openai/codex)
if ! have codex || [[ "$(codex --version 2>/dev/null)" != *"$CODEX_VERSION"* ]]; then
  npm install -g "@openai/codex@$CODEX_VERSION"
fi

# Obsidian Headless (official, github.com/obsidianmd/obsidian-headless) — only useful with an
# Obsidian Sync subscription; harmless otherwise.
if ! have ob; then
  npm install -g "obsidian-headless@$OB_VERSION" || echo "warn: obsidian-headless install failed (optional)" >&2
fi

# Project dependencies (Remotion etc.), when run from a repo that has them.
if [[ -f package-lock.json ]]; then npm ci --no-audit --no-fund; fi

echo "bootstrap: codex=$(codex --version 2>/dev/null || echo missing) ob=$(ob --version 2>/dev/null || echo missing)"
