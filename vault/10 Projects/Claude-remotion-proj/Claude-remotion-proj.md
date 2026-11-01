---
type: project
tags: [project, video, remotion]
status: active
repo: https://github.com/malz-0/Claude-remotion-proj
started: 2026-11-01
updated: 2026-11-01
---
# Claude-remotion-proj

Up: [[Home]]

## Goal
A reusable environment where Claude Code coordinates: **Remotion** for video,
**Obsidian** for knowledge, **Codex** for second-opinion coding, **GitHub** for source control.

## Current state
- Remotion 4 project with reusable components and a rendered `Showcase` reference video.
- Codex CLI installed and network-verified; **auth pending** — see [[Setup Actions]].
- This vault lives in the repo under `vault/` (git-tracked).

## Key notes
- [[Decision Log]] — why things are the way they are
- [[Progress Log]] — dated changes
- [[Agent Workflow]] — how work is split between agents
- Research: [[Remotion]], [[OpenAI Codex CLI]], [[Obsidian CLI and Headless]]

## Layout
| Path | Purpose |
|---|---|
| `src/` | Remotion compositions & components |
| `public/` | Fonts, audio, images (via `staticFile()`) |
| `scripts/codex-agent.sh` | Delegate/review with Codex |
| `scripts/vault-check.mjs` | Lint links & properties in this vault |
| `scripts/bootstrap-dev-env.sh` | Install Codex + Obsidian Headless + deps |
| `vault/` | This Obsidian vault |
