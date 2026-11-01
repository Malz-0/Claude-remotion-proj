---
type: research
tags: [research, remotion, video]
source: https://www.remotion.dev/docs/
updated: 2026-11-01
---
# Remotion

Related: [[Claude-remotion-proj]]

- React components rendered frame-by-frame by headless Chrome, encoded with FFmpeg.
- Animate only with `useCurrentFrame()` + `interpolate()` / `spring()`; CSS animations don't render.
- `TransitionSeries` (`@remotion/transitions`) for scene cuts; `@remotion/media` for `<Audio>`/`<Video>`.
- Assets in `public/`, referenced with `staticFile()`.
- Scaffold: `npx create-video@latest --yes --blank <dir>`; agent skills: `npx remotion skills add`.
- Render: `npx remotion render <Id> out/x.mp4 --codec=h264 --crf=18`; stills: `--frames=0,60 --image-format=png`.
- Licence: free for individuals and teams ≤ 3; companies need a licence (remotion.pro/license).
