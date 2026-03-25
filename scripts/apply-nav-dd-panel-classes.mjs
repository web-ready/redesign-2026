import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const A =
  'class="w-max max-w-[min(22rem,calc(100vw-2rem))] min-w-[15rem] rounded-2xl border border-white/10 bg-[#111111] py-3 pl-2 pr-3 shadow-2xl"';
const B =
  'class="w-max max-w-[min(19rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#111111] py-2 pl-2 pr-2.5 shadow-2xl"';

for (const f of fs.readdirSync(publicDir)) {
  if (!f.endsWith('.html')) continue;
  const fp = path.join(publicDir, f);
  let t = fs.readFileSync(fp, 'utf8');
  if (!t.includes('data-site-nav-dropdown')) continue;
  const n = t.replaceAll(A, 'class="nav-dd-panel nav-dd-panel--initiatives"').replaceAll(
    B,
    'class="nav-dd-panel nav-dd-panel--company"'
  );
  if (n !== t) {
    fs.writeFileSync(fp, n);
    console.log('updated', f);
  }
}
