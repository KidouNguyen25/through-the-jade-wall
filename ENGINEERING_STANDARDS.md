# ENGINEERING STANDARDS

## General

Code for the next engineer, not only for the current task.

## TypeScript

- `strict` mode.
- Avoid `any`; use `unknown` plus narrowing when external data is uncertain.
- Public domain types belong near the domain module.
- Prefer discriminated unions for state machines.
- Functions that implement game rules should be deterministic where possible.
- Never hide invalid state behind non-null assertions without justification.

## React

- Components should compose presentation and runtime systems, not contain entire game rules.
- Avoid broad global contexts when Zustand/local state is clearer.
- Do not trigger React state updates every animation frame.
- Side effects need explicit cleanup.

## Three.js / React Three Fiber

- Reuse temporary math objects in update loops.
- Dispose manually created replaceable resources.
- Do not create new geometry/material objects on every render.
- Keep physics and render transforms synchronized through an explicit ownership model.
- Avoid invisible high-poly geometry for collision when primitives suffice.

## Naming

- Components: PascalCase.
- Hooks: `useX`.
- Domain functions: verbs that describe outcome.
- Boolean names: `is`, `has`, `can`, `should`.
- IDs must be stable and human-readable.

## File size heuristic

A file becoming difficult to review is a design signal.
Split by responsibility, not arbitrary line counts.

## Comments

Explain:

- why;
- invariant;
- non-obvious performance constraint;
- historical compatibility reason.

Do not narrate obvious syntax.

## Tests

Pure game rules require unit tests.
Bug fixes should add a regression test where practical.

## Logging

Development logging is allowed behind a clear dev mechanism.
No noisy production console output.
No secrets.

## Dependency policy

Before adding a dependency:

1. verify it solves a real problem;
2. check whether current stack already provides the capability;
3. prefer small, maintained dependencies;
4. avoid overlapping libraries;
5. commit lockfile changes.

## Security

- no secrets in client code;
- no privileged tokens in GitHub Pages;
- minimize GitHub Actions `permissions`;
- third-party Actions should be pinned immutably when practical;
- do not execute untrusted downloaded scripts blindly.

## Accessibility

UI changes must preserve:

- readable text;
- keyboard operation for menus;
- focus visibility;
- subtitle support;
- reduced motion options where relevant.

## Documentation

If behavior changes:

- update relevant docs in same PR.
  If architecture changes:
- add ADR.
  If player-visible:
- update changelog.

## No fake completion

Temporary placeholder art is acceptable.
Fake tests, hard-coded "success" responses, or skipped quality gates presented as completion are not.
