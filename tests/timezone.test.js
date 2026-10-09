import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { format, verboseTime, verboseDateTime, lengthyDate } from '../src/index.js';
import { fieldsIn, fieldsFromParts } from '../src/fields.js';

const instant = new Date('2024-10-24T23:30:00Z');

describe('same instant, different zones', () => {
  test('UTC', () => {
    assert.equal(verboseTime(instant, { timeZone: 'UTC' }),
      'it is half past eleven oclock in the evening');
  });
  test('America/New_York (EDT, -4)', () => {
    assert.equal(verboseTime(instant, { timeZone: 'America/New_York' }),
      'it is half past seven oclock in the evening');
  });
  test('Asia/Kolkata (+5:30, half-hour offset, next day)', () => {
    assert.equal(verboseTime(instant, { timeZone: 'Asia/Kolkata' }),
      'it is five oclock in the morning');
    assert.equal(lengthyDate(instant, { timeZone: 'Asia/Kolkata' }),
      'it is friday october twenty fifth');
    assert.equal(lengthyDate(instant, { timeZone: 'UTC' }),
      'it is thursday october twenty fourth');
  });
  test('date and time both follow the zone', () => {
    assert.equal(verboseDateTime(instant, { timeZone: 'Asia/Kolkata' }),
      'it is friday october the twenty fifth twenty twenty four, and it is five oclock in the morning');
  });
});

describe('no timeZone means the local wall clock', () => {
  test('matches local getters', () => {
    const d = new Date(2024, 5, 15, 9, 41);
    assert.equal(format(d, { level: 'terse' }), 'its quarter to ten');
    assert.deepEqual(fieldsIn(d), {
      year: 2024, month: 6, day: 15, weekday: 6, hour: 9, minute: 41,
    });
  });
});

describe('DST transitions (America/New_York)', () => {
  const ny = { timeZone: 'America/New_York' };

  test('spring forward 2024-03-10: 01:59 EST -> 03:00 EDT, 02:xx never occurs', () => {
    assert.equal(verboseTime(new Date('2024-03-10T06:59:00Z'), ny),
      'it is one minute to two oclock in the morning');
    assert.equal(verboseTime(new Date('2024-03-10T07:00:00Z'), ny),
      'it is three oclock in the morning');
  });

  test('fall back 2024-11-03: 01:30 happens twice and reads the same', () => {
    assert.equal(verboseTime(new Date('2024-11-03T05:30:00Z'), ny),
      'it is half past one oclock in the morning'); // EDT
    assert.equal(verboseTime(new Date('2024-11-03T06:30:00Z'), ny),
      'it is half past one oclock in the morning'); // EST
    assert.equal(verboseTime(new Date('2024-11-03T07:00:00Z'), ny),
      'it is two oclock in the morning');
  });
});

describe('midnight and the hour 24 footgun', () => {
  test('midnight in New York reads as hour 0, not 24', () => {
    const f = fieldsIn(new Date('2024-01-15T05:00:00Z'), 'America/New_York');
    assert.equal(f.hour, 0);
    assert.equal(verboseTime(new Date('2024-01-15T05:00:00Z'), { timeZone: 'America/New_York' }),
      'it is midnight');
  });

  test('fieldsFromParts normalises hour "24" (some ICU versions under hour12:false)', () => {
    const parts = [
      { type: 'weekday', value: 'Mon' }, { type: 'month', value: '1' },
      { type: 'day', value: '15' }, { type: 'year', value: '2024' },
      { type: 'hour', value: '24' }, { type: 'minute', value: '00' },
    ];
    assert.equal(fieldsFromParts(parts).hour, 0);
  });
});

test('an invalid IANA name throws instead of falling back', () => {
  assert.throws(() => format(new Date(), { timeZone: 'Mars/Olympus_Mons' }), RangeError);
});
