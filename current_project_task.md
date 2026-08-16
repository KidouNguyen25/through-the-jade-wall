# CURRENT PROJECT TASK

## Active milestone

**Phase 2 — Mahjong domain foundation**

## Objective

Implement deterministic Mahjong tile domain model, sequence/pair/triplet meld resolver, unit tests, interactive tile inventory HUD, socket placement system, and an East Arcade sequence gate where completing `Bamboo 2 + 3 + 4` aligns three disconnected balconies into a bridge.

## Required outcome

- [x] Mahjong tile domain types & catalog (`src/domain/mahjong/tileTypes.ts`);
- [x] Deterministic pure meld resolver (`src/domain/mahjong/meldResolver.ts`);
- [x] Comprehensive unit tests for all meld types and edge cases (`src/test/mahjong.test.ts`);
- [x] Puzzle socket model and evaluation logic (`src/domain/puzzle/puzzleModel.ts`);
- [x] Interactive tile inventory tray in HUD with selection and placement (`src/app/App.tsx`, `src/app/App.css`);
- [x] East Arcade 3D scene with Three Balconies and Sequence Gate sockets (`src/world/scenes/EastArcadeScene.tsx`, `src/world/puzzles/SequenceGate.tsx`);
- [x] Dynamic spatial alignment animation when sequence condition is met;
- [x] Automated Playwright e2e test verifying Mahjong sequence resolution and balcony bridge alignment.

## Acceptance criteria

- [x] `resolveMeld` correctly identifies sequences, pairs, triplets, and rejects invalid combinations;
- [x] Unit test coverage for pure domain logic is 100%;
- [x] Player can collect Bamboo 4 tile in East Arcade;
- [x] Player can inspect inventory and select tiles to place into puzzle sockets;
- [x] Placing Bamboo 4 into the third socket completes `Sequence(Bamboo 2, 3, 4)`;
- [x] Balcony sections align smoothly upon puzzle resolution;
- [x] 0 console errors during runtime, build, and tests;
- [x] All quality gates pass (`format`, `lint`, `typecheck`, `test`, `build`, `test:e2e`).

## Next task after completion

Phase 3 — First impossible-space puzzle:
`Balcony traversal → "same door" pair traversal → visual feedback → hint layers`.
