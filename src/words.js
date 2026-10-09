// src/words.js
// Number, hour, month and weekday words. Pure lookups, no Date handling.

const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
  'eighteen', 'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

// 1-99 -> words. 0 returns ''.
export function cardinal(n) {
  if (n < 20) return ONES[n];
  const ten = Math.floor(n / 10);
  const one = n % 10;
  return one ? `${TENS[ten]} ${ONES[one]}` : TENS[ten];
}

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

// Minutes past the hour as a plain count: 1 -> 'one' ... 59 -> 'fifty nine'.
// Pure cardinals. 15 is 'fifteen', never 'quarter'.
export const MINUTE_CARDINALS = Object.freeze(
  Object.fromEntries(range(1, 59).map((m) => [m, cardinal(m)]))
);

// Minutes REMAINING to the next hour, keyed by the current minute:
// 46 -> 'fourteen' ... 59 -> 'one'. Not interchangeable with MINUTE_CARDINALS.
export const MINUTES_TO_HOUR = Object.freeze(
  Object.fromEntries(range(45, 59).map((m) => [m, cardinal(60 - m)]))
);

export const LANDMARK_HOURS = Object.freeze({ 0: 'midnight', 12: 'noon' });

export const isLandmarkHour = (hour) => (hour % 24) in LANDMARK_HOURS;

// 24h hour (0-23) -> 'midnight' | 'noon' | 'one' ... 'eleven'
export function hourWord(hour) {
  const h = hour % 24;
  if (h in LANDMARK_HOURS) return LANDMARK_HOURS[h];
  return ONES[h % 12];
}

// 'in the morning' etc. Landmark hours carry no suffix.
export function timeOfDay(hour) {
  const h = hour % 24;
  if (h >= 1 && h <= 11) return 'in the morning';
  if (h >= 13 && h <= 16) return 'in the afternoon';
  if (h >= 17 && h <= 23) return 'in the evening';
  return '';
}

// 'am' | 'pm'. Landmark hours carry no meridiem.
export function meridiem(hour) {
  const h = hour % 24;
  if (h in LANDMARK_HOURS) return '';
  return h < 12 ? 'am' : 'pm';
}

export const MONTHS = Object.freeze([
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]);

export const WEEKDAYS = Object.freeze([
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
]);

// Day of month 1-31 -> ordinal
export const ORDINAL_DAYS = Object.freeze([
  '',
  'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
  'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth',
  'eighteenth', 'nineteenth', 'twentieth',
  'twenty first', 'twenty second', 'twenty third', 'twenty fourth', 'twenty fifth',
  'twenty sixth', 'twenty seventh', 'twenty eighth', 'twenty ninth',
  'thirtieth', 'thirty first',
]);

export function yearWords(year) {
  if (!Number.isInteger(year) || year < 0) {
    throw new Error('Year must be a positive integer');
  }

  // 2000-2009: 'two thousand' / 'two thousand and five'
  if (year >= 2000 && year <= 2009) {
    return `two thousand${year > 2000 ? ' and ' + cardinal(year - 2000) : ''}`;
  }

  const century = Math.floor(year / 100);
  const remainder = year % 100;

  if (century < 10) {
    if (year < 100) return cardinal(year);
    return `${cardinal(century)} hundred${remainder ? ' and ' + cardinal(remainder) : ''}`;
  }

  if (remainder === 0) return `${cardinal(century)} hundred`;

  // 2010 onward reads as two pairs: 'twenty ten', 'twenty one ten', 'twenty five twenty five'.
  // The whole century is spoken, so 2010 and 2110 stay distinct.
  // 2101-2109 would collide with 'twenty one five', so they take the 'hundred and' form.
  if (century >= 20) {
    if (remainder < 10) return `${cardinal(century)} hundred and ${cardinal(remainder)}`;
    return `${cardinal(century)} ${cardinal(remainder)}`;
  }

  // 1000-1999: 'nineteen hundred and five'
  return `${cardinal(century)} hundred and ${cardinal(remainder)}`;
}
