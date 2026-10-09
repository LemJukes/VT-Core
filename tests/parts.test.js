// formatParts() output contract, combined date+time, case and charset.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  format, formatParts, verboseDateTime, lengthyDateTime, shortDateTime, terseDateTime, MAX_LENGTH,
} from '../src/index.js';

// Friday 2024-10-25 23:15 local
const d = new Date(2024, 9, 25, 23, 15);

describe('formatParts', () => {
  test('shape, as in the spec example', () => {
    const r = formatParts(new Date(2026, 0, 1, 23, 15), { level: 'short' });
    assert.deepEqual(r, {
      text: 'it is quarter past eleven pm',
      tokens: [
        { type: 'lead', value: 'it is' },
        { type: 'minute', value: 'quarter' },
        { type: 'rel', value: 'past' },
        { type: 'hour', value: 'eleven' },
        { type: 'suffix', value: 'pm' },
      ],
      level: 'short',
      parts: 'time',
      maxLength: 39,
    });
  });

  test('text is always the tokens read in order', () => {
    for (const level of ['verbose', 'lengthy', 'short', 'terse']) {
      for (const parts of ['time', 'date', 'both']) {
        for (const charset of ['full', 'alpha']) {
          const r = formatParts(d, { level, parts, charset });
          const joined = r.tokens.map((t) => t.value).join(' ').replace(/ ,/g, ',');
          assert.equal(r.text, joined, `${level}/${parts}/${charset}`);
        }
      }
    }
  });

  test('maxLength comes from MAX_LENGTH and is never exceeded', () => {
    for (const level of ['verbose', 'lengthy', 'short', 'terse']) {
      for (const parts of ['time', 'date', 'both']) {
        const r = formatParts(d, { level, parts });
        assert.equal(r.maxLength, MAX_LENGTH[level][parts]);
        assert.ok(r.text.length <= r.maxLength);
      }
    }
  });

  test('only the documented token types appear', () => {
    const allowed = new Set([
      'lead', 'minute', 'rel', 'hour', 'oclock', 'suffix',
      'weekday', 'month', 'day', 'year', 'join',
    ]);
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 7) {
        for (const level of ['verbose', 'lengthy', 'short', 'terse']) {
          for (const t of formatParts(new Date(2026, 0, 1, h, m), { level, parts: 'both' }).tokens) {
            assert.ok(allowed.has(t.type), t.type);
          }
        }
      }
    }
  });
});

describe('combined date and time', () => {
  test('verbose joins with ", and it is"', () => {
    assert.equal(verboseDateTime(d),
      'it is friday october the twenty fifth twenty twenty four, and it is a quarter past eleven oclock in the evening');
  });
  test('lengthy joins with "at"', () => {
    assert.equal(lengthyDateTime(d), 'it is friday october twenty fifth at a quarter past eleven in the evening');
  });
  test('short joins with "at"', () => {
    assert.equal(shortDateTime(d), 'it is friday the twenty fifth at quarter past eleven pm');
  });
  test('terse joins with "at" and drops "its"', () => {
    assert.equal(terseDateTime(d), 'it is friday at quarter after eleven');
  });
  test('"it is" appears once in non-verbose combined phrases', () => {
    for (const fn of [lengthyDateTime, shortDateTime, terseDateTime]) {
      assert.equal(fn(d).match(/\bit is\b/g).length, 1);
    }
  });
});

describe('case and charset', () => {
  test('upper', () => {
    assert.equal(format(d, { level: 'short', case: 'upper' }), 'IT IS QUARTER PAST ELEVEN PM');
  });
  test('alpha strips the verbose comma and keeps single spaces', () => {
    const out = format(d, { level: 'verbose', parts: 'both', charset: 'alpha' });
    assert.ok(!out.includes(','));
    assert.ok(!out.includes('  '));
    assert.match(out, /^[a-z ]+$/);
  });
  test('upper + alpha is what a split-flap board can render: A-Z and space only', () => {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m++) {
        for (const level of ['verbose', 'lengthy', 'short', 'terse']) {
          const out = format(new Date(2026, 0, 1, h, m), { level, parts: 'both', case: 'upper', charset: 'alpha' });
          assert.match(out, /^[A-Z]+( [A-Z]+)*$/, out);
        }
      }
    }
  });
});
