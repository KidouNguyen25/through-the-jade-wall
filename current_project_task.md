# CURRENT PROJECT TASK

## Active milestone

**Phase 6 — Dead Hand (Watcher Pair Encounter & Detection System)**

## Objective

Implement the Watcher's Courtyard level (`dead_hand_encounter`), rule-based hostile automaton sentinels (Watcher Alpha & Beta), telegraphing scanning cones, safe tile zone mechanics (Furiten / Discard sanctuary), non-combat detection/reset loop, and the Dead Hand Invalidation Gong mechanism that freezes the sentinels and unlocks the Dealer's Boss Court.

## Required outcome

- [ ] Dead Hand encounter domain model & detection logic (`src/domain/deadhand/deadHandModel.ts`);
- [ ] Save schema v1 update for Dead Hand state and Watchers disabled flag (`src/domain/save/saveSchema.ts`);
- [ ] Watcher dialogue and narrative reaction trees (`src/domain/narrative/dialogueData.ts`);
- [ ] 3D Dead Hand Courtyard scene (`src/world/scenes/DeadHandScene.tsx`) with patrolling Watcher automata, sweeping light cones, safe floor tiles, and central Invalidation Gong;
- [ ] Real-time detection raycasting/distance checks in `DeadHandScene.tsx` with smooth respawn at entrance checkpoint upon detection;
- [ ] Dead Hand Invalidation sequence (Watchers freeze in stasis, glowing eyes turn gray, grand gates open to Phase 7);
- [ ] Unit tests for stealth detection rules, safe tile evaluation, and invalidation in `src/test/deadhand.test.ts`;
- [ ] Playwright E2E test verifying end-to-end traversal from Discard Passage into Watcher Courtyard, navigating past scanning cones, activating the Invalidation Gong, and unsealing the Boss Court.

## Acceptance criteria

- [ ] Watchers patrol with visible telegraphing light cones;
- [ ] Standing on safe discard tile zones prevents detection;
- [ ] Detection cleanly teleports player to courtyard entrance without console errors;
- [ ] Activating the Invalidation Gong disables both Watchers and opens the Boss Gate;
- [ ] 100% unit test pass rate;
- [ ] 0 console errors during runtime, build, and tests;
- [ ] All quality gates pass (`format`, `lint`, `typecheck`, `test`, `build`, `test:e2e`).

## Next task after completion

Phase 7 — Dealer Boss Puzzle (Rotating Circular Court & White Tile Interruption).
