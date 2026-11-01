#!/usr/bin/env node
// Lints an Obsidian vault without the Obsidian app:
//   - every [[wikilink]] resolves to a note (by basename or vault-relative path)
//   - every note (outside Templates/) has YAML properties with `type` and `tags`
//   - lists orphan notes (no inbound links) as warnings
// Usage: node scripts/vault-check.mjs [vaultDir=vault]
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, basename, extname } from "node:path";

const vault = process.argv[2] ?? "vault";
const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    if (n.startsWith(".")) return [];
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : extname(p) === ".md" ? [p] : [];
  });

const files = walk(vault);
const byName = new Map();
for (const f of files) {
  const rel = relative(vault, f).replace(/\.md$/, "");
  byName.set(basename(rel).toLowerCase(), rel);
  byName.set(rel.toLowerCase(), rel);
}

const errors = [];
const inbound = new Map(files.map((f) => [relative(vault, f).replace(/\.md$/, ""), 0]));
for (const f of files) {
  const rel = relative(vault, f).replace(/\.md$/, "");
  const text = readFileSync(f, "utf8");
  const isTemplate = rel.startsWith("Templates/");
  if (!isTemplate) {
    const fm = text.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) errors.push(`${rel}: missing properties block`);
    else for (const k of ["type", "tags"]) if (!new RegExp(`^${k}:`, "m").test(fm[1])) errors.push(`${rel}: missing property '${k}'`);
  }
  const body = text.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
  for (const m of body.matchAll(/!?\[\[([^\]|#^]+)(?:[#^][^\]|]*)?(?:\|[^\]]*)?\]\]/g)) {
    const target = m[1].trim().toLowerCase();
    const hit = byName.get(target);
    if (!hit) { if (!isTemplate) errors.push(`${rel}: broken link [[${m[1]}]]`); }
    else if (hit !== rel) inbound.set(hit, (inbound.get(hit) ?? 0) + 1);
  }
}

const orphans = [...inbound].filter(([n, c]) => c === 0 && n !== "Home" && !n.startsWith("Templates/"));
console.log(`vault-check: ${files.length} notes, ${errors.length} errors, ${orphans.length} orphans`);
for (const e of errors) console.log(`  ERROR ${e}`);
for (const [n] of orphans) console.log(`  warn  orphan: ${n}`);
process.exit(errors.length ? 1 : 0);
