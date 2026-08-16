# CURRENT PROJECT TASK

## Active milestone

**Phase 0 — Industrial bootstrap**

## Objective

Create the initial production repository and make a verified blank 3D build deployable through GitHub Pages.

## Required outcome

- repository initialized;
- Vite + React + TypeScript;
- Three.js + React Three Fiber;
- basic full-screen scene rendering;
- ESLint;
- Prettier;
- TypeScript strict mode;
- Vitest;
- Playwright smoke-test scaffold;
- CI;
- GitHub Pages deploy workflow;
- README run/build/test instructions;
- `WORKLOG.md`;
- `CHANGELOG.md`;
- `ASSET_PROVENANCE.md`;
- first ADR confirming browser-first architecture.

## Acceptance criteria

- [ ] clean install from lockfile succeeds;
- [ ] format check passes;
- [ ] lint passes;
- [ ] typecheck passes;
- [ ] unit tests pass;
- [ ] production build passes;
- [ ] local application renders a basic 3D scene;
- [ ] no production console errors;
- [ ] CI workflow is committed;
- [ ] Pages workflow is committed;
- [ ] if authenticated GitHub tooling exists, remote repo is created and pushed;
- [ ] if remote supports it, `main` protection/ruleset is applied;
- [ ] remote/deployment status is truthfully recorded.

## Scope exclusions

Do not implement player movement, Mahjong rules, dialogue, or final art in this task.

## Next task after completion

Phase 1 thin slice:
`Rain Alley → movement → interaction → pick up White Tile → Tea House door opens`.
