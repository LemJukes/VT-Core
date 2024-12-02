import { verboseDate, lengthyDate } from '../src/verbatempus.js';

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


  describe('lengthyDate', () => {
    describe('Basic formatting', () => {
      test('sample date matches dictionary format', () => {
        expect(lengthyDate(new Date(2024, 9, 24)))
          .toBe('it is thursday october twenty fourth');
      });
  
      test('start of year', () => {
        expect(lengthyDate(new Date(2024, 0, 1)))
          .toBe('it is monday january first');
      });
  
      test('end of year', () => {
        expect(lengthyDate(new Date(2024, 11, 31)))
          .toBe('it is tuesday december thirty first');
      });
    });
  
    describe('Month formatting', () => {
      const testDate = new Date(2024, 5, 15); // June 15, 2024
      test('converts month correctly', () => {
        expect(lengthyDate(testDate))
          .toBe('it is saturday june fifteenth');
      });
    });
  
    describe('Day formatting', () => {
      test('first of month', () => {
        expect(lengthyDate(new Date(2024, 3, 1)))
          .toBe('it is monday april first');
      });
  
      test('thirty first', () => {
        expect(lengthyDate(new Date(2024, 0, 31)))
          .toBe('it is wednesday january thirty first');
      });
    });
  
    describe('Error handling', () => {
      test('throws on invalid Date object', () => {
        expect(() => lengthyDate(new Date('invalid')))
          .toThrow('Invalid Date: date object contains an invalid date');
      });
  
      test('throws on non-Date input', () => {
        expect(() => lengthyDate('2024-01-01'))
          .toThrow('Input must be a valid Date object');
        expect(() => lengthyDate(null))
          .toThrow('Input must be a valid Date object');
        expect(() => lengthyDate(undefined))
          .toThrow('Input must be a valid Date object');
      });
    });
  });