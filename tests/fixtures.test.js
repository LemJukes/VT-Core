// Golden fixtures: tests/fixtures/phrases.json is generated from vtspec.py (the executable spec).
// The JS implementation is correct exactly when it reproduces it.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { format } from '../src/index.js';

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/phrases.json', import.meta.url), 'utf8')
);
const LEVELS = ['verbose', 'lengthy', 'short', 'terse'];

test('fixture holds 1440 minutes x 4 levels', () => {
  assert.equal(fixture.count, 1440);
  assert.equal(fixture.phrases.length, 1440);
  for (const row of fixture.phrases) {
    for (const level of LEVELS) assert.equal(typeof row[level], 'string');
  }
});

for (const level of LEVELS) {
  test(`${level}: all 1440 minutes match the fixture`, () => {
    const mismatches = [];
    for (const row of fixture.phrases) {
      // date part is irrelevant to time phrasing; local constructor keeps the wall clock exact
      const got = format(new Date(2026, 2, 3, row.h, row.m), { level, parts: 'time' });
      if (got !== row[level]) {
        mismatches.push({ time: `${row.h}:${row.m}`, got, want: row[level] });
      }
    }
    assert.deepEqual(mismatches.slice(0, 5), []);
    assert.equal(mismatches.length, 0);
  });

  test(`${level}: all 1440 minutes match the fixture via timeZone: 'UTC'`, () => {
    const mismatches = [];
    for (const row of fixture.phrases) {
      const got = format(new Date(Date.UTC(2026, 2, 3, row.h, row.m)), { level, parts: 'time', timeZone: 'UTC' });
      if (got !== row[level]) {
        mismatches.push({ time: `${row.h}:${row.m}`, got, want: row[level] });
      }
    }
    assert.deepEqual(mismatches.slice(0, 5), []);
  });
}
