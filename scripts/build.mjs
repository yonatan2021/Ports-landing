import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { copy } from './content.mjs';
import { fetchLatestRelease } from './release.mjs';
import { page } from './template.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const source = resolve(root, 'src');

async function write(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value);
}

function sitemap(siteUrl) {
  const origin = siteUrl || 'https://example.invalid';
  const paths = ['/he/', '/en/', '/he/privacy/', '/en/privacy/'];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>`;
}

export async function buildSite({
  fetchImpl = globalThis.fetch,
  siteUrl = (process.env.SITE_URL || '').replace(/\/$/, ''),
  outputDir = output,
} = {}) {
  const release = await fetchLatestRelease(fetchImpl);
  await rm(outputDir, { recursive: true, force: true });
  await cp(resolve(source, 'assets'), resolve(outputDir, 'assets'), { recursive: true });

  for (const locale of ['he', 'en']) {
    const c = copy[locale];
    await write(resolve(outputDir, locale, 'index.html'), page({ c, release, siteUrl }));
    await write(resolve(outputDir, locale, 'privacy', 'index.html'), page({ c, release, siteUrl, privacy: true }));
  }

  await write(resolve(outputDir, 'index.html'), '<!doctype html><meta http-equiv="refresh" content="0; url=/he/"><link rel="canonical" href="/he/">');
  await write(resolve(outputDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl ? `${siteUrl}/sitemap.xml` : '/sitemap.xml'}\n`);
  await write(resolve(outputDir, 'sitemap.xml'), sitemap(siteUrl));
  await write(resolve(outputDir, 'release-manifest.json'), JSON.stringify(release, null, 2));
  return release;
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  const release = await buildSite();
  console.log(`Built Port Manager site for release ${release.version}`);
}
