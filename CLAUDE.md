# Toolchain (Claude Code coordinates)

| Need | Tool | How |
|---|---|---|
| Video | Remotion | see "Video production defaults" below |
| Knowledge / docs | Obsidian vault in `vault/` | edit Markdown directly; `node scripts/vault-check.mjs` |
| Second coding agent / reviews | OpenAI Codex CLI | `scripts/codex-agent.sh status \| review \| ask \| task` |
| Source control | GitHub | feature branch, commit + push; PRs only when asked |
| Web/docs research | Firecrawl connector | prefer it for external data when its tools fit |

Setup: `bash scripts/bootstrap-dev-env.sh` installs Codex + Obsidian Headless + deps (idempotent).

## Plugins (ECC)
The user may have the ECC plugin (`ecc@ecc`, github.com/affaan-m/ECC) installed on their own machine.
Use its skills/agents/commands when they fit the task, but **this file takes precedence**: where ECC
rules, hooks or commands conflict with anything here (Remotion workflow, vault rules, Codex process,
branch/PR policy, no PRs unless asked), follow this file. If an ECC hook blocks or rewrites an action,
say so instead of working around it silently.

## Obsidian vault rules
- The vault is `vault/` (open it in Obsidian with *Open folder as vault*). Start at `vault/Home.md`.
- The `obsidian` CLI needs the desktop app running, so in cloud sessions edit files directly.
  If `command -v obsidian` succeeds and the app is running, prefer it (`obsidian search …`, `create`).
- Every note: YAML properties with `type`, `tags`, `updated` (+ `status` for projects/tasks);
  `[[wikilinks]]` up to its project or `Home`; new notes from `vault/Templates/`.
- Per project: `10 Projects/<name>/<name>.md`, `Decision Log.md`, `Progress Log.md`.
- After meaningful work: append to the Progress Log, record decisions (D-xxx) in the Decision Log,
  update `updated:`; run `node scripts/vault-check.mjs` (must report 0 errors) before committing.
- Never send vault contents to external services (Codex, web tools) without the user's OK.

## Working with Codex
- `codex mcp-server` was removed upstream; use the CLI wrapper, not MCP.
- Check `scripts/codex-agent.sh status` first. If auth is missing, say so and continue without Codex —
  never ask for keys in chat (user adds `CODEX_API_KEY` as an environment secret).
- Use Codex for: independent review of non-trivial diffs (`review --uncommitted` / `--base main`),
  second opinions on architecture/debugging (`ask`), and well-scoped parallel tasks (`task <slug>`),
  which run in their own git worktree + `codex/<slug>` branch.
- One writer per file set. Never edit files Codex is working on; never let Codex edit the main checkout.
- Treat Codex output as a peer's claims: reproduce or refute each with tests/renders/docs; record
  unresolved disagreements in the Decision Log and ask the user.
- Review the diff and run `tsc`/`eslint` (and renders for video) before accepting any Codex change.

# Video production defaults

**Remotion (https://www.remotion.dev/) is the default framework for every request to
create, edit, generate or animate a video.** Build it in code, render it, check it.
Don't just explain how — produce the MP4.

## Project
- Remotion 4.x, React 19, TypeScript. Entry: `src/index.ts` → `src/Root.tsx` (register compositions there).
- Official agent skills live in `.agents/skills/` (linked into `.claude/skills/`). Start with
  `remotion-best-practices`, then load the relevant sub-skill (markup, transitions, captions,
  render, maps, multimedia). Use `remotion-docs` / https://www.remotion.dev/docs/ for current APIs.
- Reusable building blocks: `src/theme.ts` (fonts, palette, easing), `src/components/`
  (`KineticTitle`, `BarChart`, `Captions`, `Backdrop`). `src/Showcase/` is a reference composition.
- Installed packages: `@remotion/transitions`, `@remotion/media` (`<Audio>`, `<Video>`),
  `@remotion/fonts`, `@remotion/google-fonts`, `@remotion/shapes`, `@remotion/paths`.
  Add more with `npx remotion add <pkg>` (keeps versions aligned).

## Workflow for each video
1. Clarify purpose, audience, style, length, aspect ratio (16:9 1920×1080, 9:16 1080×1920, 1:1 1080×1080) and fps (default 30).
2. Plan scenes + timeline in frames before coding.
3. One composition per deliverable in `src/<ProjectName>/`; reuse/extend `src/components/`.
4. Assets go in `public/` and are referenced with `staticFile()`. Only use assets the user
   supplied or that are clearly licensed for reuse (OFL fonts, CC0/royalty-free audio/images);
   otherwise generate them (SVG, CSS, ffmpeg-synthesised audio).
5. Animate only with `useCurrentFrame()` + `interpolate()` / `spring()` — never CSS transitions/animations.
   Use `TransitionSeries` for scene changes; `fps` from `useVideoConfig()` for all second→frame math.
6. Verify: `npx tsc --noEmit && npx eslint src`, then render stills at key frames and inspect them:
   `npx remotion render <Id> out/frames --frames=0,60,120 --image-format=png`
7. Render: `npx remotion render <Id> out/<name>.mp4 --codec=h264 --crf=18`
8. Check output with `ffprobe` (resolution, fps, duration, audio stream) and
   `ffmpeg -i out/<name>.mp4 -af volumedetect -f null -` (aim for max ≈ -6 to -10 dB). Fix and re-render.
9. Never claim a render succeeded unless the command finished and the file was verified.

The Remotion skill says "don't render unless asked" — for this user, rendering the final MP4
**is** the ask. Always render.

## Environment gotchas (cloud sandbox)
- Headless Chrome doesn't trust the sandbox HTTPS proxy CA, so `@remotion/google-fonts` and
  remote URLs fail at render time (`ERR_CERT_AUTHORITY_INVALID`). Self-host instead: download with
  `curl` (which does trust the proxy) into `public/` and load via `@remotion/fonts` / `staticFile()`.
  Do not disable TLS verification.
- `out/` is git-ignored; deliver renders to the user directly rather than committing them.

## Quality bar
Deliberate design over templates: one type pairing, a restrained palette with a single accent,
consistent easing (`easeOutExpo` in `theme.ts`), generous safe margins (≥ 8% from edges for text),
readable sizes (body ≥ 30px at 1080p), captions in a lower-third with contrast backing.
