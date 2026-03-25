/**
 * One-off style patch: replace desktop mega-menu panels with tighter width, icons, and
 * data-site-nav-dropdown for header external-link hover (see site.js).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

function getIndentBefore(html, idx) {
  const lineStart = html.lastIndexOf('\n', idx - 1) + 1;
  return html.slice(lineStart, idx);
}

/** Find index just after the closing </div> that matches the opening <div> at openIdx. */
function endOfMatchingDiv(html, openIdx) {
  const tagStart = html.indexOf('<div', openIdx);
  if (tagStart !== openIdx) return -1;
  let depth = 1;
  let i = openIdx + 4;
  while (i < html.length && depth > 0) {
    const o = html.indexOf('<div', i);
    const c = html.indexOf('</div>', i);
    if (c === -1) return -1;
    if (o !== -1 && o < c) {
      depth++;
      i = o + 4;
    } else {
      depth--;
      i = c + 6;
    }
  }
  return i;
}

const ICON = (paths) =>
  `<svg class="nav-dd-icon shrink-0 w-4 h-4 text-gray-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">${paths}</svg>`;

function linkRow(href, label, iconPaths, extraCls = '', innerAfterSpan = '') {
  const cls = 'nav-dd-link' + (extraCls ? ' ' + extraCls : '');
  return (
    `<a href="${href}" class="${cls}">` +
    ICON(iconPaths) +
    `<span class="whitespace-nowrap">${label}</span>` +
    innerAfterSpan +
    `</a>`
  );
}

/** Initiatives mega-menu row: title + description, icon on the right. */
function initRow(href, title, desc, iconPaths, extraCls = '') {
  const cls = 'nav-dd-link nav-dd-link--init' + (extraCls ? ' ' + extraCls : '');
  return (
    `<a href="${href}" class="${cls}">` +
    `<span class="nav-dd-link-stack">` +
    `<span class="nav-dd-link-title">${title}</span>` +
    `<span class="nav-dd-link-desc">${desc}</span>` +
    `</span>` +
    ICON(iconPaths) +
    `</a>`
  );
}

/** Same row layout without trailing icon (Subsidiaries / Projects items). */
function initRowNoIcon(href, title, desc, extraCls = '') {
  const cls = 'nav-dd-link nav-dd-link--init' + (extraCls ? ' ' + extraCls : '');
  return (
    `<a href="${href}" class="${cls}">` +
    `<span class="nav-dd-link-stack">` +
    `<span class="nav-dd-link-title">${title}</span>` +
    `<span class="nav-dd-link-desc">${desc}</span>` +
    `</span>` +
    `</a>`
  );
}

const paths = {
  grid:
    '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0113.5 8.25V6zM3.75 15.75a2.25 2.25 0 012.25-2.25h2.25a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 15.75c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />',
  chart:
    '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />',
  book:
    '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />',
  /** Viewfinder + center mark — reads as aim / focus (“our mission”) (Heroicons 24 outline). */
  mission:
    '<path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />',
  user:
    '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />',
  users:
    '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />',
  doc:
    '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />',
  news:
    '<path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M13.5 7.5h-9v9h9v-9z" />',
  heart:
    '<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />',
};

function buildInitiativesPanel(I) {
  const I1 = I + '  ';
  const I2 = I1 + '  ';
  const I3 = I2 + '  ';
  const li = (a) => `${I2}<li>\n${I3}${a}\n${I2}</li>`;
  const impactLink =
    `<a href="https://impact.oasisofchange.com" target="_blank" rel="noopener noreferrer" class="nav-dd-link nav-dd-link--init">` +
    `<span class="nav-dd-link-stack">` +
    `<span class="nav-dd-link-title">Impact Dashboard</span>` +
    `<span class="nav-dd-link-desc">Live metrics, transparency, and program outcomes.</span>` +
    `</span>` +
    ICON(paths.chart) +
    `</a>`;
  return (
    `<div data-site-nav-dropdown class="nav-dd-panel nav-dd-panel--initiatives">\n` +
    `${I1}<div class="nav-dd-initiatives-top">\n` +
    `${I2}<ul>\n` +
    `${I3}<li>\n` +
    `${I3}  ${initRow(
      'initiatives.html',
      'All initiatives',
      'See the full portfolio and all our initiatives in one place.',
      paths.grid,
      'font-medium'
    )}\n` +
    `${I3}</li>\n` +
    `${I2}</ul>\n` +
    `${I1}</div>\n` +
    `${I1}<div class="nav-dd-initiatives-split">\n` +
    `${I2}<div class="nav-dd-initiatives-col">\n` +
    `${I3}<p class="nav-dd-kicker">Subsidiaries</p>\n` +
    `${I3}<ul>\n` +
    `${I3}  <li>\n` +
    `${I3}    ${initRowNoIcon(
      'web-ready.html',
      'Web-Ready',
      'Lower-carbon, accessible websites and digital grants support.'
    )}\n` +
    `${I3}  </li>\n` +
    `${I3}  <li>\n` +
    `${I3}    ${initRowNoIcon(
      'vcasse.html',
      'VCASSE',
      'Venture capacity building for social and environmental enterprise.'
    )}\n` +
    `${I3}  </li>\n` +
    `${I3}</ul>\n` +
    `${I2}</div>\n` +
    `${I2}<div class="nav-dd-initiatives-col">\n` +
    `${I3}<p class="nav-dd-kicker">Projects</p>\n` +
    `${I3}<ul>\n` +
    `${I3}  <li>\n` +
    `${I3}    ${initRowNoIcon(
      'sustainable-technology-week.html',
      'Sustainable Technology Week',
      'A focused week of programming on sustainable technology and culture.'
    )}\n` +
    `${I3}  </li>\n` +
    `${I3}  <li>\n` +
    `${I3}    ${initRowNoIcon(
      'wra_platform.html',
      'WRA Platform',
      'Web-Ready Access tools, standards, and platform workstreams.'
    )}\n` +
    `${I3}  </li>\n` +
    `${I3}</ul>\n` +
    `${I2}</div>\n` +
    `${I1}</div>\n` +
    `${I1}<div class="nav-dd-initiatives-foot">\n` +
    `${I2}<p class="nav-dd-kicker">Accountability</p>\n` +
    `${I2}<ul>\n` +
    `${I3}<li>\n${I3}  ${impactLink}\n${I3}</li>\n` +
    `${I2}</ul>\n` +
    `${I1}</div>\n` +
    `</div>`
  );
}

