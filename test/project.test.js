import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('site package is private and standalone', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
  assert.equal(pkg.private, true);
  assert.equal(pkg.scripts.build, 'node scripts/build.mjs');
  assert.equal(pkg.scripts.test, 'node --test test/*.test.js');
});
