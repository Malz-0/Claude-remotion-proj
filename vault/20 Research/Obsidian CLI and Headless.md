---
type: research
tags: [research, obsidian, pkm]
source: https://obsidian.md/help/cli
updated: 2026-11-01
---
# Obsidian CLI and Headless

Related: [[Environment Setup]] · [[Decision Log]]

## Obsidian CLI (`obsidian`)
- Enable in **Settings → General → Command line interface**, then register it on PATH.
- **Requires the Obsidian desktop app to be running** — talks to the live app.
- Commands: `obsidian search query=…`, `read`, `create name=… template=…`, `daily:append content=…`,
  `tags counts`, `unresolved`, `vault="Name" … format=json`.
- Not usable in a headless cloud container. Usable if Claude runs on your own computer
  (desktop app / Remote Control) with Obsidian open.

## Obsidian Headless (`ob`, npm `obsidian-headless`, open beta)
- Sync and Publish without the app; needs an **Obsidian Sync subscription**.
- `ob login` (email/password/MFA — interactive), `ob sync-list-remote`, `ob sync-setup --vault …`,
  `ob sync [--continuous]`, `ob sync-config --mode pull-only|bidirectional|mirror-remote`.
- Don't run desktop Sync and Headless Sync on the same device.

## Vault basics
- A vault is just a folder of Markdown; config in `.obsidian/`.
- Links `[[Note]]`, headings `[[Note#Heading]]`, aliases `[[Note|text]]`, embeds `![[Note]]`.
- Properties = YAML front matter; tags `#tag` or `tags:` property; Templates core plugin.
