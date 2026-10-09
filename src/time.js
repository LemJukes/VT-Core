// src/time.js
// (hour, minute, level) -> token list. One path per level family, table-driven where it can be.
// Phrasing authority: phrasing-spec-v2.md; tests/fixtures/phrases.json is generated from vtspec.py.

import {
  MINUTE_CARDINALS,
  MINUTES_TO_HOUR,
  hourWord,
  isLandmarkHour,
  timeOfDay,
  meridiem,
} from './words.js';

const tok = (type, value) => ({ type, value });

// ---- verbose + lengthy: exact minute --------------------------------------------------------
// lengthy is verbose minus 'minute[s]' and minus 'oclock'.

const CLOCK_FACES = {
  verbose: { units: true, oclock: true },
  lengthy: { units: false, oclock: false },
};

function spokenHour(hour, face) {
  const tokens = [tok('hour', hourWord(hour))];
  if (isLandmarkHour(hour)) return tokens; // 'noon' / 'midnight' are unambiguous: no oclock, no suffix
  if (face.oclock) tokens.push(tok('oclock', 'oclock'));
  const part = timeOfDay(hour);
  if (part) tokens.push(tok('suffix', part));
  return tokens;
}

function clockTokens(hour, minute, face) {
  const lead = tok('lead', 'it is');
  const count = (n, word) => tok('minute', face.units ? `${word} ${n === 1 ? 'minute' : 'minutes'}` : word);
  const next = (hour + 1) % 24;

  if (minute === 0) return [lead, ...spokenHour(hour, face)];

  // after: 1-10, past: 11-44
  if (minute <= 44) {
    const rel = minute <= 10 ? 'after' : 'past';
    let amount;
    if (minute === 15) amount = tok('minute', 'a quarter');
    else if (minute === 30) amount = tok('minute', 'half');
    else amount = count(minute, MINUTE_CARDINALS[minute]);
    return [lead, amount, tok('rel', rel), ...spokenHour(hour, face)];
  }

  // to: 45-59, counted down to the next hour
  const left = 60 - minute;
  const toHour = spokenHour(next, face);
  if (left === 15) return [lead, tok('minute', 'a quarter'), tok('rel', 'to'), ...toHour];
  // 'till' only when the target is midnight or noon: 'ten till noon', 'ten minutes to one oclock'
  if ((left === 10 || left === 5) && isLandmarkHour(next)) {
    return [lead, tok('minute', MINUTES_TO_HOUR[minute]), tok('rel', 'till'), ...toHour];
  }
  return [lead, count(left, MINUTES_TO_HOUR[minute]), tok('rel', 'to'), ...toHour];
}

// ---- short + terse: bands -------------------------------------------------------------------
// Each band covers minutes up to and including `upTo`.
//   pre    modifier spoken first ('almost', 'just about', 'just after', 'after')
//   minute landmark amount ('five', 'quarter', 'half'), if any
//   rel    'past' | 'to' | 'after', if any
//   hour   which hour is named: 'this' or 'next'

const band = (upTo, pre, minute, rel, hour) => ({ upTo, pre, minute, rel, hour });

// Landmarks :00 :05 :10 :15 :30 :45 :50 :55. Linger 5 min after :15 and :45, 10 after :30.
// 'just about' is the final minute only. After :45, approach words point at the hour.
const SHORT_BANDS = [
  band( 0, null,         null,      null,   'this'),
  band( 4, 'just after', null,      null,   'this'),
  band( 5, null,         'five',    'past', 'this'),
  band( 8, 'almost',     'ten',     'past', 'this'),
  band( 9, 'just about', 'ten',     'past', 'this'),
  band(10, null,         'ten',     'past', 'this'),
  band(13, 'almost',     'quarter', 'past', 'this'),
  band(14, 'just about', 'quarter', 'past', 'this'),
  band(19, null,         'quarter', 'past', 'this'),
  band(28, 'almost',     'half',    'past', 'this'),
  band(29, 'just about', 'half',    'past', 'this'),
  band(39, null,         'half',    'past', 'this'),
  band(43, 'almost',     'quarter', 'to',   'next'),
  band(44, 'just about', 'quarter', 'to',   'next'),
  band(49, null,         'quarter', 'to',   'next'),
  band(50, null,         'ten',     'to',   'next'),
  band(53, 'almost',     null,      null,   'next'),
  band(54, 'just about', null,      null,   'next'),
  band(55, null,         'five',    'to',   'next'),
  band(58, 'almost',     null,      null,   'next'),
  band(59, 'just about', null,      null,   'next'),
];

// Six wide bands. Terse keeps 'quarter after' where the other levels say 'quarter past'.
// ':06'-':14' is 'a bit after', not a bare 'after': the date+time joiner is 'at', and 'at after three' reads wrong.
const TERSE_BANDS = [
  band( 0, null,          null,      null,    'this'),
  band( 5, 'just after',  null,      null,    'this'),
  band(14, 'a bit after', null,      null,    'this'),
  band(24, null,          'quarter', 'after', 'this'),
  band(39, null,          'half',    'past',  'this'),
  band(49, null,          'quarter', 'to',    'next'),
  band(59, 'almost',      null,      null,    'next'),
];

const BAND_FACES = {
  short: { lead: 'it is', bands: SHORT_BANDS, meridiem: true },
  terse: { lead: 'its',   bands: TERSE_BANDS, meridiem: false },
};

function bandTokens(hour, minute, face) {
  const b = face.bands.find((candidate) => minute <= candidate.upTo);
  const named = b.hour === 'next' ? (hour + 1) % 24 : hour;
  const tokens = [tok('lead', face.lead)];
  if (b.pre) tokens.push(tok('rel', b.pre));
  if (b.minute) tokens.push(tok('minute', b.minute));
  if (b.rel) tokens.push(tok('rel', b.rel));
  tokens.push(tok('hour', hourWord(named)));
  if (face.meridiem && meridiem(named)) tokens.push(tok('suffix', meridiem(named)));
  return tokens;
}

export function timeTokens(hour, minute, level) {
  if (level in CLOCK_FACES) return clockTokens(hour, minute, CLOCK_FACES[level]);
  return bandTokens(hour, minute, BAND_FACES[level]);
}
