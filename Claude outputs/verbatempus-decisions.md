# Verbatempus 2.0 — Locked Decisions & Their Consequences

**Date:** 2026-09-11 · Companion to `assessment-2026-09.md` and `phrasing-spec-v2.md`

All seven open questions from the assessment are now answered. This records what was decided,
what it changes, and the three findings that came out of checking the answers.

---

## Decisions

| # | Question | Decision |
|---|---|---|
| 1 | Phrasing rules | Reconciled — see `phrasing-spec-v2.md` |
| 2 | Time basis | **Local time by default, optional timezone argument.** UTC is the substrate things are built on, not the output |
| 3 | Registry | **Public npm, unscoped** |
| 4 | Solari | **Dead** |
| 5 | Klok | **Word-search grid display** — see below |
| 6 | Packaging | **Core ships standalone; displays are optional add-on modules** |
| 7 | 1.0.0 | **Killed. Move to 2.0.0** |

### On Klok

Klok is named for a now-defunct iPhone app that displayed the time as highlighted words inside
a grid of characters, word-search style. [qlock](https://arcade.pirillo.com/qlock.html) is
effectively a replica of it. The intent here is **not** a replica: Rob wants a larger, denser
grid so that *all four terseness levels* can be expressed from a single character grid.

That is a materially harder problem than qlock, which only has to light up one fixed phrase set.
The constraint is in §4 of the phrasing spec: terse has 91 distinct phrases, short has 456,
verbose and lengthy have 1440 each. A single grid that can highlight any verbose phrase is
almost certainly not buildable; terse plus short is the realistic target. **Klok needs a
feasibility pass on grid construction before any code** — the grid layout is the whole problem,
and it is a constraint-satisfaction problem, not a rendering one.

---

## Three findings from checking the answers

### 1. `verbatempus` was published to public npm, then unpublished

Socket's registry index shows `verbatempus@1.0.0` published ~2 years ago and since removed:
*"it seems this package was removed from the registry."*

Consequences, all confirmed against npm's published policy:

- **The name is reclaimable.** npm blocks republishing a fully-unpublished name for 24 hours;
  that window expired long ago. *(npm's policy does not restrict reclamation to the original
  owner, so the name is not reserved — claim it early rather than at the end of the rebuild.)*
- **`1.0.0` can never be republished.** npm: *"Once `package@version` has been used, you can
  never use it again. You must publish a new version even if you unpublished the old one."*
  So going to 2.0.0 is not merely reasonable — it is required. Decision 7 was already forced.
- **The "is 1.0.0 in use" question is moot.** It is unpublishable and uninstallable. Anyone who
  had it pinned is already broken, and has been for however long since the unpublish.

### 2. VT-Terminal cannot `npm install` from a clean clone

Its lockfile still resolves the dead tarball:

```
"node_modules/verbatempus": {
  "version": "1.0.0",
  "resolved": "https://registry.npmjs.org/verbatempus/-/verbatempus-1.0.0.tgz",
```

That URL 404s. The assessment listed Terminal as "build health unknown" — that was too kind.
It is **definitively broken from clean**, and has been since the unpublish. The June 2026
dependabot merge is a second, separate risk on top.

The lockfile also confirms the packaging analysis against the *actually published* artifact:
the tarball declared all ~180 of jest's transitive packages as runtime `dependencies`. Anyone
who installed verbatempus@1.0.0 pulled all of jest.

### 3. Decision 6 changes the split-flap plan

"Displays as optional add-on modules" means each display becomes a package consuming
`verbatempus` — not a page with a copy of the logic. That is the right call and it kills the
fork cleanly, but it has a consequence worth being deliberate about:

**VT-split-flap is currently a plain `<script>` page with no build step.** Making it an add-on
module gives it a toolchain it does not have today. Two ways out, and this is a real choice
rather than a detail: ship Core with a browser IIFE build so the page can keep working
build-free and the "module" is just a script tag, or accept that split-flap gains Vite like
Terminal has. The first keeps the demo pages trivially hostable; the second is more uniform.

---

## What this changes in the plan

The assessment's phasing stands, with these amendments:

- **Phase 0 is done** — `phrasing-spec-v2.md` + `vtspec.py`, pending redline of the five
  judgment calls in its §5.
- **Claim the npm name early**, in Phase 1 rather than at the end. Publish `2.0.0-alpha.0`
  as a placeholder as soon as there is anything to publish. The name is not reserved.
- **Phase 4 (Solari) is deleted.** Archive the repo.
- **Phase 5 (Klok) gains a feasibility pass** ahead of the design brief — grid construction
  for multiple verbosity levels is the actual risk, and it may bound which levels are possible.
- **VT-Terminal's first task is unbreaking the install**, not verifying the build. It will fail
  on `verbatempus` before it gets as far as vite.

---

*Decisions recorded here are Rob's. Findings 1–3 were verified against npm's published policy,
the Socket registry index, and VT-Terminal's committed lockfile. Responsibility for acting on
any of it remains the developer's.*
