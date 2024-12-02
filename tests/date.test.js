import { verboseDate } from '../src/verbatempus.js';

describe('verboseDate', () => {
  // Keep existing test groups...
  
  describe('Invalid inputs', () => {
    test('should throw error for null input', () => {
      expect(() => verboseDate(null))
        .toThrow('Input must be a valid Date object');
    });

    test('should throw error for undefined input', () => {
      expect(() => verboseDate(undefined))
        .not.toThrow(); // undefined is allowed as it defaults to current date
    });

    test('should throw error for non-Date objects', () => {
      expect(() => verboseDate("2024-01-01"))
        .toThrow('Input must be a valid Date object');
      expect(() => verboseDate(123))
        .toThrow('Input must be a valid Date object');
      expect(() => verboseDate({}))
        .toThrow('Input must be a valid Date object');
    });

    test('should throw error for invalid Date values', () => {
      expect(() => verboseDate(new Date('invalid')))
        .toThrow('Invalid Date: date object contains an invalid date');
      expect(() => verboseDate(new Date('2024-13-45')))
        .toThrow('Invalid Date: date object contains an invalid date');
    });
  });

  // Keep existing test groups...
  describe('Year formatting', () => {
    test('year 2000', () => {
      expect(verboseDate(new Date(2000, 0, 1)))
        .toBe('it is saturday january the first two thousand');
    });

    test('year 2024', () => {
      expect(verboseDate(new Date(2024, 0, 1)))
        .toBe('it is monday january the first twenty twenty four');
    });
  });

  describe('Month formatting', () => {
    test('january', () => {
      expect(verboseDate(new Date(2024, 0, 15)))
        .toBe('it is monday january the fifteenth twenty twenty four');
    });
  });

  describe('Day formatting', () => {
    test('first of month', () => {
      expect(verboseDate(new Date(2024, 0, 1)))
        .toBe('it is monday january the first twenty twenty four');
    });

    test('thirty first', () => {
      expect(verboseDate(new Date(2024, 0, 31)))
        .toBe('it is wednesday january the thirty first twenty twenty four');
    });
  });
});

import { lengthyDate } from '../src/verbatempus.js';

describe('lengthyDate', () => {
  describe('Invalid inputs', () => {
    test('should throw error for null input', () => {
      expect(() => lengthyDate(null))
        .toThrow('Input must be a valid Date object');
    });

    test('should throw error for undefined input', () => {
      expect(() => lengthyDate(undefined))
        .not.toThrow(); // undefined allowed, defaults to current date
    });

    test('should throw error for non-Date objects', () => {
      expect(() => lengthyDate("2024-01-01"))
        .toThrow('Input must be a valid Date object');
      expect(() => lengthyDate(123))
        .toThrow('Input must be a valid Date object');
      expect(() => lengthyDate({}))
        .toThrow('Input must be a valid Date object');
    });

    test('should throw error for invalid Date values', () => {
      expect(() => lengthyDate(new Date('invalid')))
        .toThrow('Invalid Date: date object contains an invalid date');
      expect(() => lengthyDate(new Date('2024-13-45')))
        .toThrow('Invalid Date: date object contains an invalid date');
    });
  });

  describe('Month formatting', () => {
    test('january', () => {
      expect(lengthyDate(new Date(2024, 0, 15)))
        .toBe('it is monday january fifteenth');
    });

    test('december', () => {
      expect(lengthyDate(new Date(2024, 11, 25)))
        .toBe('it is wednesday december twenty fifth');
    });
  });

  describe('Day formatting', () => {
    test('first of month', () => {
      expect(lengthyDate(new Date(2024, 0, 1)))
        .toBe('it is monday january first');
    });

    test('thirty first', () => {
      expect(lengthyDate(new Date(2024, 0, 31)))
        .toBe('it is wednesday january thirty first');
    });
  });

  describe('Weekday formatting', () => {
    test('monday', () => {
      expect(lengthyDate(new Date(2024, 0, 1)))
        .toBe('it is monday january first');
    });

    test('sunday', () => {
      expect(lengthyDate(new Date(2024, 0, 7)))
        .toBe('it is sunday january seventh');
    });
  });
});

