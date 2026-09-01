const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtemp, readFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

test('buildSite emits canonical Hebrew output', async () => {
  const { buildSite } = await import('../scripts/build.mjs');
  const outputDir = await mkdtemp(join(tmpdir(), 'ports-landing-'));
  const release = {
    tag_name: 'v1.2.0',
    html_url: 'https://example.test/release',
    assets: [
      { name: 'Port-Manager-1.2.0-arm64.dmg', browser_download_url: 'https://example.test/arm64.dmg' },
      { name: 'Port-Manager-1.2.0-x64.dmg', browser_download_url: 'https://example.test/x64.dmg' },
    ],
  };

  try {
    await buildSite({
      outputDir,
      siteUrl: 'https://ports.bersaglio.work',
      fetchImpl: async () => new Response(JSON.stringify(release), { status: 200 }),
    });
    const html = await readFile(join(outputDir, 'he', 'index.html'), 'utf8');
    assert.match(html, /https:\/\/ports\.bersaglio\.work\/he\//);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
