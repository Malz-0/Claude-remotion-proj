#!/usr/bin/env bash
# Thin, safe wrapper Claude Code uses to work alongside OpenAI Codex CLI.
#
#   scripts/codex-agent.sh status                      # installed? authenticated?
#   scripts/codex-agent.sh review [--base main | --uncommitted | --commit SHA] ["focus"]
#   scripts/codex-agent.sh ask "question"              # read-only second opinion / architecture
#   scripts/codex-agent.sh task <slug> "instructions"  # delegated coding in an isolated worktree
#
# Why a wrapper: `codex mcp-server` was removed upstream (see developers.openai.com/codex/mcp-server),
# so Codex is driven through its supported non-interactive CLI (`codex exec` / `codex review`).
# Outputs land in .codex-runs/ (git-ignored) so Claude can read and compare them.
#
# Safety rules baked in:
#   - review/ask run with a read-only sandbox.
#   - task runs in its own git worktree + branch (codex/<slug>), never in the main checkout,
#     so two agents never edit the same files at once. Claude reviews + tests before merging.
#   - Credentials come only from the environment (CODEX_API_KEY / OPENAI_API_KEY) or an existing
#     `codex login`; this script never prints them.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
RUNS="$ROOT/.codex-runs"
mkdir -p "$RUNS"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"

# The cloud sandbox routes HTTPS through a proxy with its own CA; harmless elsewhere.
if [[ -z "${SSL_CERT_FILE:-}" && -f /root/.ccr/ca-bundle.crt ]]; then
  export SSL_CERT_FILE=/root/.ccr/ca-bundle.crt
fi
# Prefer the documented automation variable; fall back to OPENAI_API_KEY.
if [[ -z "${CODEX_API_KEY:-}" && -n "${OPENAI_API_KEY:-}" ]]; then
  export CODEX_API_KEY="$OPENAI_API_KEY"
fi

die() { echo "codex-agent: $*" >&2; exit 1; }

need_codex() {
  command -v codex >/dev/null || die "Codex CLI not installed. Run scripts/bootstrap-dev-env.sh (npm i -g @openai/codex)."
}

authed() {
  [[ -n "${CODEX_API_KEY:-}" ]] && return 0
  codex login status 2>/dev/null | grep -qiv "not logged in"
}

need_auth() {
  authed || die "Codex is not authenticated. Add CODEX_API_KEY (or OPENAI_API_KEY) as an environment secret, or run 'codex login' locally. Never paste keys into chat."
}

cmd="${1:-status}"; shift || true
case "$cmd" in
  status)
    if command -v codex >/dev/null; then echo "installed: $(codex --version)"; else echo "installed: no"; fi
    if command -v codex >/dev/null && authed; then echo "auth: configured"; else echo "auth: missing"; fi
    ;;

  review)
    need_codex; need_auth
    out="$RUNS/review-$STAMP.md"
    args=()
    focus=""
    while [[ $# -gt 0 ]]; do
      case "$1" in
        --base|--commit) args+=("$1" "$2"); shift 2 ;;
        --uncommitted) args+=("$1"); shift ;;
        *) focus="$1"; shift ;;
      esac
    done
    [[ ${#args[@]} -eq 0 ]] && args=(--uncommitted)
    (cd "$ROOT" && codex review "${args[@]}" ${focus:+"$focus"}) | tee "$out"
    echo "codex-agent: review saved to ${out#$ROOT/}" >&2
    ;;

  ask)
    need_codex; need_auth
    [[ $# -ge 1 ]] || die "usage: ask \"question\""
    out="$RUNS/ask-$STAMP.md"
    codex exec -C "$ROOT" -s read-only --ephemeral -o "$out" "$*" >/dev/null
    cat "$out"
    echo "codex-agent: answer saved to ${out#$ROOT/}" >&2
    ;;

  task)
    need_codex; need_auth
    [[ $# -ge 2 ]] || die "usage: task <slug> \"instructions\""
    slug="$1"; shift
    [[ "$slug" =~ ^[a-z0-9][a-z0-9-]*$ ]] || die "slug must be kebab-case"
    branch="codex/$slug"
    wt="$ROOT/../$(basename "$ROOT")-codex-$slug"
    [[ -e "$wt" ]] && die "worktree $wt already exists (finish or remove it first)"
    git -C "$ROOT" worktree add -q -b "$branch" "$wt" HEAD
    # Reuse installed deps so Codex can run the project's checks.
    [[ -d "$ROOT/node_modules" && ! -e "$wt/node_modules" ]] && ln -s "$ROOT/node_modules" "$wt/node_modules"
    out="$RUNS/task-$slug-$STAMP.md"
    codex exec -C "$wt" -s workspace-write -o "$out" \
      "$*

Constraints: work only inside this worktree; do not commit; do not touch vault/ or secrets;
run 'npx tsc --noEmit && npx eslint src' if you change TypeScript; finish with a short summary of
what you changed and why." >/dev/null
    cat "$out"
    echo
    echo "codex-agent: Codex finished in $wt on branch $branch."
    echo "codex-agent: review with: git -C \"$wt\" diff   (then test, commit and merge — or discard with:"
    echo "             git worktree remove --force \"$wt\" && git branch -D $branch)"
    ;;

  *) die "unknown command '$cmd' (status | review | ask | task)" ;;
esac
