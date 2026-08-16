# TECHNICAL ARCHITECTURE

## Goal

A maintainable, browser-first 3D game architecture that allows AI agents to work safely without turning scene components into a monolith.

## Stack

- TypeScript
- React
- Vite
- Three.js
- React Three Fiber
- Drei
- Rapier
- Zustand
- Vitest
- Playwright
- ESLint
- Prettier
- IndexedDB wrapper
- GitHub Actions
- GitHub Pages

Use stable, mutually compatible package versions at repository initialization time and commit the lockfile.

## Proposed source tree

```text
src/
  app/
    App.tsx
    routes/
  game/
    GameRoot.tsx
    loop/
    input/
    camera/
    player/
    interaction/
  domain/
    mahjong/
    puzzle/
    memory/
    narrative/
    save/
  world/
    scenes/
    prefabs/
    puzzles/
    encounters/
  state/
    gameStore.ts
    settingsStore.ts
  ui/
    hud/
    menus/
    dialogue/
    accessibility/
  audio/
  assets/
    manifests/
  shaders/
  lib/
  test/
```

## Layer rules

### `domain/`

Pure logic whenever possible.
Must not import React Three Fiber.
Best target for unit testing.

### `game/`

Reusable runtime systems:

- movement;
- input;
- interaction;
- camera.

### `world/`

Authored game content and composition.

### `state/`

Cross-system durable application state.
Avoid stuffing transient Three.js vectors into global state.

### `ui/`

HTML/CSS overlay interfaces.

## State boundaries

Domain state:

- owned tiles;
- puzzle resolution;
- narrative flags;
- memory/discard state.

Presentation state:

- menu open;
- selected inventory slot;
- subtitle visibility.

Frame-local state:

- camera vectors;
- interpolated transform;
- raycast scratch objects.

Frame-local state should use refs or engine-local structures, not React re-renders each frame.

## Performance rules

- Avoid allocating objects every frame.
- Reuse vectors/quaternions.
- Dispose geometries/materials/textures when dynamically replaced.
- Prefer instancing for repeated static props.
- Use compressed web-friendly assets where practical.
- Keep texture dimensions intentional.
- Lazy-load later areas.
- Do not bundle unused raw source assets.
- Monitor draw calls and loaded asset size.
- Pause or reduce work when page is not active where safe.

## Scene transitions

Use a scene/level registry.
A scene exposes:

- id;
- preload requirements;
- entry checkpoint;
- component;
- optional cleanup hooks.

Do not create one enormous conditional `Game.tsx`.

## Puzzle architecture

A puzzle definition contains:

- id;
- inputs/sockets;
- condition;
- resolved state;
- world actions;
- narrative actions;
- persistence key.

Resolution must be deterministic and serializable.

## Save architecture

- versioned schema;
- IndexedDB persistence;
- minimal serialized domain state;
- no serialization of Three.js objects.

## Asset strategy

Vertical slice can start with:

- procedural primitive geometry;
- original low-poly assets;
- CC0/public-domain assets with documented provenance.

Maintain `ASSET_PROVENANCE.md`.

Never commit copyrighted commercial game assets.

## Error handling

- Boundary around major UI surfaces.
- Fail gracefully when optional audio/assets fail.
- Loading errors must be visible in development.
- No swallowed promises.

## Deployment

GitHub Pages deployment through a custom GitHub Actions workflow.
The Vite base path must work for repository Pages URLs.
Use Actions for build/test/deploy; do not use Actions as a runtime backend.

## Architecture change rule

Any replacement of the renderer, physics engine, persistence model, or state architecture requires an ADR under `docs/adr/`.
