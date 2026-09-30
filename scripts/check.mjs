import { readFile, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  if (!html.includes('<html lang="en">') || !html.includes('<main id="main">')) problems.push(`${display}: missing language or main landmark`);
  if (!html.includes('name="description"') || !html.includes('rel="canonical"') || !html.includes('name="viewport"')) problems.push(`${display}: missing metadata`);
  if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(html)) problems.push(`${display}: image missing alt`);
  if (/\b(?:resume|résumé)\b/i.test(html)) problems.push(`${display}: unexpected resume content`);

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

const css = await readFile(path.join(dist, 'assets/styles.css'), 'utf8');
if (!css.includes(':focus-visible') || !css.includes('prefers-reduced-motion') || !css.includes('@media print')) problems.push('Missing accessible focus, reduced motion, or print styles');
if (css.length > 50000) problems.push('CSS exceeds the 50 KB uncompressed budget');
for (const required of ['sitemap.xml', 'robots.txt', 'feed.xml', '404.html']) if (!files.includes(path.join(dist, required))) problems.push(`Missing ${required}`);
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
const total = (await Promise.all(files.map(async name => (await stat(name)).size))).reduce((a, b) => a + b, 0);
console.log(`Checked ${htmlFiles.length} pages: local links and anchors, metadata, landmarks, unique ids, accessible asset requirements, no resume content.`);
console.log(`Total generated site: ${(total / 1024).toFixed(1)} KB uncompressed. CSS: ${(css.length / 1024).toFixed(1)} KB. No runtime dependencies.`);
