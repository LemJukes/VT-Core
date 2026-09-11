# Verbatempus — State of the Project & Rebuild Plan

**Assessed:** 2026-09-11 · **Scope:** VT-Core, VT-Klok, VT-Solari, VT-split-flap, VT-Terminal
**Method:** static read of all source + the library executed against the phrasing dictionary's own worked examples. Every bug listed below was reproduced, not inferred.

---

## 0. Correction to the framing

"Almost 2 years and haven't really touched it" is right for two repos and wrong for two:

| Repo | Last human commit | Actual age |
|---|---|---|
| VT-Solari | 2024-11-13 | 22 months — matches |
| VT-Core (logic) | 2025-02-09 | 19 months — `index.html` touched 2026-03-19 |
| **VT-split-flap** | **2026-03-19 "major update"** | **6 months** |
| **VT-Terminal** | code 2024-12-03, but dependabot merged **2026-06-13** | code 21 months, toolchain 3 months |

Two consequences:

- The one display that works properly is the one you reworked six months ago. That's not a coincidence, and `script.js` is by some distance the best code in the project.
- VT-Terminal's `vite` and `@vitejs/plugin-react` were force-bumped across major versions (vite ^8, plugin-react ^6) by a bot three months ago and, as far as the history shows, never built or deployed since. There are **10 more open dependabot branches** on it. Treat "does it still build" as an open question, not an assumption.

---

# PART 1 — VT-Core

## 1.1 Confirmed output bugs

All reproduced by running `src/verbatempus.js` under node.

| # | Input | Output | Should be |
|---|---|---|---|
| **B1** | `verboseTime` 23:45 | `it is quarter minutes to midnight` | `…quarter to midnight` |
| | `verboseTime` 11:45 | `it is quarter minutes to noon` | `…quarter to noon` |
| **B2** | `shortTime` 23:45 | `it is quarter to noon am` | `…quarter to midnight` |
| | `shortTime` 23:46–23:59 | `it is quarter to noon am` | `…to midnight` |
| | `shortTime` 11:45 | `it is quarter to noon pm` | `…quarter to noon` |
| **B3** | `terseTime` 00:15–00:24 | `its quarter after noon` | `…after midnight` |
| | `terseTime` 00:25–00:39 | `its half past noon` | `…past midnight` |
| **B4** | `verboseDate` year 2110 | `twenty ten` | `twenty one ten` |
| | year 2150 | `twenty fifty` | `twenty one fifty` |
| | year 2525 | `twenty twenty five` | `twenty five twenty five` |
| | year 3110 | `thirty ten` | `thirty one ten` |
| **B5** | `verboseTime` 00:00 / 12:00 | `It is midnight` / `It is noon` | lowercase like every other return |

**Causes:**

- **B1** — in `verboseTime`, the `nextHour === 0` and `nextHour === 12` branches run *before* the `minutes === 45` special case. So minute 45 falls into the generic path and gets `MINUTES_TO_WORDS[45]` (`'quarter'`) with `" minutes to "` appended. Pure branch-ordering.
- **B2** — `HOURS_TO_WORDS[12]` is `'noon'`, but `displayHour`/`nextDisplayHour` are normalised to 12 for *both* noon and midnight. `shortTime` also appends `meridiem` unconditionally, so it emits a landmark word and an am/pm marker together, **and is 12 hours wrong**. This is the worst bug in the library: at 23:45 a clock claims it's nearly noon.
- **B3** — same root cause. The `hours === 0` special block in `terseTime` only covers `minutes < 15`; everything above falls through to `HOURS_TO_WORDS[12]` = `'noon'`.
- **B4** — `formatYear`'s `century >= 20` branch does `Math.floor(century / 10) * 10`, which throws away the century's units digit. Correct only for 2000–2099. Beyond that it silently collides: **2010 and 2110 produce identical output; so do 2025 and 2525.**
- **B5** — two of 40-odd return statements capitalise. `tests/time.test.js` asserts `'It is midnight'` as correct, so the test suite is currently protecting the inconsistency.

