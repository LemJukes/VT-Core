// src/index.js
// Verbatempus public surface.

import { fieldsIn } from './fields.js';
import { timeTokens } from './time.js';
import { dateTokens } from './date.js';
import { render } from './render.js';

const LEVELS = ['verbose', 'lengthy', 'short', 'terse'];
const PARTS = ['time', 'date', 'both'];
const CASES = ['lower', 'upper'];
const CHARSETS = ['full', 'alpha'];

// Longest phrase, in characters, for each level and parts. Fixed-grid displays size from this.
// Time is measured over all 1440 minutes; date over every weekday x month x ordinal day,
// with years 2010-2099 (the 'twenty xx' reading). tests/max-length.test.js recomputes
// these from the generated corpus, so they cannot drift without a failing test.
export const MAX_LENGTH = Object.freeze({
  verbose: Object.freeze({ time: 61, date: 65, both: 132 }),
  lengthy: Object.freeze({ time: 46, date: 40, both: 84 }),
  short: Object.freeze({ time: 39, date: 34, both: 71 }),
  terse: Object.freeze({ time: 26, date: 15, both: 41 }),
});

const JOINERS = { verbose: ', and it is', lengthy: 'at', short: 'at', terse: 'at' };

function validateDate(date) {
  // not `instanceof Date`: that rejects Dates created in another realm (iframe, vm)
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    throw new Error('Input must be a valid Date object');
  }
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid Date: date object contains an invalid date');
  }
}

function choose(name, value, allowed) {
  if (!allowed.includes(value)) {
    throw new Error(`Invalid ${name}: ${String(value)}. Expected one of: ${allowed.join(', ')}`);
  }
  return value;
}

export function formatParts(date = new Date(), options = {}) {
  validateDate(date);
  const level = choose('level', options.level ?? 'verbose', LEVELS);
  const parts = choose('parts', options.parts ?? 'time', PARTS);
  const letterCase = choose('case', options.case ?? 'lower', CASES);
  const charset = choose('charset', options.charset ?? 'full', CHARSETS);

  const fields = fieldsIn(date, options.timeZone);

  let tokens;
  if (parts === 'time') {
    tokens = timeTokens(fields.hour, fields.minute, level);
  } else if (parts === 'date') {
    tokens = dateTokens(fields, level);
  } else {
    // one sentence: the time drops its own lead, the joiner carries it
    tokens = [
      ...dateTokens(fields, level),
      { type: 'join', value: JOINERS[level] },
      ...timeTokens(fields.hour, fields.minute, level).slice(1),
    ];
  }

  const { text, tokens: rendered } = render(tokens, { case: letterCase, charset });
  return { text, tokens: rendered, level, parts, maxLength: MAX_LENGTH[level][parts] };
}

export function format(date, options) {
  return formatParts(date, options).text;
}

// Named conveniences. `level` and `parts` are fixed; timeZone, case and charset pass through.
const named = (level, parts) => (date, options) => format(date, { ...options, level, parts });

export const verboseTime = named('verbose', 'time');
export const lengthyTime = named('lengthy', 'time');
export const shortTime = named('short', 'time');
export const terseTime = named('terse', 'time');

export const verboseDate = named('verbose', 'date');
export const lengthyDate = named('lengthy', 'date');
export const shortDate = named('short', 'date');
export const terseDate = named('terse', 'date');

export const verboseDateTime = named('verbose', 'both');
export const lengthyDateTime = named('lengthy', 'both');
export const shortDateTime = named('short', 'both');
export const terseDateTime = named('terse', 'both');
