# Verbatempus

A Clock full of Words.

## Description

Verbatempus turns a JavaScript `Date` into an English phrase you can read or say aloud, at four
levels of verbosity. It has no dependencies, runs in Node and in the browser, and can render in any
IANA time zone.

## Installation

```sh
npm install verbatempus
```

## Usage

```js
import { format } from 'verbatempus';

format(new Date(2024, 9, 24, 10, 24));
// "it is twenty four minutes past ten oclock in the morning"

format(new Date(2024, 9, 24, 10, 24), { level: 'terse', parts: 'both' });
// "it is thursday at quarter after ten"
```

CommonJS:

```js
const { format } = require('verbatempus');
```

In a plain `<script>` page (no build step) use the browser bundle, `dist/verbatempus.iife.js`,
which defines a global `Verbatempus`:

```html
<script src="verbatempus.iife.js"></script>
<script>
  document.body.textContent = Verbatempus.format(new Date(), { level: 'short' });
</script>
```

## API

### `format(date?, options?) -> string`

`date` defaults to now. `null`, a non-`Date`, or an invalid `Date` throws.

| option     | values                                       | default     |                                                      |
|------------|----------------------------------------------|-------------|------------------------------------------------------|
| `level`    | `'verbose'` `'lengthy'` `'short'` `'terse'`  | `'verbose'` |                                                      |
| `parts`    | `'time'` `'date'` `'both'`                   | `'time'`    | `'both'` is one sentence, see the joiners below      |
| `timeZone` | an IANA name, e.g. `'America/New_York'`      | local time  | an invalid name throws a `RangeError`                |
| `case`     | `'lower'` `'upper'`                          | `'lower'`   |                                                      |
| `charset`  | `'full'` `'alpha'`                           | `'full'`    | `alpha` keeps `A–Z` and spaces only                  |

Unknown option values throw rather than falling back silently.

### Levels

| level     | time                                                       | date                                                          |
|-----------|------------------------------------------------------------|---------------------------------------------------------------|
| `verbose` | it is twenty four minutes past ten oclock in the morning   | it is thursday october the twenty fourth twenty twenty four   |
| `lengthy` | it is twenty four past ten in the morning                  | it is thursday october twenty fourth                          |
| `short`   | it is almost half past ten am                              | it is thursday the twenty fourth                              |
| `terse`   | its quarter after ten                                      | it is thursday                                                |

`parts: 'both'` is one sentence: the date, a joiner, then the time without its own `it is`.
Verbose joins with `, and it is`; the other levels join with `at`.

```js
format(d, { level: 'verbose', parts: 'both' });
// "it is thursday october the twenty fourth twenty twenty four, and it is twenty four minutes past ten oclock in the morning"
format(d, { level: 'lengthy', parts: 'both' });
// "it is thursday october twenty fourth at twenty four past ten in the morning"
```

The phrasing rules are fixed and tested against all 1440 minutes at every level: `after` for
minutes 1–10 and `past` for 11–44, `a quarter past` / `a quarter to` at verbose and lengthy,
`till` only toward midnight or noon, no `oclock` or time-of-day suffix on `midnight` and `noon`.

### `formatParts(date?, options?)`

Same arguments, structured result. Use it when a display needs to lay words out itself.

```js
formatParts(new Date(2024, 9, 24, 10, 24), { level: 'short' });
// {
//   text: 'it is almost half past ten am',
//   tokens: [
//     { type: 'lead',   value: 'it is' },
//     { type: 'rel',    value: 'almost' },
//     { type: 'minute', value: 'half' },
//     { type: 'rel',    value: 'past' },
//     { type: 'hour',   value: 'ten' },
//     { type: 'suffix', value: 'am' },
//   ],
//   level: 'short',
//   parts: 'time',
//   maxLength: 39
// }
```

Token types: `lead`, `minute`, `rel`, `hour`, `oclock`, `suffix`, `weekday`, `month`, `day`, `year`,
`join`. `text` is always the tokens read in order, after `case` and `charset` have been applied.

### `MAX_LENGTH`

The longest phrase, in characters, for each level and `parts`. Fixed-grid displays should size
themselves from it instead of guessing.

```js
MAX_LENGTH.verbose; // { time: 61, date: 65, both: 132 }
```

Time is measured over all 1440 minutes. Date is measured over every calendar day from 2010 to
2099. The test suite recomputes these from the generated corpus.

### Convenience functions

Thin wrappers over `format`. `level` and `parts` are fixed; `timeZone`, `case` and `charset` pass
through as the second argument.

```
verboseTime     lengthyTime     shortTime     terseTime
verboseDate     lengthyDate     shortDate     terseDate
verboseDateTime lengthyDateTime shortDateTime terseDateTime
```

## Upgrading from 1.0

- The eight `getVerboseTime()`-style functions are removed. `verboseTime()` already defaults to now.
- Import from `'verbatempus'`, not `src/verbatempus.js`.
- Phrasing changed. Verbose and lengthy now say `a quarter past` and `a quarter to`; 1.0 printed
  `quarter minutes to midnight` at 23:45, `shortTime` said `quarter to noon am` at 23:45, and
  `terseTime` said `noon` for the midnight hour. Years from 2100 on no longer collide with 2010–2099
  (2110 is `twenty one ten`, not `twenty ten`). Every phrase is lowercase.
- New: `format`, `formatParts`, date-and-time output, `timeZone`, `case`, `charset`, `MAX_LENGTH`.

## Development

```sh
npm test            # node --test: fixtures, bug regressions, time zones, bundles
npm run build       # dist/verbatempus.cjs and dist/verbatempus.iife.js
npm run fixtures    # regenerate tests/fixtures/phrases.json from the phrasing spec generator
```

`tests/fixtures/phrases.json` holds all 5760 phrases (1440 minutes × 4 levels) and is the
definition of correct. A phrasing change is an edit to the generator, a regenerated fixture, and
a visible diff.

## AI Disclaimer

This project was developed using GitHub Copilot with source assistance from Claude 3.5 Sonnet and ChatGPT-4 LLMs as part of the development toolset. The 2.0 rebuild was carried out by an AI agent (Claude) working from the author's design decisions. Any errors, inefficiencies, or bad practices are still however likely to be the author's fault and therefore responsibility. Any and all constructive feedback on better development strategies is more than welcome.

## License

MIT License - See [LICENSE](LICENSE) for details.
