import { verboseTime } from '../src/verbatempus.js';

describe('verboseTime', () => {
  describe('Midnight cases', () => {
    test('exactly midnight', () => {
      expect(verboseTime(new Date(2024, 0, 1, 0, 0)))
        .toBe('It is midnight');
    });

    test('one minute past midnight', () => {
      expect(verboseTime(new Date(2024, 0, 1, 0, 1)))
        .toBe('it is one minute past midnight');
    });
  });

  describe('Noon cases', () => {
    test('exactly noon', () => {
      expect(verboseTime(new Date(2024, 0, 1, 12, 0)))
        .toBe('It is noon');
    });

    test('quarter past noon', () => {
      expect(verboseTime(new Date(2024, 0, 1, 12, 15)))
        .toBe('it is quarter past noon');
    });
  });

  describe('Quarter hours', () => {
    test('quarter past', () => {
      expect(verboseTime(new Date(2024, 0, 1, 3, 15)))
        .toBe('it is quarter past three oclock in the morning');
    });

    test('half past', () => {
      expect(verboseTime(new Date(2024, 0, 1, 3, 30)))
        .toBe('it is half past three oclock in the morning');
    });

    test('quarter to', () => {
      expect(verboseTime(new Date(2024, 0, 1, 3, 45)))
        .toBe('it is quarter to four oclock in the morning');
    });
  });

  describe('Time of day ranges', () => {
    test('morning', () => {
      expect(verboseTime(new Date(2024, 0, 1, 9, 0)))
        .toBe('it is nine oclock in the morning');
    });

    test('afternoon', () => {
      expect(verboseTime(new Date(2024, 0, 1, 14, 0)))
        .toBe('it is two oclock in the afternoon');
    });

    test('evening', () => {
      expect(verboseTime(new Date(2024, 0, 1, 20, 0)))
        .toBe('it is eight oclock in the evening');
    });
  });
});

describe('verboseTime error handling', () => {
    test('throws on invalid Date object', () => {
      expect(() => verboseTime(new Date('invalid')))
        .toThrow('Invalid Date: date object contains an invalid date');
    });
  
    test('throws on non-Date input', () => {
      expect(() => verboseTime('2024-01-01'))
        .toThrow('Input must be a valid Date object');
      expect(() => verboseTime(null))
        .toThrow('Input must be a valid Date object');
      expect(() => verboseTime(undefined))
        .toThrow('Input must be a valid Date object');
    });
  });