# Verbatempus 2.0 — Reconciled Phrasing Spec

**Status:** draft v1, awaiting redline · **Date:** 2026-09-11
**Supersedes:** `docs/Verbatempus - Phrasing Dictionary.txt` (kept for provenance; it self-contradicts in six places)

This document is generated from `vtspec.py`, which emits all 1440 minutes × 4 levels. The
tables below are machine-produced from that file, not hand-typed — so the spec and the
fixtures cannot drift apart. Redline the rules; regenerate the tables.

---

## 1. Locked decisions

| # | Decision | Effect |
|---|---|---|
| 1 | **"after" minutes 1–10, "past" minutes 11–44** | Follows your verbose worked examples (switch at 10/11), not the summary rule (14/15) |
| 2 | **"a quarter" carries the article** | `a quarter past`, `a quarter to` — at verbose and lengthy |
| 3 | **"till" only when the target hour is midnight or noon** | `ten till midnight`, `five till noon`; but `ten minutes to one oclock` |
| 4 | **Short lingers on a landmark, then approaches the next** | Three stages: landmark → almost → just about |
| 5 | **"just about" is the final minute only** | One-minute warning; "almost" carries the approach (28 min/hr vs 7) |
| 6 | **:50 and :55 are landmarks; approach words point at the hour** | Accepts the backwards step at `:54 → :55 → :56` |
| 7 | **Terse keeps "quarter after"** | The only level that does; its register is already distinct (`its`, bare `after`) |
| 8 | **Joiner: verbose `, and it is`; others ` at `** | As written in your templates |
| 9 | **Local time by default, optional timezone argument** | UTC is the substrate, not the output |

## 2. Rules by level

### Verbose — exact minute, `oclock`, time-of-day suffix

- `:00` → `it is <hour> oclock <suffix>`
- `:01`–`:10` → `it is <n> minute[s] after <hour> oclock <suffix>`
- `:11`–`:44` → `it is <n> minutes past <hour> oclock <suffix>` — `:15` → `a quarter past`, `:30` → `half past`
- `:45`–`:59` → `it is <60−n> minute[s] to <next hour> oclock <suffix>` — `:45` → `a quarter to`
- `:50` / `:55` → `ten till` / `five till` **only** when the next hour is midnight or noon

### Lengthy — as verbose, minus `minute[s]` and minus `oclock`

### Short — landmark bands, am/pm

Landmarks at `:00 :05 :10 :15 :30 :45 :50 :55`. Linger 5 minutes after `:15` and `:45`,
10 minutes after `:30`, none after the minor landmarks. Approach = `almost`, final minute
= `just about`. After `:45` the approach words point at the **hour**, not the next minor landmark.

### Terse — six wide bands, no suffix, no meridiem

`:00` landmark · `:01`–`:05` just after · `:06`–`:14` after · `:15`–`:24` quarter after ·
`:25`–`:39` half past · `:40`–`:49` quarter to · `:50`–`:59` almost

**Terse reproduces your original dictionary at 152/152 rows.** It needed no reconciliation.

## 3. Generated tables

### Verbose and lengthy — rule-boundary rows (hour 23)

| minute | verbose | lengthy |
|---|---|---|
| `23:00` | it is eleven oclock in the evening | it is eleven in the evening |
| `23:01` | it is one minute after eleven oclock in the evening | it is one after eleven in the evening |
| `23:05` | it is five minutes after eleven oclock in the evening | it is five after eleven in the evening |
| `23:10` | it is ten minutes after eleven oclock in the evening | it is ten after eleven in the evening |
| `23:11` | it is eleven minutes past eleven oclock in the evening | it is eleven past eleven in the evening |
| `23:15` | it is a quarter past eleven oclock in the evening | it is a quarter past eleven in the evening |
| `23:29` | it is twenty nine minutes past eleven oclock in the evening | it is twenty nine past eleven in the evening |
| `23:30` | it is half past eleven oclock in the evening | it is half past eleven in the evening |
| `23:44` | it is forty four minutes past eleven oclock in the evening | it is forty four past eleven in the evening |
| `23:45` | it is a quarter to midnight | it is a quarter to midnight |
| `23:46` | it is fourteen minutes to midnight | it is fourteen to midnight |
| `23:50` | it is ten till midnight | it is ten till midnight |
| `23:55` | it is five till midnight | it is five till midnight |
| `23:59` | it is one minute to midnight | it is one to midnight |

