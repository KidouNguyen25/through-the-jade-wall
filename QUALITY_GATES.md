# QUALITY GATES

No milestone is complete until its gates pass.

## Gate 0 — Repository health

- clean dependency install from lockfile;
- no committed secrets;
- `.gitignore` appropriate;
- README has local run instructions;
- license/provenance status documented.

## Gate 1 — Static quality

Commands must exist for:

- `format:check`
- `lint`
- `typecheck`

All pass with zero errors.

## Gate 2 — Unit tests

Required for:

- Mahjong resolver;
- puzzle condition evaluation;
- save schema/migration logic;
- narrative flag rules where deterministic.

## Gate 3 — Production build

`npm run build` passes.
No TypeScript build bypass.

## Gate 4 — Runtime smoke test

At minimum:

- page loads;
- canvas renders;
- player can move;
- no fatal console error;
- first interaction works.

Automate through Playwright once stable selectors/boot signals exist.

## Gate 5 — Gameplay acceptance

For each task, verify player-visible acceptance criteria.
A technically passing build with broken gameplay is a failure.

## Gate 6 — Performance budget

Initial vertical-slice targets are engineering budgets, not marketing guarantees:

- avoid persistent frame-loop allocations;
- initial loading screen gives progress;
- compressed deploy artifact kept intentionally small;
- no single uncompressed texture is added casually;
- repeated props use instancing where meaningful;
- no runaway event listeners/timers.

Record actual measured metrics as the slice becomes representative.

## Gate 7 — Save integrity

- checkpoint reload works;
- solved puzzle state persists;
- discarded memory state persists;
- incompatible save version fails safely.

## Gate 8 — Deployment

- Pages workflow succeeds;
- public URL loads from a clean browser session;
- asset paths work under repository base path;
- no dependency on localhost.

## Bug severity

P0:

- cannot start game;
- data corruption;
- deployment broken.

P1:

- progression blocked;
- save unusable;
- frequent crash.

P2:

- visible gameplay defect with workaround.

P3:

- polish issue.

Do not knowingly release a milestone with P0/P1 defects.
