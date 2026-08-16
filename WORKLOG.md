# WORKLOG

## 2026-08-16 — Phase 1: Playable Locomotion & Rain Alley Slice

- **Task**: Active Milestone: Phase 1 — Playable locomotion (`current_project_task.md`).
- **Branch**: `feat/locomotion-rain-alley`
- **Actions Taken**:
  1. Created feature branch `feat/locomotion-rain-alley`.
  2. Implemented keyboard input system in `src/game/input/useInput.ts`.
  3. Created original procedural character model (Alice silhouette) and third-person controller with AABB obstacle/boundary collision handling in `src/game/player/PlayerController.tsx`.
  4. Created smooth lerped follow camera with reduced-motion support in `src/game/camera/ThirdPersonCamera.tsx`.
  5. Implemented domain interaction calculations and in-world trigger components in `src/domain/interaction/interactionModel.ts` and `src/game/interaction/Interactable.tsx`.
  6. Built Rain Alley level in `src/world/scenes/RainAlleyScene.tsx` with wet cobblestone street, street lanterns, rain particle system, hovering White Tile on stone pedestal, and animated Tea House sliding lattice gate.
  7. Updated HUD overlay with interaction prompt badges, inventory slots (showing White Tile), and narrative progression messages.
  8. Added unit test suite in `src/test/locomotion.test.ts` covering bounds clamping, box collisions, interaction range checks, and progression state transitions.
  9. Created automated Playwright e2e test in `tests/e2e/smoke.spec.ts` walking player down Rain Alley, collecting the White Tile, and entering the Tea House.
- **Quality Gates Results**:
  - `npm run format:check`: PASSED (0 issues)
  - `npm run lint`: PASSED (0 errors, 0 warnings)
  - `npm run typecheck`: PASSED (0 errors)
  - `npm run test`: PASSED (12 / 12 unit tests passed in 2.2s)
  - `npm run build`: PASSED (Production bundle in `dist/`)
  - `npm run test:e2e`: PASSED (Playwright e2e locomotion test in Chromium browser, 0 console errors)

---

## 2026-08-16 — Phase 0: Industrial Bootstrap

- **Task**: Active Milestone: Phase 0 — Industrial Bootstrap (`current_project_task.md`).
- **Starting State**: Empty workspace with AI devkit documentation.
- **Actions Taken**:
  1. Initialized Git repository on `main` branch.
  2. Setup complete project skeleton in accordance with `TECHNICAL_ARCHITECTURE.md`.
  3. Configured Vite + React 18 + TypeScript in strict mode.
  4. Integrated Three.js + React Three Fiber + Drei for 3D canvas rendering with procedural Jade Tile and Pedestal.
  5. Configured Zustand domain state (`gameStore`) and accessibility settings (`settingsStore`).
  6. Configured ESLint (flat config), Prettier, TypeScript strict checking, Vitest unit test suite, and Playwright e2e smoke tests.
  7. Created GitHub Actions workflows: CI (`ci.yml`) and Pages deployment (`deploy.yml`).
  8. Configured `base: './'` for seamless relative asset hosting on GitHub Pages.
  9. Documented ADR 0001 status as Accepted.
  10. Created remote GitHub repository `KidouNguyen25/through-the-jade-wall` via GitHub CLI (`gh repo create`).
  11. Sent admin collaboration invitation to `kidouhayadev`.
- **Quality Gates Results**:
  - `npm run format:check`: PASSED (All matched files use Prettier code style)
  - `npm run lint`: PASSED (0 errors, 0 warnings)
  - `npm run typecheck`: PASSED (0 errors)
  - `npm run test`: PASSED (5/5 unit tests passed)
  - `npm run build`: PASSED (Production bundle built in `dist/`)
  - `npm run test:e2e`: PASSED (Playwright smoke test passed in Chromium browser, 0 console errors)
- **Commit**: `chore(bootstrap): initialize repository and Phase 0 industrial skeleton` (`263661f`)
- **Remote / Deployment Status**:
  - Remote GitHub repository created: `https://github.com/KidouNguyen25/through-the-jade-wall`
  - Push status: Ready locally.
