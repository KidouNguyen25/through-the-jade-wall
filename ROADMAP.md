# ROADMAP

## Phase 0 — Industrial bootstrap

Goal: reproducible repository.

Deliver:

- Vite + React + TypeScript project;
- R3F canvas;
- lint/format/typecheck/tests;
- Playwright skeleton;
- CI;
- Pages deployment;
- Git standards;
- placeholder README;
- work log;
- first ADR.

Exit:
A blank but verified 3D application deploys to GitHub Pages.

## Phase 1 — Playable locomotion

Deliver:

- third-person player;
- collision floor/walls;
- camera;
- interaction system;
- pause/settings basics;
- Rain Alley + Tea House graybox.

Exit:
Player can reach and interact with the white tile without console errors.

## Phase 2 — Mahjong domain foundation

Deliver:

- tile types;
- sequence/pair/triplet resolver;
- unit tests;
- tile inventory;
- socket/placement system.

Exit:
East Arcade sequence gate works using domain resolver, not scene-specific hacks.

## Phase 3 — First impossible-space puzzle

Deliver:

- balcony alignment;
- "same door" pair traversal;
- visual feedback;
- hint layers.

Exit:
Player learns that Mahjong relationships modify space.

## Phase 4 — Narrative state

Deliver:

- dialogue presentation;
- memory fragments;
- reconstruction scene;
- narrative flags;
- save schema v1.

Exit:
Player completes first memory reconstruction and reload preserves state.

## Phase 5 — Discard consequence

Deliver:

- irreversible current-run discard;
- consequence propagation;
- checkpoint;
- altered dialogue/reconstruction.

Exit:
Different discard choice produces a clearly different later interpretation.

## Phase 6 — Dead Hand

Deliver:

- one rule-based hostile encounter;
- telegraphing;
- failure/reset;
- no conventional damage-sponge combat.

Exit:
Player defeats/invalidates enemy by understanding its tile rule.

## Phase 7 — Dealer boss puzzle

Deliver:

- arena;
- Wind topology changes;
- discard prediction;
- hidden "refuse premise" solution;
- vertical-slice ending.

Exit:
20–30 minute slice complete end-to-end.

## Phase 8 — Polish and public release

Deliver:

- original art pass;
- audio;
- accessibility;
- performance profiling;
- browser compatibility pass;
- save robustness;
- onboarding;
- trailer/screenshots;
- release tag.

Exit:
Public Pages build is stable enough to put in portfolio.

## Full-game future

Only after vertical slice validates the game:

- South District;
- West District;
- North District;
- Vermilion Regent;
- Echo mechanic;
- deeper Mahjong rules;
- multiple endings.
