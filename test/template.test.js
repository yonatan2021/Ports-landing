const test = require('node:test');
const assert = require('node:assert/strict');

test('rendered Hebrew page has RTL semantics, reciprocal language link, and a guarded download dialog', async () => {
  const { copy } = await import('../scripts/content.mjs');
  const { page } = await import('../scripts/template.mjs');
  const html = page({
    c: copy.he,
    siteUrl: 'https://port-manager.example',
    release: { version: '1.2.0', arm64DmgUrl: 'https://example.test/arm64.dmg', x64DmgUrl: 'https://example.test/x64.dmg', releaseUrl: 'https://example.test/release' },
  });
  assert.match(html, /<html lang="he" dir="rtl">/);
  assert.match(html, /hreflang="en" href="https:\/\/port-manager\.example\/en\//);
  assert.match(html, /<dialog id="download-dialog"/);
  assert.match(html, /data-track="download-arm64"/);
  assert.doesNotMatch(html, /googletagmanager\.com/);
});

test('rendered privacy page is localized and excludes the download dialog', async () => {
  const { copy } = await import('../scripts/content.mjs');
  const { page } = await import('../scripts/template.mjs');
  const html = page({ c: copy.en, privacy: true, siteUrl: 'https://port-manager.example', release: { version: '1.2.0' } });
  assert.match(html, /Privacy and analytics/);
  assert.match(html, /Google Privacy Policy/);
  assert.doesNotMatch(html, /download-dialog/);
});

test('Hebrew page leads with download and quiet Bersaglio attribution', async () => {
  const { copy } = await import('../scripts/content.mjs');
  const { page } = await import('../scripts/template.mjs');
  const html = page({ c: copy.he, siteUrl: 'https://ports.bersaglio.work', release: {
    version: '1.2.0', arm64DmgUrl: 'https://example.test/arm64.dmg', x64DmgUrl: 'https://example.test/x64.dmg', releaseUrl: 'https://example.test/release',
  } });
  assert.match(html, /הורידו את Port Manager ל־Mac/);
  assert.match(html, /מוצר מבית Bersaglio/);
  assert.match(html, /og:image" content="https:\/\/ports\.bersaglio\.work\/assets\/projects\.jpg/);
});
