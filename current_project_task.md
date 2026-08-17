# CURRENT PROJECT TASK

## Active milestone

**Phase 9.1 — Gameplay Validation Gate**

## Objective

Turn the vertical-slice gameplay tests into a rock-solid, required release gate across CI and GitHub Pages deployment. Factor repeated E2E actions into reusable gameplay test helpers, eliminate arbitrary sleeps with observable UI/state locators, expand test coverage with targeted regressions (save persistence, branching discard consequences, and spatial gate invalidations), and strictly block unverified deployments unless 100% of Playwright tests pass.

## Delivered Milestones

- [x] **Phase 1 — Project Foundation & Locomotion**: Vite + React 18 + R3F + TS strict setup, isometric camera, WASD/arrow locomotion with sprint, collision boundaries, and quality gate baseline.
- [x] **Phase 2 — Mahjong Tile Grammar & Sequence Gate**: Tile grammar domain model, HUD inventory slots, 3-balcony spatial puzzle in East Arcade, and Sequence (Chi) alignment bridge.
- [x] **Phase 3 — Same-Door Principle & Dragon Gate**: Same-door quantum pairing model, Red Dragon twin doorways, non-Euclidean spatial warp, and Altar inspection.
- [x] **Phase 4 — Memory Reconstruction & Triad Pedestals**: Memory Sanctuary 3D scene, 3 resonance fragment pedestals, Dais of Triads, and holographic city wall reconstruction.
- [x] **Phase 5 — Discard Consequence & Passage of Broken Tiles**: Permanent tile sacrifice model (_Tedashi_), White Dragon immunity, Obsidian Canyon level, and dynamic portcullis / barrier collapse.
- [x] **Phase 6 — Dead Hand Encounter & Watcher Stealth System**: Safe discard sanctuary stealth (_Furiten_), sweeping vision searchlights, detection respawn loop, and Chombo Invalidation Gong stasis lock.
- [x] **Phase 7 — Dealer Boss Puzzle & White Tile Climax**: Rotating circular amphitheater, 4 Wind Obelisk hazard radiants, The Dealer Arbiter automaton, and White Tile premise refusal climax (_"A hand may be complete and still be wrong."_).
- [x] **Phase 8 — Polish, Audio Synthesizer & Public Release**: Zero-asset procedural Web Audio sound synthesis engine, volume sliders, accessibility preferences, 73/73 unit tests passing, full multi-phase Playwright E2E verification, and v1.0.0 release tag.
- [x] **Phase 9.1 — Gameplay Validation Gate**:
  - Reusable test helpers library in `tests/e2e/helpers/gameplayHelpers.ts`.
  - Fragility reduction in `tests/e2e/smoke.spec.ts` replacing arbitrary delays with observable DOM & state locators.
  - Regression suite `tests/e2e/save-persistence.spec.ts` (cold session reload & mid-game checkpoint restoration).
  - Regression suite `tests/e2e/discard-consequence.spec.ts` (alternate Regent sacrifice branch & White Tile protection).
  - Regression suite `tests/e2e/puzzle-gate-invalidation.spec.ts` (unbridged Sequence Gate & incomplete Same-Door pair).
  - Continuous integration requirement in `.github/workflows/ci.yml` running Playwright tests on chromium.
  - Deployment gate in `.github/workflows/deploy.yml` blocking GitHub Pages deployment unless all E2E tests pass.

## Quality Gates Status

- [x] 100% Prettier formatting compliance (`npm run format:check`)
- [x] 0 ESLint errors & 0 warnings (`npm run lint`)
- [x] 0 TypeScript compilation errors in strict mode (`npm run typecheck`)
- [x] 73 / 73 unit tests passing across 10 test suites (`npm run test`)
- [x] 7 / 7 Playwright E2E tests passing across 4 test suites (`npm run test:e2e`)
- [x] Clean production bundle in `dist/` (`npm run build`)
- [x] 0 console errors across full end-to-end 56-step gameplay smoke test

## Status

**PHASE 9.1 COMPLETED — GAMEPLAY VALIDATION GATE ENFORCED IN CI & DEPLOYMENT.**
