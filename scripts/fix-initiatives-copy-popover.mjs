import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const initiativesPopoverCls =
  'absolute top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 z-[120] nav-dd-initiatives-popover';

const rePop =
  /<div class="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 z-\[120\]">(\s*)(<div data-site-nav-dropdown class="nav-dd-panel nav-dd-panel--initiatives">)/g;

for (const f of fs.readdirSync(publicDir)) {
  if (!f.endsWith('.html')) continue;
  const fp = path.join(publicDir, f);
  let h = fs.readFileSync(fp, 'utf8');
  if (!h.includes('nav-dd-panel--initiatives')) continue;
  const n = h
    .replace(
      /See the full portfolio—subsidiaries, projects, and accountability in one view\./g,
      'See the full portfolio and all our initiatives in one place.'
    )
    .replace(
      /See the full portfolio, all our initiatives, subsidiaries, projects, and accountability in one view\./g,
      'See the full portfolio and all our initiatives in one place.'
    )
    .replace(
      /Live metrics, transparency, and programme outcomes\./g,
      'Live metrics, transparency, and program outcomes.'
    )
    .replace(/z-\[120\]"> nav-dd-initiatives-popover">/g, 'z-[120] nav-dd-initiatives-popover">')
    .replace(rePop, `<div class="${initiativesPopoverCls}">$1$2`);
  if (n !== h) {
    fs.writeFileSync(fp, n);
    console.log('updated', f);
  }
}
