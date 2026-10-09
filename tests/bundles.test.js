// The published entry points: ESM import, CJS require, and the browser IIFE.
// Builds first, so the test needs esbuild (the only devDependency).

import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const require = createRequire(import.meta.url);
const d = new Date(2026, 0, 1, 23, 45);
const EXPECTED = 'it is a quarter to midnight';
const EXPORTS = [
  'MAX_LENGTH', 'format', 'formatParts',
  'verboseTime', 'lengthyTime', 'shortTime', 'terseTime',
  'verboseDate', 'lengthyDate', 'shortDate', 'terseDate',
  'verboseDateTime', 'lengthyDateTime', 'shortDateTime', 'terseDateTime',
];

before(() => {
  const built = spawnSync(process.execPath, ['scripts/build.js'], { cwd: root, encoding: 'utf8' });
  assert.equal(built.status, 0, built.stderr);
  assert.ok(!/WARNING/.test(built.stdout + built.stderr), 'build emitted a warning');
});

test("ESM: import 'verbatempus' resolves through the exports map", async () => {
  const esm = await import('verbatempus');
  assert.deepEqual(Object.keys(esm).sort(), [...EXPORTS].sort());
  assert.equal(esm.verboseTime(d), EXPECTED);
});

test("CJS: require('verbatempus') resolves to the dist bundle", () => {
  const cjs = require('verbatempus');
  assert.deepEqual(Object.keys(cjs).sort(), [...EXPORTS].sort());
  assert.equal(cjs.verboseTime(d), EXPECTED);
  assert.ok(require.resolve('verbatempus').endsWith('verbatempus.cjs'));
});

test('IIFE: defines the global Verbatempus and needs no network', () => {
  const source = readFileSync(new URL('dist/verbatempus.iife.js', root), 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${source}\nthis.result = Verbatempus;`, sandbox);
  assert.deepEqual(Object.keys(sandbox.result).sort(), [...EXPORTS].sort());
  assert.equal(sandbox.result.verboseTime(d), EXPECTED);
  assert.ok(!/\b(fetch|XMLHttpRequest|import\s*\()/.test(source));
});

test('the same phrase comes out of every entry point', async () => {
  const esm = await import('verbatempus');
  const cjs = require('verbatempus');
  for (const level of ['verbose', 'lengthy', 'short', 'terse']) {
    assert.equal(esm.format(d, { level, parts: 'both' }), cjs.format(d, { level, parts: 'both' }));
  }
});
