const test = require('node:test');
const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const { join } = require('node:path');

test('site package is private and standalone', async () => {
  const pkg = JSON.parse(await readFile(join(__dirname, '..', 'package.json')));
  assert.equal(pkg.private, true);
  assert.equal(pkg.scripts.build, 'node scripts/build.mjs');
  assert.equal(pkg.scripts.test, 'node --test test/*.test.js');
});
