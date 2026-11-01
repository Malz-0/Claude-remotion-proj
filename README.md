# Claude-remotion-proj

Programmatic video production with [Remotion](https://www.remotion.dev/).

```bash
npm install
npm run dev                                   # Remotion Studio (live preview)
npx remotion render Showcase out/showcase.mp4 # render the reference video
```

- `src/components/` – reusable pieces: kinetic titles, animated bar chart, captions, backdrop
- `src/theme.ts` – fonts (self-hosted in `public/fonts`), palette, easing
- `src/Showcase/` – 11 s reference composition (transitions, chart, captions, audio)
- `.agents/skills/` – official Remotion agent skills

See `CLAUDE.md` for the production workflow.

## Toolchain
| | |
|---|---|
| `vault/` | Obsidian vault (open folder as vault) — start at `Home.md` |
| `scripts/codex-agent.sh` | Codex CLI: `status`, `review`, `ask`, `task` |
| `scripts/vault-check.mjs` | Validate vault links/properties |
| `scripts/bootstrap-dev-env.sh` | Install Codex + Obsidian Headless + deps |
| `AGENTS.md` | Instructions Codex reads |
