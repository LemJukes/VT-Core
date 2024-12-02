import { verboseDate } from '../src/verbatempus.js';

describe('verboseDate', () => {
  describe('Year formatting', () => {
    test('year 2000', () => {
      expect(verboseDate(new Date(2000, 0, 1)))
        .toBe('it is saturday, january the first, two thousand');
    });

    test('year 2024', () => {
      expect(verboseDate(new Date(2024, 0, 1)))
        .toBe('it is monday, january the first, twenty twenty four');
    });
  });

  describe('Month formatting', () => {
    test('january', () => {
      expect(verboseDate(new Date(2024, 0, 15)))
        .toBe('it is monday, january the fifteenth, twenty twenty four');
    });
  });

  describe('Day formatting', () => {
    test('first of month', () => {
      expect(verboseDate(new Date(2024, 0, 1)))
        .toBe('it is monday, january the first, twenty twenty four');
    });

    test('thirty first', () => {
      expect(verboseDate(new Date(2024, 0, 31)))
        .toBe('it is wednesday, january the thirty first, twenty twenty four');
    });
  });
});

describe('verboseDate error handling', () => {
    test('throws on invalid Date object', () => {
      expect(() => verboseDate(new Date('invalid')))
        .toThrow('Invalid Date: date object contains an invalid date');
    });
  
    test('throws on non-Date input', () => {
      expect(() => verboseDate('2024-01-01'))
        .toThrow('Input must be a valid Date object');
      expect(() => verboseDate(null))
        .toThrow('Input must be a valid Date object');
      expect(() => verboseDate(undefined))
        .toThrow('Input must be a valid Date object');
    });
  });

