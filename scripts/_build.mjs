import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_PAGES = join(ROOT, 'src', 'pages');
const SRC_PARTIALS = join(ROOT, 'src', 'partials');
const OUT = join(ROOT, 'public');
const INCLUDE_RE = /\{\{\s*include\s+([^\s}]+)\s*\}\}/g;

function baseFor(rel) {
  const parts = rel.split(sep).filter(Boolean);
  return '../'.repeat(parts.length - 1);
}
function render(content, vars, depth = 0) {
  if (depth > 5) throw new Error('include depth');
  content = content.replace(INCLUDE_RE, (_, n) =>
    render(readFileSync(join(SRC_PARTIALS, n), 'utf8'), vars, depth + 1)
  );
  for (const [k, v] of Object.entries(vars)) {
    content = content.split('{{' + k + '}}').join(v);
  }
  return content;
}
function* walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (p.endsWith('.html')) yield p;
  }
}
let n = 0;
for (const p of walk(SRC_PAGES)) {
  const rel = relative(SRC_PAGES, p);
  const out = join(OUT, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render(readFileSync(p, 'utf8'), { base: baseFor(rel) }), 'utf8');
  n++;
}
console.log('Built', n, 'pages');
