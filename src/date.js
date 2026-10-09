// src/date.js
// Wall-clock date fields + level -> token list.

import { MONTHS, WEEKDAYS, ORDINAL_DAYS, yearWords } from './words.js';

const tok = (type, value) => ({ type, value });

export function dateTokens(fields, level) {
  const lead = tok('lead', 'it is');
  const weekday = tok('weekday', WEEKDAYS[fields.weekday]);
  const month = tok('month', MONTHS[fields.month - 1]);
  const ordinal = ORDINAL_DAYS[fields.day];

  switch (level) {
    case 'verbose':
      return [lead, weekday, month, tok('day', `the ${ordinal}`), tok('year', yearWords(fields.year))];
    case 'lengthy':
      return [lead, weekday, month, tok('day', ordinal)];
    case 'short':
      return [lead, weekday, tok('day', `the ${ordinal}`)];
    case 'terse':
      return [lead, weekday];
  }
}
