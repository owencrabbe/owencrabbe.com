// Mutation tests for scripts/check.mjs. Each case edits src/content.mjs in a temporary copy of the site,
// rebuilds, and runs the check there. The working checkout is never modified.
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const original = await readFile(path.join(root, 'src/content.mjs'), 'utf8');

// Edit one string field of the exported profile object, as an author would in src/content.mjs.
function editProfile(source, field, transform) {
  const start = source.indexOf('export const profile = {');
  const end = source.indexOf('};', start);
  const pattern = new RegExp(`(\\n  ${field}: ')([^']*)(',)`);
  const block = source.slice(start, end);
  if (start < 0 || !pattern.test(block)) throw new Error(`profile.${field} not found in src/content.mjs`);
  return source.slice(0, start) + block.replace(pattern, (_, before, value, after) => before + transform(value) + after) + source.slice(end);
}

const cases = [
  { name: 'control: unchanged content passes', edit: source => source, pass: true },
  { name: 'control: harmless sentence appended to profile.intro passes', edit: source => editProfile(source, 'intro', value => `${value} I also write about evidence review.`), pass: true },
  { name: 'control: Midwest mention without an ownership claim passes', edit: source => editProfile(source, 'intro', value => `${value} Recent examples include Midwest commercial listings.`), pass: true },
  { name: 'Ball State and Midwest ownership appended to profile.background fail', edit: source => editProfile(source, 'background', value => `${value} I graduated from Ball State and own Midwest.`), expect: ['profile.background differs from the approved background sentence', 'unsupported Ball State claim', 'unsupported Midwest ownership claim'] },
  { name: 'Tenure claim appended to profile.background fails', edit: source => editProfile(source, 'background', value => `${value} I have 10 years of experience.`), expect: ['profile.background differs from the approved background sentence', 'unsupported credential, tenure, or deal-total claim'] },
  { name: 'Any other sentence appended to profile.background fails the pin', edit: source => editProfile(source, 'background', value => `${value} I enjoy the work.`), expect: ['profile.background differs from the approved background sentence', 'background must stay one standalone approved sentence'] },
  { name: 'profile.background replaced with an ownership claim fails', edit: source => editProfile(source, 'background', () => 'I own Midwest Realty Partners.'), expect: ['profile.background differs from the approved background sentence', 'unsupported Midwest ownership claim'] },
  { name: 'Ball State claim appended to profile.intro fails', edit: source => editProfile(source, 'intro', value => `${value} I graduated from Ball State.`), expect: ['unsupported Ball State claim'] },
  { name: 'Midwest ownership appended to profile.location fails', edit: source => editProfile(source, 'location', value => `${value} Owner of Midwest Realty.`), expect: ['unsupported Midwest ownership claim'] },
];

const temp = await mkdtemp(path.join(os.tmpdir(), 'portfolio-check-'));
let failures = 0;
try {
  for (const item of ['src', 'scripts', 'public', 'package.json']) await cp(path.join(root, item), path.join(temp, item), { recursive: true });
  for (const test of cases) {
    const edited = test.edit(original);
    if (test.name.startsWith('control: unchanged') !== (edited === original)) throw new Error(`Edit did not apply as intended: ${test.name}`);
    await writeFile(path.join(temp, 'src/content.mjs'), edited);
    const build = spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: temp, encoding: 'utf8' });
    const check = build.status === 0 ? spawnSync(process.execPath, ['scripts/check.mjs'], { cwd: temp, encoding: 'utf8' }) : build;
    const output = `${check.stdout}${check.stderr}`;
    const ok = build.status === 0 && (test.pass ? check.status === 0 : check.status === 1 && test.expect.every(message => output.includes(message)));
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${test.name}`);
    if (!ok) {
      failures += 1;
      console.log(output.trim().split('\n').map(line => `      ${line}`).join('\n'));
    }
  }
} finally {
  await rm(temp, { recursive: true, force: true });
}
console.log(`${cases.length - failures}/${cases.length} check mutation cases behaved as expected.`);
process.exit(failures ? 1 : 0);
