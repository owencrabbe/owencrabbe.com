import { readFile, stat, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { methodsReport } from '../src/reports.mjs';
import { profile, research } from '../src/content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const problems = [];
const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(name);
    else files.push(name);
  }
}
try { await walk(dist); } catch { console.error('Build the site first: npm run build'); process.exit(1); }
const htmlFiles = files.filter(name => name.endsWith('.html'));
const documents = new Map(await Promise.all(htmlFiles.map(async name => [name, await readFile(name, 'utf8')])));

for (const [name, html] of documents) {
  const display = path.relative(dist, name);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (ids.length !== new Set(ids).size) problems.push(`${display}: duplicate element id`);
  if ((html.match(/<h1\b/g) ?? []).length !== 1) problems.push(`${display}: expected one h1`);
  if (!html.includes('<html lang="en">') || !/<main\b[^>]*\bid="main"/.test(html)) problems.push(`${display}: missing language or main landmark`);
  if (!html.includes('name="description"') || !html.includes('rel="canonical"') || !html.includes('name="viewport"')) problems.push(`${display}: missing metadata`);
  if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(html)) problems.push(`${display}: image missing alt`);

  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const reference = match[1].replaceAll('&amp;', '&');
    if (/^https:\/\//.test(reference) || reference.startsWith('mailto:')) continue;
    if (!reference.startsWith('/') && !reference.startsWith('#')) { problems.push(`${display}: nonabsolute or unsupported link ${reference}`); continue; }
    const parsed = new URL(reference, 'https://check.example/');
    const pathname = decodeURIComponent(parsed.pathname);
    let destination;
    if (reference.startsWith('#')) destination = name;
    else if (pathname.endsWith('/')) destination = path.join(dist, pathname, 'index.html');
    else destination = path.join(dist, pathname);
    try {
      const file = await stat(destination);
      if (!file.isFile()) problems.push(`${display}: link is not a file ${reference}`);
      if (parsed.hash) {
        const target = documents.get(destination) ?? await readFile(destination, 'utf8');
        const id = decodeURIComponent(parsed.hash.slice(1));
        if (!target.includes(`id="${id}"`)) problems.push(`${display}: missing anchor ${reference}`);
      }
    } catch { problems.push(`${display}: broken local reference ${reference}`); }
  }
}

// Publication status and preserved artifacts. These narrow assertions replace the earlier blanket resume-word exclusion:
// background facts stay limited to the approved sentence, status labels stay truthful, and the published report stays
// byte-identical. Change a pinned hash only when the report itself is intentionally republished.
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const preserved = {
  'public/reports/cividian-evidence-bounded-methods.docx': '05b7fe9623ae09b5dedad1d754cbabba908052aaf50d6d2db19838857842b4d9',
  'src/cividian-methods-report.html': '905543b66da536e2f7bcc1d22cc3de1db09b8c7818640793aa4cff799c1ee383',
  'src/reports.mjs': '9cdfe3cba3b0ce40c20d576f605ef067b56d41111f6898e0c41584ee342135c6',
};
for (const [file, expected] of Object.entries(preserved)) if (sha256(await readFile(path.join(root, file))) !== expected) problems.push(`${file}: published report artifact changed`);
try { if (sha256(await readFile(path.join(dist, methodsReport.download))) !== preserved['public/reports/cividian-evidence-bounded-methods.docx']) problems.push('Published report download differs from the preserved DOCX'); } catch { problems.push('Missing published report download'); }
const page = route => documents.get(path.join(dist, route, 'index.html')) ?? '';
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
if (!page(`publications/${methodsReport.slug}`).includes(methodsReport.body)) problems.push('Report page does not contain the published report text');
const home = text(page(''));
for (const statement of [profile.intro, profile.location, profile.background, 'a reviewed evaluation of 16 scripted cases', 'not a live factual-accuracy or investment-outcome benchmark', 'Software tests do not establish reasoning quality, adherence, or health outcomes']) if (!home.includes(statement.replace(/\s+/g, ' '))) problems.push(`index.html: missing status statement "${statement}"`);
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
if (!new RegExp(`(?:\\.\\s|<p>)${escapeRegExp(profile.background)}</p>`).test(page(''))) problems.push('index.html: background must stay one standalone approved sentence');
for (const route of ['', 'research']) if ((page(route).match(/class="research-state">Proposed</g) ?? []).length !== research.length) problems.push(`${route || 'home'}: every proposed study must stay labeled Proposed`);
for (const route of ['work/cividian', 'work/mindforge']) if (!/class="case-record"[\s\S]*<dt>Not established<\/dt>/.test(page(route))) problems.push(`${route}: missing case record limits`);
const unsupported = [
  [/\b(?:CENTURY\s*21|Bradley Realty)\b/i, 'employer mention outside the approved background sentence'],
  [/\bBall State\b/i, 'Ball State claim'],
  [/\b(?:own|owns|owner|ownership|co-?owner|founder|founded)\b[^.]{0,80}\bMidwest\b|\bMidwest\b[^.]{0,80}\b(?:owner|ownership|owns|founder)\b/i, 'Midwest ownership claim'],
  [/\b(?:licensed|certified) (?:real estate )?(?:broker|agent|salesperson)\b|\byears of experience\b|\b(?:closed|sold|brokered) (?:over )?\$/i, 'credential, tenure, or deal-total claim'],
  [/\b(?:Hewed|native app)\b[^.]{0,80}\b(?:finished|completed?|launched|shipped|released)\b/i, 'finished native app claim'],
  [/\b(?:trusted|used|adopted|endorsed) by\b|\btestimonials?\b|\bcustomers (?:use|rely)\b/i, 'adoption or endorsement claim'],
];
for (const [name, html] of documents) {
  const visible = text(html.replace(methodsReport.body, '').replaceAll(profile.background, ''));
  for (const [pattern, label] of unsupported) if (pattern.test(visible)) problems.push(`${path.relative(dist, name)}: unsupported ${label}`);
  if ((visible.match(/peer[- ]review/gi) ?? []).length !== (visible.match(/\b(?:not|no) (?:a )?peer[- ]review/gi) ?? []).length) problems.push(`${path.relative(dist, name)}: peer review mentioned without a not-peer-reviewed status`);
}

const css = await readFile(path.join(dist, 'assets/styles.css'), 'utf8');
if (!css.includes(':focus-visible') || !css.includes('prefers-reduced-motion') || !css.includes('@media print')) problems.push('Missing accessible focus, reduced motion, or print styles');
if (css.length > 50000) problems.push('CSS exceeds the 50 KB uncompressed budget');
for (const required of ['sitemap.xml', 'robots.txt', 'feed.xml', '404.html']) if (!files.includes(path.join(dist, required))) problems.push(`Missing ${required}`);
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
const total = (await Promise.all(files.map(async name => (await stat(name)).size))).reduce((a, b) => a + b, 0);
console.log(`Checked ${htmlFiles.length} pages: local links and anchors, metadata, landmarks, unique ids, accessible asset requirements, publication status, preserved report.`);
console.log(`Total generated site: ${(total / 1024).toFixed(1)} KB uncompressed. CSS: ${(css.length / 1024).toFixed(1)} KB. No runtime dependencies.`);