### Short — full hour 23

| minute | phrase |
|---|---|
| `23:00` | it is eleven pm |
| `23:01`–`23:04` | it is just after eleven pm |
| `23:05` | it is five past eleven pm |
| `23:06`–`23:08` | it is almost ten past eleven pm |
| `23:09` | it is just about ten past eleven pm |
| `23:10` | it is ten past eleven pm |
| `23:11`–`23:13` | it is almost quarter past eleven pm |
| `23:14` | it is just about quarter past eleven pm |
| `23:15`–`23:19` | it is quarter past eleven pm |
| `23:20`–`23:28` | it is almost half past eleven pm |
| `23:29` | it is just about half past eleven pm |
| `23:30`–`23:39` | it is half past eleven pm |
| `23:40`–`23:43` | it is almost quarter to midnight |
| `23:44` | it is just about quarter to midnight |
| `23:45`–`23:49` | it is quarter to midnight |
| `23:50` | it is ten to midnight |
| `23:51`–`23:53` | it is almost midnight |
| `23:54` | it is just about midnight |
| `23:55` | it is five to midnight |
| `23:56`–`23:58` | it is almost midnight |
| `23:59` | it is just about midnight |

### Short — midnight hour, showing landmark-hour handling

| minute | phrase |
|---|---|
| `00:00` | it is midnight |
| `00:01`–`00:04` | it is just after midnight |
| `00:05` | it is five past midnight |
| `00:06`–`00:08` | it is almost ten past midnight |
| `00:09` | it is just about ten past midnight |
| `00:10` | it is ten past midnight |
| `00:11`–`00:13` | it is almost quarter past midnight |
| `00:14` | it is just about quarter past midnight |
| `00:15`–`00:19` | it is quarter past midnight |
| `00:20`–`00:28` | it is almost half past midnight |
| `00:29` | it is just about half past midnight |
| `00:30`–`00:39` | it is half past midnight |
| `00:40`–`00:43` | it is almost quarter to one am |
| `00:44` | it is just about quarter to one am |
| `00:45`–`00:49` | it is quarter to one am |
| `00:50` | it is ten to one am |
| `00:51`–`00:53` | it is almost one am |
| `00:54` | it is just about one am |
| `00:55` | it is five to one am |
| `00:56`–`00:58` | it is almost one am |
| `00:59` | it is just about one am |

### Terse — full hour 23

| minute | phrase |
|---|---|
| `23:00` | its eleven |
| `23:01`–`23:05` | its just after eleven |
| `23:06`–`23:14` | its after eleven |
| `23:15`–`23:24` | its quarter after eleven |
| `23:25`–`23:39` | its half past eleven |
| `23:40`–`23:49` | its quarter to midnight |
| `23:50`–`23:59` | its almost midnight |

### Landmark hours across all four levels

| time | verbose | lengthy | short | terse |
|---|---|---|---|---|
| `00:00` | it is midnight | it is midnight | it is midnight | its midnight |
| `00:01` | it is one minute after midnight | it is one after midnight | it is just after midnight | its just after midnight |
| `00:15` | it is a quarter past midnight | it is a quarter past midnight | it is quarter past midnight | its quarter after midnight |
| `00:45` | it is a quarter to one oclock in the morning | it is a quarter to one in the morning | it is quarter to one am | its quarter to one |
| `11:45` | it is a quarter to noon | it is a quarter to noon | it is quarter to noon | its quarter to noon |
| `11:50` | it is ten till noon | it is ten till noon | it is ten to noon | its almost noon |
| `12:00` | it is noon | it is noon | it is noon | its noon |
| `12:15` | it is a quarter past noon | it is a quarter past noon | it is quarter past noon | its quarter after noon |
| `23:45` | it is a quarter to midnight | it is a quarter to midnight | it is quarter to midnight | its quarter to midnight |
| `23:50` | it is ten till midnight | it is ten till midnight | it is ten to midnight | its almost midnight |
| `23:59` | it is one minute to midnight | it is one to midnight | it is just about midnight | its almost midnight |

