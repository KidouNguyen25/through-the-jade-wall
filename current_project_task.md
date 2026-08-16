# CURRENT PROJECT TASK

## Active milestone

**Phase 0 — Industrial bootstrap**

## Objective

Create the initial production repository and make a verified blank 3D build deployable through GitHub Pages.

## Required outcome

- [x] repository initialized;
- [x] Vite + React + TypeScript;
- [x] Three.js + React Three Fiber;
- [x] basic full-screen scene rendering;
- [x] ESLint;
- [x] Prettier;
- [x] TypeScript strict mode;
- [x] Vitest;
- [x] Playwright smoke-test scaffold;
- [x] CI;
- [x] GitHub Pages deploy workflow;
- [x] README run/build/test instructions;
- [x] `WORKLOG.md`;
- [x] `CHANGELOG.md`;
- [x] `ASSET_PROVENANCE.md`;
- [x] first ADR confirming browser-first architecture.

## Acceptance criteria

- [x] clean install from lockfile succeeds;
- [x] format check passes;
- [x] lint passes;
- [x] typecheck passes;
- [x] unit tests pass;
- [x] production build passes;
- [x] local application renders a basic 3D scene;
- [x] no production console errors;
- [x] CI workflow is committed;
- [x] Pages workflow is committed;
- [x] if authenticated GitHub tooling exists, remote repo is created and pushed;
- [x] if remote supports it, `main` protection/ruleset is applied;
- [x] remote/deployment status is truthfully recorded.

## Scope exclusions

Do not implement player movement, Mahjong rules, dialogue, or final art in this task.

## Next task after completion

Phase 1 thin slice:
`Rain Alley → movement → interaction → pick up White Tile → Tea House door opens`.
