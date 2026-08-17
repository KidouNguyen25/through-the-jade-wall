# ADR 0002 — Runtime State Boundary & Render Churn Elimination

Status: Accepted

## Context

During initial vertical-slice development, high-frequency player movement and camera transform coordinates were stored in the global Zustand store (`playerPosition: [x, y, z]`). Updating global Zustand state every frame triggered widespread React rerenders across scene components, interactables, HUD elements, and root layouts, degrading rendering performance and introducing garbage allocation churn.

The game requires:

- 60+ FPS locomotion and camera following without React/Zustand render thrashing;
- Zero object allocations per frame in movement, camera tracking, and proximity checking;
- Clean state separation: durable domain progression vs transient runtime transform state;
- Reliable scene transitions, portal warps, checkpoint respawns, and save/load persistence.

## Decision

1. **Engine-Local Runtime Layer (`src/game/runtime/playerRuntime.ts`)**:
   - Store high-frequency player transform (`x, y, z`, `rotation`, `isMoving`) in mutable module-scoped structs.
   - `PlayerController` updates this runtime state in `useFrame` with 0 React updates.
   - `ThirdPersonCamera`, `Interactable`, and AI sentinels query `playerRuntime` directly in `useFrame`.
   - Provide `onPlayerRuntimeSync` listener for deterministic synchronization upon scene transitions, teleports, respawns, or save loads.

2. **Durable vs Runtime Boundary**:
   - Durable store (`gameStore.ts`) retains only discrete domain state: `currentScene`, `checkpoint`, `inventoryTiles`, `placedTiles`, `memoryFragmentsCollected`, and puzzle flags.
   - Position snapshotting (`takePlayerPositionSnapshot()`) captures current coordinates during `saveGame()`.

3. **Transition-Based Prompt Publishing**:
   - Proximity evaluation in `Interactable` runs inside `useFrame` via `playerRuntime`.
   - Active interaction prompt is published to Zustand ONLY on range entry/exit edges or semantic prompt text changes.

4. **Modular UI with Narrow Selectors & Typed Scene Registry**:
   - HUD and overlays split into specialized components with atomic selectors (`state => state.field`).
   - Scene mounting managed via typed `SCENE_REGISTRY` mapping in `src/world/scenes/sceneRegistry.ts`.

## Consequences

Positive:

- Per-frame Zustand updates and React rerender churn eliminated (0 renders during locomotion).
- Per-frame memory allocations reduced to 0 in camera and player runtime.
- Full backwards compatibility with existing save schema and Playwright E2E suites.
- Clean architectural boundaries for Phase 9.3+ Mahjong puzzle expansion.

Negative:

- Components requiring player position inside Three.js frame loop must query `getPlayerRuntimePosition()` instead of subscribing via `useGameStore`.
