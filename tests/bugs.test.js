// The 1.0 bugs from the assessment, one named test each,
// so a regression says which bug came back.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verboseTime, shortTime, terseTime, verboseDate, terseDateTime, format } from '../src/index.js';

const at = (h, m) => new Date(2026, 2, 3, h, m);
const onYear = (year) => new Date(year, 5, 15, 12, 0);

test('B1 verboseTime 23:45 -> a quarter to midnight (was "quarter minutes to midnight")', () => {
  assert.equal(verboseTime(at(23, 45)), 'it is a quarter to midnight');
});

test('B1b verboseTime 11:45 -> a quarter to noon', () => {
  assert.equal(verboseTime(at(11, 45)), 'it is a quarter to noon');
});

test('B2 shortTime 23:45 -> quarter to midnight (was "quarter to noon am")', () => {
  assert.equal(shortTime(at(23, 45)), 'it is quarter to midnight');
});

test('B2b shortTime 11:45 -> quarter to noon (was "quarter to noon pm")', () => {
  assert.equal(shortTime(at(11, 45)), 'it is quarter to noon');
});

test('B3 terseTime 00:20 -> quarter after midnight (was "quarter after noon")', () => {
  assert.equal(terseTime(at(0, 20)), 'its quarter after midnight');
});

test('B3b terseTime 00:30 -> half past midnight (was "half past noon")', () => {
  assert.equal(terseTime(at(0, 30)), 'its half past midnight');
});

test('B4 year 2110 -> twenty one ten (was "twenty ten")', () => {
  assert.equal(verboseDate(onYear(2110)).endsWith(' twenty one ten'), true);
});

test('B4b year 2525 -> twenty five twenty five (was "twenty twenty five")', () => {
  assert.equal(verboseDate(onYear(2525)).endsWith(' twenty five twenty five'), true);
});

test('B5 verboseTime 00:00 is lowercase (was "It is midnight")', () => {
  assert.equal(verboseTime(at(0, 0)), 'it is midnight');
  assert.equal(verboseTime(at(12, 0)), 'it is noon');
});

test('B4 distinct centuries no longer collide: 2010/2110 and 2025/2525', () => {
  assert.notEqual(verboseDate(onYear(2010)), verboseDate(onYear(2110)));
  assert.notEqual(verboseDate(onYear(2025)), verboseDate(onYear(2525)));
});

// 2.0.0 said 'it is friday at after three' for terse :06-:14 in the date+time phrase.
test('B7 terseDateTime 15:08 -> a bit after (was "it is tuesday at after three")', () => {
  assert.equal(terseDateTime(at(15, 8)), 'it is tuesday at a bit after three');
});

test('B7b terseTime :06-:14 -> a bit after, :01-:05 stays just after', () => {
  assert.equal(terseTime(at(15, 6)), 'its a bit after three');
  assert.equal(terseTime(at(15, 14)), 'its a bit after three');
  assert.equal(terseTime(at(15, 5)), 'its just after three');
  assert.equal(terseTime(at(15, 15)), 'its quarter after three');
});

test('B7c no date+time phrase at any level, minute or hour has "at after" or "at at"', () => {
  for (const level of ['verbose', 'lengthy', 'short', 'terse']) {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m++) {
        const text = format(at(h, m), { level, parts: 'both' });
        assert.doesNotMatch(text, / at (after|at|to|past) /, `${level} ${h}:${m} ${text}`);
      }
    }
  }
});
