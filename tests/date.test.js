import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { verboseDate, lengthyDate, shortDate, terseDate } from '../src/index.js';
import { yearWords } from '../src/words.js';

describe('verboseDate', () => {
  test('year 2000', () => {
    assert.equal(verboseDate(new Date(2000, 0, 1)), 'it is saturday january the first two thousand');
  });
  test('2024-01-01', () => {
    assert.equal(verboseDate(new Date(2024, 0, 1)), 'it is monday january the first twenty twenty four');
  });
  test('2024-01-15', () => {
    assert.equal(verboseDate(new Date(2024, 0, 15)), 'it is monday january the fifteenth twenty twenty four');
  });
  test('2024-01-31', () => {
    assert.equal(verboseDate(new Date(2024, 0, 31)), 'it is wednesday january the thirty first twenty twenty four');
  });
});

describe('lengthyDate', () => {
  test('2024-01-15', () => {
    assert.equal(lengthyDate(new Date(2024, 0, 15)), 'it is monday january fifteenth');
  });
  test('2024-12-25', () => {
    assert.equal(lengthyDate(new Date(2024, 11, 25)), 'it is wednesday december twenty fifth');
  });
  test('2024-01-31', () => {
    assert.equal(lengthyDate(new Date(2024, 0, 31)), 'it is wednesday january thirty first');
  });
  test('2024-01-07', () => {
    assert.equal(lengthyDate(new Date(2024, 0, 7)), 'it is sunday january seventh');
  });
});

describe('shortDate', () => {
  test('2024-01-01', () => {
    assert.equal(shortDate(new Date(2024, 0, 1)), 'it is monday the first');
  });
  test('2024-01-15', () => {
    assert.equal(shortDate(new Date(2024, 0, 15)), 'it is monday the fifteenth');
  });
  test('2024-01-31', () => {
    assert.equal(shortDate(new Date(2024, 0, 31)), 'it is wednesday the thirty first');
  });
});

describe('terseDate', () => {
  const week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  for (const [i, day] of week.entries()) {
    test(`2024-01-0${i + 1} is ${day}`, () => {
      assert.equal(terseDate(new Date(2024, 0, i + 1)), `it is ${day}`);
    });
  }
});

describe('yearWords', () => {
  const cases = {
    50: 'fifty',
    999: 'nine hundred and ninety nine',
    1066: 'ten hundred and sixty six',
    1900: 'nineteen hundred',
    1999: 'nineteen hundred and ninety nine',
    2000: 'two thousand',
    2005: 'two thousand and five',
    2010: 'twenty ten',
    2024: 'twenty twenty four',
    2099: 'twenty ninety nine',
    2100: 'twenty one hundred',
    2105: 'twenty one hundred and five',
    2110: 'twenty one ten',
    2150: 'twenty one fifty',
    2525: 'twenty five twenty five',
    3110: 'thirty one ten',
  };
  for (const [year, words] of Object.entries(cases)) {
    test(`${year} -> ${words}`, () => assert.equal(yearWords(Number(year)), words));
  }

  test('rejects negative and non-integer years', () => {
    assert.throws(() => yearWords(-1), /Year must be a positive integer/);
    assert.throws(() => yearWords(2024.5), /Year must be a positive integer/);
  });
});
