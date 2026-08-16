# ADR 0001 — Browser-first React Three Fiber architecture

Status: Accepted

## Context

The project is a portfolio-oriented 3D narrative puzzle game intended to be directly playable from a URL and hosted initially on GitHub Pages.

The game needs:

- WebGL/WebGPU-capable browser rendering through Three.js;
- fast UI iteration;
- TypeScript;
- a clean boundary between gameplay domain logic and scene presentation;
- static hosting for the vertical slice.

## Decision

Use:

- Vite;
- React;
- TypeScript;
- Three.js;
- React Three Fiber;
- Rapier;
- Zustand;
- IndexedDB;
- GitHub Pages.

No runtime backend is required for the vertical slice.

## Consequences

Positive:

- static deploy;
- portfolio-friendly URL;
- componentized UI;
- broad Three.js ecosystem;
- testable TypeScript domain logic.

Negative:

- browser memory/performance budget matters;
- asset size must be controlled;
- advanced native-engine tooling is unavailable;
- large-world architecture would be inappropriate.

## Revisit when

- a validated feature requires server-authoritative state;
- static hosting becomes a blocker;
- renderer limitations are demonstrated by profiling rather than assumed.
