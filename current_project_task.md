# CURRENT PROJECT TASK

## Active milestone

**Phase 9.2 — Runtime State Boundary & Render Churn Elimination**

## Objective

Refactor the vertical-slice runtime so frame-local player movement and camera state stay entirely inside the engine-local runtime layer, eliminating per-frame React/Zustand updates and render thrashing. Decouple high-frequency transforms from durable domain progression, modularize HUD components with narrow selectors, implement a typed scene registry, and verify 100% clean passes on all unit tests, Playwright E2E suites, and build gates.

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
  - Regression suites for save persistence, branching discard consequences, and spatial gate invalidation.
  - CI and GitHub Pages deployment gating.
- [x] **Phase 9.2 — Runtime State Boundary & Render Churn Elimination**:
  - Engine-local player runtime state manager in `src/game/runtime/playerRuntime.ts` storing frame-local `x, y, z`, `rotation`, and `isMoving` with zero per-frame React/Zustand publications and zero object allocations.
  - Subscribed `PlayerController` and `ThirdPersonCamera` to `playerRuntime`, eliminating per-frame React state churn.
  - Refactored `Interactable` to query `playerRuntime` in `useFrame` and publish active prompt to Zustand only on range entry/exit edges or semantic prompt text changes.
  - Created typed scene registry in `src/world/scenes/sceneRegistry.ts` replacing nested ternaries in `GameRoot.tsx`.
  - Extracted modular UI components in `src/ui/hud/`, `src/ui/dialogue/`, and `src/ui/modals/` with atomic Zustand selectors.
  - Added unit test suite `src/test/runtimeBoundary.test.ts` (8/8 tests passing).
  - Authored Architectural Decision Record `docs/adr/0002-runtime-state-boundary.md`.
  - Verified 100% clean passes across unit test suite (81/81) and Playwright E2E suites (7/7).

## Quality Gates Status

- [x] 100% Prettier formatting compliance (`npm run format:check`)
- [x] 0 ESLint errors & 0 warnings (`npm run lint`)
- [x] 0 TypeScript compilation errors in strict mode (`npm run typecheck`)
- [x] 81 / 81 unit tests passing across 11 test suites (`npm run test`)
- [x] 7 / 7 Playwright E2E tests passing across 4 test suites (`npm run test:e2e`)
- [x] Clean production bundle in `dist/` (`npm run build`)
- [x] 0 console errors across full end-to-end 56-step gameplay smoke test

## Next Ready Task

**Phase 9.3 — Mahjong Puzzle Grammar** (Pending user directive to begin).

## Status

**PHASE 9.2 COMPLETED — ARCHITECTURAL STATE BOUNDARIES ENFORCED & ZERO RENDER CHURN VERIFIED.**