import { shortDate } from '../src/verbatempus.js';

describe('shortDate', () => {
  describe('Invalid inputs', () => {
    test('should throw error for null input', () => {
      expect(() => shortDate(null))
        .toThrow('Input must be a valid Date object');
    });

    test('should throw error for undefined input', () => {
      expect(() => shortDate(undefined))
        .not.toThrow(); // undefined allowed, defaults to current date
    });

    test('should throw error for non-Date objects', () => {
      expect(() => shortDate("2024-01-01"))
        .toThrow('Input must be a valid Date object');
      expect(() => shortDate(123))
        .toThrow('Input must be a valid Date object');
      expect(() => shortDate({}))
        .toThrow('Input must be a valid Date object');
    });

    test('should throw error for invalid Date values', () => {
      expect(() => shortDate(new Date('invalid')))
        .toThrow('Invalid Date: date object contains an invalid date');
      expect(() => shortDate(new Date('2024-13-45')))
        .toThrow('Invalid Date: date object contains an invalid date');
    });
  });

  describe('Date formatting', () => {
    test('first of month', () => {
      expect(shortDate(new Date(2024, 0, 1)))
        .toBe('it is monday the first');
    });

    test('middle of month', () => {
      expect(shortDate(new Date(2024, 0, 15)))
        .toBe('it is monday the fifteenth');
    });

    test('end of month', () => {
      expect(shortDate(new Date(2024, 0, 31)))
        .toBe('it is wednesday the thirty first');
    });
  });

  describe('Weekday formatting', () => {
    test('monday', () => {
      expect(shortDate(new Date(2024, 0, 1)))
        .toBe('it is monday the first');
    });

    test('sunday', () => {
      expect(shortDate(new Date(2024, 0, 7)))
        .toBe('it is sunday the seventh');
    });
  });
});

import { terseDate } from '../src/verbatempus.js';

describe('terseDate', () => {
  describe('Invalid inputs', () => {
    test('should throw error for null input', () => {
      expect(() => terseDate(null))
        .toThrow('Input must be a valid Date object');
    });

    test('should throw error for undefined input', () => {
      expect(() => terseDate(undefined))
        .not.toThrow(); // undefined allowed, defaults to current date
    });

    test('should throw error for non-Date objects', () => {
      expect(() => terseDate("2024-01-01"))
        .toThrow('Input must be a valid Date object');
      expect(() => terseDate(123))
        .toThrow('Input must be a valid Date object');
      expect(() => terseDate({}))
        .toThrow('Input must be a valid Date object');
    });

    test('should throw error for invalid Date values', () => {
      expect(() => terseDate(new Date('invalid')))
        .toThrow('Invalid Date: date object contains an invalid date');
      expect(() => terseDate(new Date('2024-13-45')))
        .toThrow('Invalid Date: date object contains an invalid date');
    });
  });

  describe('Weekday formatting', () => {
    test('monday', () => {
      expect(terseDate(new Date(2024, 0, 1)))
        .toBe('it is monday');
    });

    test('tuesday', () => {
      expect(terseDate(new Date(2024, 0, 2)))
        .toBe('it is tuesday');
    });

    test('wednesday', () => {
      expect(terseDate(new Date(2024, 0, 3)))
        .toBe('it is wednesday');
    });

    test('thursday', () => {
      expect(terseDate(new Date(2024, 0, 4)))
        .toBe('it is thursday');
    });

    test('friday', () => {
      expect(terseDate(new Date(2024, 0, 5)))
        .toBe('it is friday');
    });

    test('saturday', () => {
      expect(terseDate(new Date(2024, 0, 6)))
        .toBe('it is saturday');
    });

    test('sunday', () => {
      expect(terseDate(new Date(2024, 0, 7)))
        .toBe('it is sunday');
    });
  });
});