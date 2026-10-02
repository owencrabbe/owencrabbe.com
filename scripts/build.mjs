import { mkdir, rm, copyFile, writeFile, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { methodsReport } from '../src/reports.mjs';
import { pages } from '../src/templates.mjs';
import { site, notes } from '../src/content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const updated = '2026-09-30';
const xml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;'}[c]));

await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'assets'), { recursive: true });

for (const item of pages) {
  const destination = item.path === '/404/' ? path.join(output, '404.html') : path.join(output, item.path.slice(1), 'index.html');
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, item.html, 'utf8');
}

await Promise.all([
  copyFile(path.join(root, 'public/styles.css'), path.join(output, 'assets/styles.css')),
  copyFile(path.join(root, 'public/main.js'), path.join(output, 'assets/main.js')),
  copyFile(path.join(root, 'public/favicon.svg'), path.join(output, 'favicon.svg')),
]);

await cp(path.join(root, 'public/reports'), path.join(output, 'reports'), { recursive: true });

const urls = pages.filter(item => item.path !== '/404/').map(item => `  <url><loc>${xml(site.origin + item.path)}</loc><lastmod>${item.path === '/' || item.path.startsWith('/publications/') ? methodsReport.published : updated}</lastmod></url>`).join('\n');
await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
const reportFeedItem = `<item><title>${xml(methodsReport.title)}</title><link>${xml(site.origin + '/publications/' + methodsReport.slug + '/')}</link><guid isPermaLink="true">${xml(site.origin + '/publications/' + methodsReport.slug + '/')}</guid><pubDate>Fri, 02 Oct 2026 00:00:00 GMT</pubDate><description>${xml(methodsReport.description + ' Self-published technical report. Not peer reviewed.')}</description></item>`;
const feedItems = reportFeedItem + '\n' + notes.map(note => `<item><title>${xml(note.title)}</title><link>${xml(site.origin + '/writing/' + note.slug + '/')}</link><guid isPermaLink="true">${xml(site.origin + '/writing/' + note.slug + '/')}</guid><description>${xml(note.description + ' Self-published engineering note.')}</description></item>`).join('\n');
await writeFile(path.join(output, 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Owen Crabbe — Engineering Notebook</title><link>${xml(site.origin)}</link><description>Applied AI, grounded in evidence.</description><language>en-us</language>\n${feedItems}\n</channel></rss>\n`);
console.log(`Built ${pages.length} pages in dist. Canonical origin: ${site.origin}`);
