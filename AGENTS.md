# Instructions for coding agents (read by OpenAI Codex; Claude Code reads CLAUDE.md)

- Project: Remotion 4 + React 19 + TypeScript video project. Compositions in `src/`, assets in `public/`.
- Animate only with `useCurrentFrame()` + `interpolate()`/`spring()`; no CSS animations/transitions.
- Before finishing, run: `npx tsc --noEmit && npx eslint src`.
- Stay inside the working directory you were given. Do not commit, push, or edit `vault/`, `.env*`,
  or anything containing credentials.
- When reviewing: report concrete, reproducible issues (file:line, failure scenario), most severe first.
  Skip style nits unless asked.