## 1.2 Latent hazards (not yet wrong, one refactor from wrong)

- **`MINUTES_TO_WORDS` is two tables wearing one coat.** Keys 1–44 are cardinals; keys 45–59 hold the *complement* (`46: 'fourteen'`, `59: 'one'`) so the "to" phrasing can index it directly. Any future code that reads it as a cardinal minute gets a silently wrong word. B1 is exactly that mistake, already made once.
- **`getTimeOfDayRange(0)` and `(12)` return `''`.** The ranges are 1–11 / 13–16 / 17–23; hours 0 and 12 are unmapped. Currently unreachable because the landmark branches catch them first, but the string templates interpolate it unguarded — reordering any branch produces a trailing space or a bare `it is ten oclock `.
- **`try { … } catch (error) { throw error }` in all eight functions.** A no-op that adds eight levels of indentation and zero behaviour.
- **Local time only.** Every function uses `getHours()` / `getDate()` / `getDay()`. The project description says *"converts UTC time objects"* — the code does no such thing. Verified: `2024-10-24T23:30:00Z` renders as `half past eleven in the evening` under `TZ=UTC` and `half past seven in the evening` under `TZ=America/New_York`. Stated purpose and implementation disagree; one of them has to move.

## 1.3 Spec conformance — measured

Ran all four time functions against the dictionary's own worked examples (152 rows each, 22:59→01:30), normalised for case and punctuation:

| Level | Match | |
|---|---|---|
| verbose | 114 / 152 | 75% |
| lengthy | 129 / 152 | 85% |
| short | **91 / 152** | **60%** |
| terse | 127 / 152 | 84% |
| **total** | **461 / 608** | **76%** |

**Do not read that as a pure indictment of the code — the spec is also broken.** The dictionary contradicts itself in at least six places:

1. Summary rule says `01-14 = AFTER, 15-44 = PAST`. The verbose worked examples switch at **10/11**, not 14/15.
2. Summary says `45-50 = TO`. The examples run `TO` all the way to :59. Rows 51–59 have no rule at all.
3. Lengthy examples use `PAST` at the five-minute marks (23:05, 23:10) and `AFTER` everywhere else 1–9 — an unstated rule that then stops applying above :11.
4. `23:45 = IT IS A QUARTER TO MIDNIGHT` but `00:15 = IT IS QUARTER PAST MIDNIGHT`. The article appears only in "to" forms, and not consistently there.
5. `23:50 = TEN TILL MIDNIGHT` and `23:55 = FIVE TILL MIDNIGHT`, but `00:50 = TEN MINUTES TO ONE OCLOCK`. The `TILL` form seems to exist only when the target is midnight, which reads like drift rather than intent.
6. Typo at `23:05`: `FIVE MINUTES AFTER **EVENING** OCLOCK IN THE EVENING`.

The **short** level is where code and spec diverge structurally rather than cosmetically — the minute bands are simply different tables:

| | spec | code |
|---|---|---|
| 23:16–23:19 | `QUARTER PAST ELEVEN PM` | `ALMOST HALF PAST ELEVEN PM` |
| 23:40–23:43 | `ALMOST QUARTER TO MIDNIGHT` | `HALF PAST ELEVEN PM` |
| 23:44 | `JUST ABOUT QUARTER TO MIDNIGHT` | `HALF PAST ELEVEN PM` |

The spec also has a `JUST ABOUT` band (the minute immediately before a landmark) that the code never emits at all.

**Implication:** reconciling the dictionary into one unambiguous ruleset is the *first* task, not a side-quest. There is no point fixing code against a spec that can't be satisfied.

**The upside:** those four × 152 worked examples are a golden-fixture corpus you already wrote. Once reconciled, they become the test suite, and the reconciled table can generate all 1440 minutes × 4 levels instead of just the 152 around midnight.

## 1.4 Architecture

