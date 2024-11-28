
const { verboseTime } = require('./src/verbatempus');

describe('verboseTime', () => {
  test('should return "It is midnight" for 00:00', () => {
    const date = new Date('2023-10-24T00:00:00');
    expect(verboseTime(date)).toBe('It is midnight');
  });

  test('should return "It is noon" for 12:00', () => {
    const date = new Date('2023-10-24T12:00:00');
    expect(verboseTime(date)).toBe('It is noon');
  });

  test('should return "It is quarter past ten oclock in the morning" for 10:15', () => {
    const date = new Date('2023-10-24T10:15:00');
    expect(verboseTime(date)).toBe('It is quarter past ten oclock in the morning');
  });

  test('should return "It is half past ten oclock in the morning" for 10:30', () => {
    const date = new Date('2023-10-24T10:30:00');
    expect(verboseTime(date)).toBe('It is half past ten oclock in the morning');
  });

  test('should return "It is quarter to eleven oclock in the morning" for 10:45', () => {
    const date = new Date('2023-10-24T10:45:00');
    expect(verboseTime(date)).toBe('It is quarter to eleven oclock in the morning');
  });

  test('should return "It is ten oclock in the morning" for 10:00', () => {
    const date = new Date('2023-10-24T10:00:00');
    expect(verboseTime(date)).toBe('It is ten oclock in the morning');
  });

  test('should return "It is five minutes past ten oclock in the morning" for 10:05', () => {
    const date = new Date('2023-10-24T10:05:00');
    expect(verboseTime(date)).toBe('It is five minutes past ten oclock in the morning');
  });

  test('should return "It is five minutes to eleven oclock in the morning" for 10:55', () => {
    const date = new Date('2023-10-24T10:55:00');
    expect(verboseTime(date)).toBe('It is five minutes to eleven oclock in the morning');
  });
});