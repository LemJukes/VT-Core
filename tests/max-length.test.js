// MAX_LENGTH is asserted against a corpus generated here, so the constants
// cannot drift from reality without a failing test. Everything runs in UTC so the
// result does not depend on the host's timezone or DST.
//
//   time  every one of 1440 minutes
//   date  every calendar day 2010-2099 (every weekday x month x ordinal day, in the
//         'twenty xx' year reading; the longest is 'twenty seventy three')
//   both  the longest date x every minute. Date and time lengths add, so the worst
//         date with the worst minute is the worst pair.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { format, MAX_LENGTH } from '../src/index.js';

const LEVELS = ['verbose', 'lengthy', 'short', 'terse'];

function longestDate(level) {
  let best = null;
  for (let year = 2010; year <= 2099; year++) {
    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= 31; day++) {
        const date = new Date(Date.UTC(year, month, day, 12, 0));
        if (date.getUTCMonth() !== month) continue; // day overflowed the month
        const len = format(date, { level, parts: 'date', timeZone: 'UTC' }).length;
        if (!best || len > best.len) best = { len, year, month, day };
      }
    }
  }
  return best;
}

for (const level of LEVELS) {
  test(`${level}: MAX_LENGTH matches the generated corpus`, () => {
    let time = 0;
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m++) {
        time = Math.max(time, format(new Date(Date.UTC(2026, 0, 1, h, m)), { level, parts: 'time', timeZone: 'UTC' }).length);
      }
    }

    const worst = longestDate(level);

    let both = 0;
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m++) {
        const date = new Date(Date.UTC(worst.year, worst.month, worst.day, h, m));
        both = Math.max(both, format(date, { level, parts: 'both', timeZone: 'UTC' }).length);
      }
    }

    assert.deepEqual(MAX_LENGTH[level], { time, date: worst.len, both });
  });
}

test('MAX_LENGTH is frozen', () => {
  assert.ok(Object.isFrozen(MAX_LENGTH));
  assert.ok(Object.isFrozen(MAX_LENGTH.verbose));
});