- **Four near-identical time functions, ~330 of 480 lines.** Each one independently reimplements: landmark-hour special cases, 24→12 conversion, next-hour wrap, meridiem, and band selection. Every bug above exists in one copy and not the others *because* they're copies. This is the single highest-value refactor: one table-driven formatter, verbosity as a parameter.
- **Sixteen exports for eight behaviours.** `verboseTime(date)` already defaults to `new Date()` when called with no argument, so `getVerboseTime()` is a wrapper that adds nothing. Delete the eight `get*` forms or make them the only public surface — not both.
- **No combined date-and-time output.** The dictionary defines `verbose(date&time)`, `lengthy(date&time)` etc. as first-class formats. Nothing implements them. VT-Terminal works around this by concatenating two sentences and produces `it is friday … and it is twenty four minutes past ten…` — two "it is" clauses in one line.
- **No seconds**, no i18n seam (despite *"English only (for now)"*), no injectable clock for deterministic testing downstream.

## 1.5 Packaging

- **`dependencies` contains ~180 packages** — jest's entire transitive tree, pinned individually. The commit that did it is titled *"i guess jest needs all of those actually…"*, immediately after *"removed superfluous dependencies"*. That was a misdiagnosis: jest needs them **installed**, but as transitive dependencies of `jest` sitting in `devDependencies` — npm resolves them automatically. Listing them as direct `dependencies` means anyone installing this "lightweight library" pulls all of jest into their runtime tree. Correct state: **zero `dependencies`**, `jest` alone in `devDependencies`.
- **The registry story is internally contradictory.** `publishConfig.registry` points at GitHub Packages, but the package name `verbatempus` is unscoped — GitHub Packages requires `@owner/name`, so that publish would be rejected as written. Meanwhile the README says `npm install verbatempus` and VT-Terminal depends on unscoped `"verbatempus": "^1.0.0"`. At most one of these three can be true. *(I couldn't query the npm registry from this session — egress is blocked — so confirm whether `verbatempus` actually resolves publicly before deciding.)*
- **`main` only** — no `exports` map, no CJS, no browser bundle, no types. VT-split-flap is a plain `<script>` page with no build step, so it **cannot consume an ESM-only npm package**. That is almost certainly why it has its own copy of the phrasing logic.
- No CI, no `.gitignore` in VT-Core — `node_modules/` is in the working tree and `.DS_Store` is committed (twice, including its own "Update .DS_Store" commit).
- Version is `1.0.0` with the bug profile above.

---

# PART 2 — The four display modules

## 2.1 Where they actually stand

| Repo | State | Consumes VT-Core? |
|---|---|---|
| **VT-split-flap** | Working. Polished animation, queued transitions, mechanical timing variance, CSS custom properties. | **No — forked copy of the phrasing logic** |
| **VT-Terminal** | Working skeleton. ~40 lines of React. Deployed to `terminal.verbatempus.com`, `gh-pages` branch exists. | Yes — the only real consumer |
| **VT-Solari** | CRA scaffold plus one orphaned component. Never wired to anything. | No |
| **VT-Klok** | **Empty.** A `.gitattributes` and nothing else. | n/a |

So "only got one working properly" is accurate — and the one that works, works **by not using the library**. That's the finding that should drive the whole plan.

## 2.2 The structural problem

There is no consumer contract. VT-Core emits one English sentence as a string, and that is the entire interface.

A split-flap board needs fixed-width rows, uppercase, a constrained character set, and — critically — a **bounded maximum phrase length** so the board can be sized. A terminal needs the raw sentence. A Solari board probably needs word-level atoms so words don't split across modules.

Today each display solves that itself, and split-flap solved it by forking the phrasing engine. That fork has now drifted, with its own independent bugs:

- `IT IS NOW MIDNIGHT OCLOCK` and `IT IS NOW NOON OCLOCK` at :00 — the landmark words get `OCLOCK` appended.
- `SEVEN TEEN` (minute 17) — typo.
- `IN THE AFTER NOON` — either a column-fitting hack or a typo. Decide which and write it down; right now it reads as the latter.
- The time-of-day suffix (`IN THE MORNING` etc.) is appended **only when `minute === 0`**. Every other minute of the hour drops it silently.
- `getTimeInWords()` takes no argument and calls `new Date()` internally — untestable, and can't be driven by fixtures.

**The fix is one decision:** VT-Core grows a structured output alongside the string — a token/segment array, a declared `maxLength` per verbosity level, and `case` / `charset` options. Then every display consumes the same source and the fork can be deleted.

## 2.3 Per-module

### VT-split-flap — *refactor, don't rebuild*

The display layer is good; leave it alone. The issues are around it:

- **Delete `verbatempus-splitflap-core.js`**, consume VT-Core. Requires Core to ship a browser build or split-flap to gain a build step (§1.5).
- **A dead background timer.** `verbatempus-splitflap-core.js` runs its own `setInterval(updateTime, 60000)` whose only effect is `console.log`. It runs forever, alongside `script.js`'s real interval.
- **`setInterval(updateDisplay, 60000)` isn't aligned to the minute boundary.** Whatever second the page loads on is the second it ticks on forever, so the display can lag the real minute by up to 59 seconds. Same flaw in VT-Terminal. For a clock this is a correctness bug, not a nicety — fix by scheduling to the next `:00`, not by interval.
- **D3 v4 from `//d3js.org/d3.v4.min.js`** — protocol-relative URL, unpinned version, third-party CDN on the critical path, ~250KB, used only for `select` / `data` / `each`. Thirty lines of vanilla DOM replaces it. Dropping it also removes the last reason the page needs a network fetch to render.
- **Licensing.** The flip animation derives from Noah Veltman's departures board (MIT). The README credits him, but there's no `LICENSE` file in the repo carrying his copyright notice — which MIT requires. Add it.
- Board is hard-coded 6×12 = 72 cells; `splitIntoRows` warns and truncates on overflow. Nothing currently guarantees any verbosity level fits. That guarantee has to come from Core's `maxLength`.
- No build, no deploy config — unlike Terminal, which has both.

### VT-Terminal — *small fixes, verify the toolchain first*

- **Build health is unknown.** Bot-bumped across two major versions in June, ten more dependabot branches open. First action is `npm install && npm run build`, before touching code.
- **`typeText` leaks intervals.** The effect that calls it has no cleanup return, so the interval is cleared neither on unmount nor when `currentTime` changes. At 50ms/char over ~120 chars the typing takes ~6s against a 60s tick, so it doesn't currently overlap in production — **but StrictMode double-invokes the effect, so two typewriters already race on the same state in dev.**
- **Double "it is"** from string-concatenating `verboseDate` and `verboseTime`. Needs the combined date-and-time formatter from Core (§1.4), not a local patch.
- **Font declared twice, used once.** `@fontsource/vt323` is a dependency that's never imported; `App.css` pulls VT323 from Google Fonts instead. Use the local package and drop the remote fetch — the CSP in `index.html` can then lose its `fonts.googleapis.com` / `fonts.gstatic.com` allowances, which are currently wider than needed.
- Unaligned minute tick, same as split-flap.
- ESLint is configured; there are no tests.

### VT-Solari — *decide before building*

- `react-scripts` 5.0.1. CRA is deprecated and unmaintained; starting anything here in 2026 is a dead end. If Solari lives, it moves to Vite.
- `App.js` is an orphan `SplitFlapDisplay` component: default text `'HELLO WORLD'`, no verbatempus import, and styled entirely with Tailwind class names (`bg-gray-900`, `text-yellow-500`) while **Tailwind is not installed** — so it renders unstyled.
- Three real bugs in that component if it's ever revived: one `setInterval` per character (20–40 concurrent timers); `clearInterval` called from *inside* a `setState` updater, which is a side effect in a reducer and double-fires under StrictMode; and `displayText` read from a stale closure while absent from the dependency array.
- **The open question:** the folder is literally named `split-flap-display-core`. Solari and VT-split-flap are two attempts at the same display. Either Solari is a genuinely distinct aesthetic (Solari = the physical Italian airport-board look, vs. split-flap = the flip technique) — in which case write down what makes it visually different *before* any code — or it's a duplicate and should be archived.

### VT-Klok — *greenfield, needs a brief*

Nothing exists. Before code: what is Klok? The name suggests Dutch/Afrikaans for "clock", which hints at something distinct from the departure-board family — Nixie tubes, flip-clock, analogue, seven-segment — but that's a guess on my part. This one needs a design brief first, and it's the right place to *prove* the new Core contract, because building it against a finished contract is the test of whether the contract is good.

---

# PART 3 — Sequencing

**Phase 0 — Reconcile the spec.** Turn the dictionary into one unambiguous, machine-readable ruleset (a JSON/YAML band table per verbosity level). Resolve the six contradictions in §1.3. This blocks everything; nothing downstream is worth doing against a spec that can't be satisfied. Output: the spec file *and* a generator that emits all 1440 minutes × 4 levels as fixtures.

**Phase 1 — VT-Core rebuild.** Roughly in order:
1. Golden fixtures from the Phase 0 generator.
2. Collapse the four time functions into one table-driven formatter; keep the eight named functions as thin wrappers so nothing downstream breaks.
3. Add combined date-and-time (spec defines it; nothing implements it).
4. Fix B1–B5, remove the latent hazards in §1.2 — split `MINUTES_TO_WORDS` into two honestly-named tables, map hours 0 and 12 in `getTimeOfDayRange`, delete the eight no-op try/catch blocks.
5. Settle and implement UTC vs. local vs. caller-supplied timezone.
6. Add the display contract: token array, `maxLength` per level, `case` / `charset` options.
7. Strip `dependencies` to zero; settle the registry/scope question; add an `exports` map with ESM plus a browser IIFE build.
8. CI running the fixture suite.

**Phase 2 — VT-split-flap.** Delete the fork, consume Core, drop d3, align the tick, add the Veltman LICENSE file. Cheapest meaningful win once Core is done, and it validates the display contract against code that already works.

**Phase 3 — VT-Terminal.** Verify the build, fix the typewriter lifecycle, use combined date-and-time, resolve the font duplication, align the tick.

**Phase 4 — VT-Solari.** Keep-or-kill decision. If keep: Vite, and a written visual brief before code.

**Phase 5 — VT-Klok.** Design brief, then build against the finished contract as its proof.

Phases 2 and 3 are independent of each other and could run in either order.

---

# PART 4 — Decisions that are yours, not mine

Listed, not recommended — these are design calls, and several of them determine large chunks of the work above.

1. **The phrasing rules** where the dictionary contradicts itself: the AFTER/PAST boundary; whether "A QUARTER" carries an article; whether `TILL` forms exist and when; and the short-level minute bands, which currently don't match the code at all.
2. **UTC, local, or caller-supplied timezone.** The project description and the implementation currently disagree.
3. **Registry:** public npm unscoped, or GitHub Packages as `@lemjukes/verbatempus`. Changes the install line in every consumer and in the README. (Check whether `verbatempus` is already taken on public npm first — I couldn't reach the registry from here.)
4. **Is Solari distinct from split-flap, or dead?**
5. **What is Klok?**
6. **Does Core ship a browser bundle?** This decides whether split-flap stays build-free or gains a toolchain — and it's the difference between deleting the fork easily and deleting it painfully.
7. **Is 1.0.0 in use anywhere besides VT-Terminal?** If not, break the API freely and ship 2.0.0 rather than carrying compatibility shims for a package with one known consumer.

---

*Assessment produced by an AI agent (Claude Opus 5) reading and executing the code. Findings in §1.1 and §1.3 were reproduced by running the library; everything else is a static read. All design decisions and responsibility for acting on this remain the developer's.*
