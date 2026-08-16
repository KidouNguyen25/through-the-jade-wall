# CURRENT PROJECT TASK

## Active milestone

**Phase 5 — Discard Consequence (Discard Passage & Permanent Sacrifice Mechanic)**

## Objective

Implement the Discard Passage level (`discard_passage`), irreversible current-run discard domain mechanics, sacrificial altar sockets (Archivist Furnace vs. Regent Brazier), spatial gate collapse/opening propagation, branching narrative consequences based on sacrificed tile, and save state persistence.

## Required outcome

- [ ] Discard domain logic & consequence model (`src/domain/discard/discardModel.ts`);
- [ ] Save schema v1 update for sacrificed tile history and passage state (`src/domain/save/saveSchema.ts`);
- [ ] Branching discard dialogue trees in `src/domain/narrative/dialogueData.ts`;
- [ ] 3D Discard Passage scene (`src/world/scenes/DiscardPassageScene.tsx`) with obsidian canyon, central bifurcation dais, West Archivist Furnace, and East Regent Brazier;
- [ ] Dynamic physical gate animations (unlocked path drops its portcullis while the other path collapses into permanent rubble);
- [ ] HUD discard confirmation modal and feedback;
- [ ] Unit tests for discard mechanics and consequence propagation in `src/test/discard.test.ts`;
- [ ] Playwright E2E test verifying end-to-end traversal from Memory Sanctuary to Discard Passage, sacrificing a tile, observing irreversible spatial consequence, and unlocking the path to Phase 6.

## Acceptance criteria

- [ ] Player can carry tiles from previous phases and inspect discard mechanics;
- [ ] White Tile is protected from sacrificial discard with unique lore feedback;
- [ ] Discarding a tile permanently removes it from inventory and opens the corresponding path while collapsing the alternate path;
- [ ] Narrative flags and save state accurately reflect the chosen sacrifice;
- [ ] 100% unit test pass rate;
- [ ] 0 console errors during runtime, build, and tests;
- [ ] All quality gates pass (`format`, `lint`, `typecheck`, `test`, `build`, `test:e2e`).

## Next task after completion

Phase 6 — Dead Hand (Watcher Pair Encounter & Detection System).