function buildCompanyPanel(I, withNonprofits) {
  const I1 = I + '  ';
  const I2 = I1 + '  ';
  const I3 = I2 + '  ';
  const li = (a) => `${I2}<li>\n${I3}${a}\n${I2}</li>`;
  const rows = [
    linkRow('about.html', 'Our Story', paths.book),
    linkRow('about.html#OurMission', 'Our Mission', paths.mission),
    linkRow('gabriel-dalton.html', 'Our Founder', paths.user),
    linkRow('about.html#our-board', 'Our Board', paths.users),
    linkRow('annual_reports.html', 'Annual Reports', paths.doc),
    linkRow('news_release.html', 'News / Press', paths.news),
  ];
  if (withNonprofits) {
    rows.push(linkRow('nonprofits.html', 'For Nonprofits', paths.heart));
  }
  return (
    `<div data-site-nav-dropdown class="nav-dd-panel nav-dd-panel--company">\n` +
    `${I1}<ul class="flex flex-col gap-0.5">\n` +
    rows.map((r) => li(r)).join('\n') +
    `\n${I1}</ul>\n` +
    `</div>`
  );
}

function patchContent(html) {
  const initNeedle = '<div class="w-[340px] rounded-2xl border border-white/10 bg-[#111111] p-5 shadow-2xl">';
  const coNeedle = '<div class="w-[300px] rounded-2xl border border-white/10 bg-[#111111] p-5 shadow-2xl">';

  let i = html.indexOf(initNeedle);
  if (i === -1) return { html, changed: false };
  const I0 = getIndentBefore(html, i);
  const endI = endOfMatchingDiv(html, i);
  if (endI < 0) throw new Error('Unbalanced initiatives panel');

  let j = html.indexOf(coNeedle, endI);
  if (j === -1) return { html, changed: false };
  const I1 = getIndentBefore(html, j);
  const endC = endOfMatchingDiv(html, j);
  if (endC < 0) throw new Error('Unbalanced company panel');

  const innerCo = html.slice(j, endC);
  const withNp = innerCo.includes('href="nonprofits.html"');

  const next =
    html.slice(0, i) + buildInitiativesPanel(I0) + html.slice(endI, j) + buildCompanyPanel(I1, withNp) + html.slice(endC);

  return { html: next, changed: true };
}

const INIT_PANEL_MARK = '<div data-site-nav-dropdown class="nav-dd-panel nav-dd-panel--initiatives">';
function replaceInitiativesMega(html) {
  const i = html.indexOf(INIT_PANEL_MARK);
  if (i === -1) return { html, changed: false };
  const indent = getIndentBefore(html, i);
  const end = endOfMatchingDiv(html, i);
  if (end < 0) throw new Error('Unbalanced initiatives panel');
  return { html: html.slice(0, i) + buildInitiativesPanel(indent) + html.slice(end), changed: true };
}

const rebuildInit = process.argv.includes('--rebuild-initiatives');
if (rebuildInit) {
  let nr = 0;
  for (const f of fs.readdirSync(publicDir)) {
    if (!f.endsWith('.html')) continue;
    const fp = path.join(publicDir, f);
    const raw = fs.readFileSync(fp, 'utf8');
    const { html, changed } = replaceInitiativesMega(raw);
    if (changed) {
      fs.writeFileSync(fp, html);
      console.log('rebuilt initiatives', f);
      nr++;
    }
  }
  console.log('done initiatives,', nr, 'files');
} else {
  const files = fs.readdirSync(publicDir).filter((f) => f.endsWith('.html'));
  let n = 0;
  for (const f of files) {
    const fp = path.join(publicDir, f);
    const raw = fs.readFileSync(fp, 'utf8');
    if (!raw.includes('w-[340px] rounded-2xl')) continue;
    const { html, changed } = patchContent(raw);
    if (changed) {
      fs.writeFileSync(fp, html);
      console.log('patched', f);
      n++;
    }
  }
  console.log('done,', n, 'files');
}
