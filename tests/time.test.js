import { verboseTime } from '../src/verbatempus.js';

describe('verboseTime', () => {
  describe('Invalid inputs', () => {
    test('should throw error for null input', () => {
      expect(() => verboseTime(null))
        .toThrow('Input must be a valid Date object');
    });

    test('should throw error for undefined input', () => {
      expect(() => verboseTime(undefined))
        .not.toThrow(); // undefined allowed, defaults to current time
    });

    test('should throw error for non-Date objects', () => {
      expect(() => verboseTime("12:00"))
        .toThrow('Input must be a valid Date object');
      expect(() => verboseTime(1200))
        .toThrow('Input must be a valid Date object');
      expect(() => verboseTime({ hours: 12, minutes: 0 }))
        .toThrow('Input must be a valid Date object');
    });

    test('should throw error for invalid Date values', () => {
      expect(() => verboseTime(new Date('invalid')))
        .toThrow('Invalid Date: date object contains an invalid date');
      expect(() => verboseTime(new Date('2024-01-01 25:70')))
        .toThrow('Invalid Date: date object contains an invalid date');
    });
  });

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

import { lengthyTime } from '../src/verbatempus.js';

describe('lengthyTime', () => {
  describe('Invalid inputs', () => {
    test('should throw error for null input', () => {
      expect(() => lengthyTime(null))
        .toThrow('Input must be a valid Date object');
    });

    test('should throw error for undefined input', () => {
      expect(() => lengthyTime(undefined))
        .not.toThrow(); // undefined allowed, defaults to current time
    });

    test('should throw error for non-Date objects', () => {
      expect(() => lengthyTime("12:00"))
        .toThrow('Input must be a valid Date object');
      expect(() => lengthyTime(1200))
        .toThrow('Input must be a valid Date object');
      expect(() => lengthyTime({ hours: 12, minutes: 0 }))
        .toThrow('Input must be a valid Date object');
    });

    test('should throw error for invalid Date values', () => {
      expect(() => lengthyTime(new Date('invalid')))
        .toThrow('Invalid Date: date object contains an invalid date');
      expect(() => lengthyTime(new Date('2024-01-01 25:70')))
        .toThrow('Invalid Date: date object contains an invalid date');
    });
  });

  describe('Midnight cases', () => {
    test('exactly midnight', () => {
      expect(lengthyTime(new Date(2024, 0, 1, 0, 0)))
        .toBe('it is midnight');
    });

    test('fifteen past midnight', () => {
      expect(lengthyTime(new Date(2024, 0, 1, 0, 15)))
        .toBe('it is quarter past midnight');
    });

    test('thirty past midnight', () => {
      expect(lengthyTime(new Date(2024, 0, 1, 0, 30)))
        .toBe('it is half past midnight');
    });
  });

  describe('Noon cases', () => {
    test('exactly noon', () => {
      expect(lengthyTime(new Date(2024, 0, 1, 12, 0)))
        .toBe('it is noon');
    });

    test('quarter past noon', () => {
      expect(lengthyTime(new Date(2024, 0, 1, 12, 15)))
        .toBe('it is quarter past noon');
    });

    test('half past noon', () => {
      expect(lengthyTime(new Date(2024, 0, 1, 12, 30)))
        .toBe('it is half past noon');
    });
  });

  describe('Quarter hours', () => {
    test('quarter past', () => {
      expect(lengthyTime(new Date(2024, 0, 1, 3, 15)))
        .toBe('it is quarter past three in the morning');
    });

    test('half past', () => {
      expect(lengthyTime(new Date(2024, 0, 1, 3, 30)))
        .toBe('it is half past three in the morning');
    });

    test('quarter to', () => {
      expect(lengthyTime(new Date(2024, 0, 1, 3, 45)))
        .toBe('it is quarter to four in the morning');
    });
  });

  describe('Time of day ranges', () => {
    test('morning', () => {
      expect(lengthyTime(new Date(2024, 0, 1, 9, 0)))
        .toBe('it is nine in the morning');
    });

    test('afternoon', () => {
      expect(lengthyTime(new Date(2024, 0, 1, 14, 0)))
        .toBe('it is two in the afternoon');
    });

    test('evening', () => {
      expect(lengthyTime(new Date(2024, 0, 1, 20, 0)))
        .toBe('it is eight in the evening');
    });
  });

  describe('Minutes past/to', () => {
    test('minutes past', () => {
      expect(lengthyTime(new Date(2024, 0, 1, 3, 20)))
        .toBe('it is twenty past three in the morning');
    });

    test('minutes to', () => {
      expect(lengthyTime(new Date(2024, 0, 1, 3, 50)))
        .toBe('it is ten to four in the morning');
    });
  });
});

import { shortTime } from '../src/verbatempus.js';

describe('shortTime', () => {
  describe('Invalid inputs', () => {
    test('should throw error for null input', () => {
      expect(() => shortTime(null))
        .toThrow('Input must be a valid Date object');
    });

    test('should throw error for undefined input', () => {
      expect(() => shortTime(undefined))
        .not.toThrow(); // undefined allowed, defaults to current time
    });

    test('should throw error for non-Date objects', () => {
      expect(() => shortTime("12:00"))
        .toThrow('Input must be a valid Date object');
      expect(() => shortTime(1200))
        .toThrow('Input must be a valid Date object');
      expect(() => shortTime({ hours: 12, minutes: 0 }))
        .toThrow('Input must be a valid Date object');
    });
  });

  describe('Special cases', () => {
    test('midnight', () => {
      expect(shortTime(new Date(2024, 0, 1, 0, 0)))
        .toBe('it is midnight');
    });

    test('just after midnight', () => {
      expect(shortTime(new Date(2024, 0, 1, 0, 3)))
        .toBe('it is just after midnight');
    });

    test('noon', () => {
      expect(shortTime(new Date(2024, 0, 1, 12, 0)))
        .toBe('it is noon');
    });

    test('just after noon', () => {
      expect(shortTime(new Date(2024, 0, 1, 12, 3)))
        .toBe('it is just after noon');
    });
  });

  describe('Quarter hours', () => {
    test('quarter past', () => {
      expect(shortTime(new Date(2024, 0, 1, 3, 15)))
        .toBe('it is quarter past three am');
    });

    test('half past', () => {
      expect(shortTime(new Date(2024, 0, 1, 3, 30)))
        .toBe('it is half past three am');
    });

    test('quarter to', () => {
      expect(shortTime(new Date(2024, 0, 1, 3, 45)))
        .toBe('it is quarter to four am');
    });
  });

  describe('Approximate times', () => {
    test('almost quarter past', () => {
      expect(shortTime(new Date(2024, 0, 1, 3, 13)))
        .toBe('it is almost quarter past three am');
    });

    test('almost half past', () => {
      expect(shortTime(new Date(2024, 0, 1, 3, 25)))
        .toBe('it is almost half past three am');
    });

    test('almost next hour', () => {
      expect(shortTime(new Date(2024, 0, 1, 3, 55)))
        .toBe('it is almost four am');
    });
  });
});

import { terseTime } from '../src/verbatempus.js';

describe('terseTime', () => {
  describe('Invalid inputs', () => {
    test('should throw error for null input', () => {
      expect(() => terseTime(null))
        .toThrow('Input must be a valid Date object');
    });

    test('should throw error for undefined input', () => {
      expect(() => terseTime(undefined))
        .not.toThrow(); // undefined allowed, defaults to current time
    });

    test('should throw error for non-Date objects', () => {
      expect(() => terseTime("12:00"))
        .toThrow('Input must be a valid Date object');
      expect(() => terseTime(1200))
        .toThrow('Input must be a valid Date object');
      expect(() => terseTime({ hours: 12, minutes: 0 }))
        .toThrow('Input must be a valid Date object');
    });
  });

  describe('Special cases', () => {
    test('midnight', () => {
      expect(terseTime(new Date(2024, 0, 1, 0, 0)))
        .toBe('its midnight');
    });

    test('just after midnight', () => {
      expect(terseTime(new Date(2024, 0, 1, 0, 3)))
        .toBe('its just after midnight');
    });

    test('noon', () => {
      expect(terseTime(new Date(2024, 0, 1, 12, 0)))
        .toBe('its noon');
    });

    test('just after noon', () => {
      expect(terseTime(new Date(2024, 0, 1, 12, 3)))
        .toBe('its just after noon');
    });
  });

  describe('Regular hours', () => {
    test('exact hour', () => {
      expect(terseTime(new Date(2024, 0, 1, 3, 0)))
        .toBe('its three');
    });

    test('just after hour', () => {
      expect(terseTime(new Date(2024, 0, 1, 3, 4)))
        .toBe('its just after three');
    });

    test('after hour', () => {
      expect(terseTime(new Date(2024, 0, 1, 3, 8)))
        .toBe('its after three');
    });

    test('quarter after', () => {
      expect(terseTime(new Date(2024, 0, 1, 3, 20)))
        .toBe('its quarter after three');
    });

    test('half past', () => {
      expect(terseTime(new Date(2024, 0, 1, 3, 35)))
        .toBe('its half past three');
    });
  });

  describe('Approaching next hour', () => {
    test('quarter to', () => {
      expect(terseTime(new Date(2024, 0, 1, 3, 45)))
        .toBe('its quarter to four');
    });

    test('almost next hour', () => {
      expect(terseTime(new Date(2024, 0, 1, 3, 55)))
        .toBe('its almost four');
    });
  });
});