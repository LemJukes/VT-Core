import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as vt from '../src/index.js';

const NOT_A_DATE = { message: 'Input must be a valid Date object' };
const INVALID = { message: 'Invalid Date: date object contains an invalid date' };

const NAMED = [
  'verboseTime', 'lengthyTime', 'shortTime', 'terseTime',
  'verboseDate', 'lengthyDate', 'shortDate', 'terseDate',
  'verboseDateTime', 'lengthyDateTime', 'shortDateTime', 'terseDateTime',
];

describe('input validation', () => {
  for (const name of [...NAMED, 'format', 'formatParts']) {
    describe(name, () => {
      const fn = vt[name];
      test('null throws', () => assert.throws(() => fn(null), NOT_A_DATE));
      test('non-Date throws', () => {
        assert.throws(() => fn('12:00'), NOT_A_DATE);
        assert.throws(() => fn(1200), NOT_A_DATE);
        assert.throws(() => fn({ hours: 12, minutes: 0 }), NOT_A_DATE);
      });
      test('invalid Date throws', () => {
        assert.throws(() => fn(new Date('invalid')), INVALID);
        assert.throws(() => fn(new Date('2024-13-45')), INVALID);
      });
      test('undefined defaults to now', () => assert.doesNotThrow(() => fn()));
    });
  }

  test('1.0 get* wrappers are gone', () => {
    for (const name of Object.keys(vt)) assert.ok(!name.startsWith('get'), name);
  });

  test('unknown option values throw instead of silently defaulting', () => {
    const d = new Date(2026, 0, 1);
    assert.throws(() => vt.format(d, { level: 'brief' }), /Invalid level/);
    assert.throws(() => vt.format(d, { parts: 'dates' }), /Invalid parts/);
    assert.throws(() => vt.format(d, { case: 'title' }), /Invalid case/);
    assert.throws(() => vt.format(d, { charset: 'ascii' }), /Invalid charset/);
  });
});