Landmark hours (midnight, noon) take **no `oclock`, no time-of-day suffix, and no am/pm** —
the word is already unambiguous. The suffix follows the hour being *referenced*, so `16:45`
is `a quarter to five oclock in the evening`, not "in the afternoon".

## 4. Display contract

These are the numbers the fixed-grid displays have to be built against.

| level | longest time phrase | distinct time phrases | longest date | longest combined |
|---|---|---|---|---|
| verbose | 61 chars | 1440 | 62 | **135** |
| lengthy | 46 | 1440 | 40 | 84 |
| short | 39 | 456 | 34 | 71 |
| terse | 26 | 91 | 15 | 41 |

Worst-case **rows** needed, wrapping on word boundaries:

| board width | verbose | lengthy | short | terse |
|---|---|---|---|---|
| 10 cols | 9 | 6 | 5 | 4 |
| **12 cols** | **6** | 5 | 4 | 3 |
| 14 cols | 6 | 4 | 3 | 2 |
| 16 cols | 5 | 4 | 3 | 2 |
| 20 cols | 4 | 3 | 3 | 2 |

**Split-flap's current 6×12 board fits all four levels — verbose at exactly 6 rows, zero
headroom.** Combined date-and-time does not fit at any level above terse; verbose combined
needs roughly 12 rows at 12 columns. Decide whether the board shows time only, or grows.

**Klok** needs the *union* of all four levels visible in one grid. The 456 distinct short
phrases and 1440 distinct verbose phrases mean a literal word-search grid can only realistically
carry terse (91 distinct phrases, 26 chars) plus perhaps short. This is the constraint to
design against before drawing a grid.

## 5. Judgment calls — these need your redline

Everything below is a place I chose rather than you. Each is a one-line change in `vtspec.py`.

1. **No article at short and terse.** You said "always an article", but your short and terse
   rows never had one and terse compresses `it is` → `its`. I applied the article at verbose
   and lengthy only. If you meant all four, short becomes `it is a quarter past eleven pm`.
2. **10-minute linger after half past, 5 after quarter past.** Not a principle — it is what
   all three of your sample hours do, consistently. A uniform 5 would be more derivable.
3. **`just about` at `:54` and `:59` in the last ten minutes.** Your `00:56`–`59` rows are four
   minutes of `just about`; decision 5 makes it one. Divergence is deliberate, flagged here.
4. **`:01`–`:04` is `just after <hour>`, with no approach to `:05`.** Matches your text; means
   the `:00`→`:05` gap is the only one with no approach phase.
5. **Time-of-day suffix on every non-landmark phrase.** Your dictionary always has it; the old
   code dropped it in places. Now uniform.

## 6. Divergence from the original dictionary

| level | rows identical | deliberate changes |
|---|---|---|
| verbose | 144 / 152 | article on quarter; `after`/`past` boundary at 10/11; fixes the `AFTER EVENING OCLOCK` typo at 23:05 |
| lengthy | 130 / 152 | same, plus `till` at 23:50 and the `after` boundary |
| short | 136 / 152 | `:50`/`:55` landmarks; one-minute `just about` |
| terse | **152 / 152** | none |

## 7. How this becomes the test suite

`vtspec.py` is the executable spec. Phase 1 step 1 is to run it once, emit all 5760 phrases
(1440 × 4) as a JSON fixture, and commit that as the golden file. The JS implementation is then
correct exactly when it reproduces the fixture. Any future phrasing change is a change to
`vtspec.py`, a regenerated fixture, and a visible diff in review — not a hand-edit to a table.

---

*Generated by an AI agent from Rob's phrasing dictionary and his reconciliation decisions.
The design decisions recorded here are his; the tabulation and the consistency checking are
the agent's. Responsibility for the spec remains the developer's.*
