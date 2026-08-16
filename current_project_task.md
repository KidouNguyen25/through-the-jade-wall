# CURRENT PROJECT TASK

## Active milestone

**Phase 1 — Playable locomotion**

## Objective

Deliver third-person player locomotion, collision boundaries, follow camera, interaction system, Rain Alley graybox level, White Tile pickup, and Tea House entrance unlock.

## Required outcome

- [x] Third-person player controller with WASD/arrow keys, sprint, and turning;
- [x] Boundary and obstacle collision resolution;
- [x] Smooth following camera with reduced motion accessibility support;
- [x] In-world interaction system and HUD prompt overlay;
- [x] Rain Alley 3D graybox level with rain particle system;
- [x] Hovering White Tile prop on stone pedestal;
- [x] Tea House gate with animated sliding lattice doors and interior table preview;
- [x] Unit tests for collision, interaction distance, and progression state;
- [x] Playwright e2e locomotion test verifying alley traversal, pickup, and entry.

## Acceptance criteria

- [x] Player can move smoothly through Rain Alley without jitter;
- [x] Collision prevents player from walking through walls and obstacles;
- [x] Proximity trigger reveals `[E] Pick up White Tile`;
- [x] Picking up White Tile updates inventory and triggers Tea House door unlock;
- [x] Passing through Tea House doorway triggers entrance progression;
- [x] 0 console errors during runtime and tests;
- [x] All unit and e2e tests pass;
- [x] Production build compiles with zero errors.

## Next task after completion

Phase 2 — Mahjong domain foundation:
`Tile types → sequence/pair/triplet deterministic resolver → unit tests → tile inventory HUD → East Arcade sequence gate`.
