# Through the Jade Wall

A browser-first 3D narrative puzzle game where an Alice-like journey through an impossible city is governed by Mahjong logic.

The player explores **Jade Court**, a dream-city whose streets, memories, inhabitants, and physical laws are arranged like a never-ending Mahjong hand. Alice must reconstruct contradictory memories, manipulate spatial rules, and learn that the 144 tiles are not collectibles: they are the city's laws, identities, and fragments of truth.

---

## 🛠 Tech Stack

- **Runtime & View**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **3D Graphics**: [Three.js](https://threejs.org/) + [React Three Fiber](https://r3f.docs.pmnd.rs/) + [@react-three/drei](https://github.com/pmndrs/drei)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Quality & Tests**: [Vitest](https://vitest.dev/) (Unit), [Playwright](https://playwright.dev/) (E2E), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **Deployment**: [GitHub Pages](https://pages.github.com/) via GitHub Actions

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (Node.js 22 LTS recommended)
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/KidouNguyen25/through-the-jade-wall.git
cd through-the-jade-wall

# Install dependencies from lockfile
npm ci
```

### Local Development

```bash
# Start local dev server (default http://localhost:5173)
npm run dev
```

---

## 🧪 Quality Gates & Verification

The repository enforces strict quality gates before any release:

```bash
# Code formatting check
npm run format:check

# Auto-format files
npm run format

# Static analysis and linting
npm run lint

# TypeScript strict type checking
npm run typecheck

# Unit tests
npm run test

# End-to-end smoke tests
npm run test:e2e

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🕹 Game Mechanics & Vertical Slice

The complete **Act I: The East District** vertical slice features:

1. **Sequence Bridge (Chi)**: Aligning consecutive suit tiles (Bamboo 2-3-4) to mechanically bridge chasms in space.
2. **Same-Door Principle (Pair / Toitsu)**: Inscribing identical dragon marks to quantum-entangle distant thresholds into a singular point in space.
3. **Holographic Rebirth (Triad / Pung)**: Synthesizing contradictory memory fragments onto the Dais of Triads to reconstruct the forgotten history of the Jade Wall.
4. **Discard Consequence (Tedashi Sacrifice)**: Permanent tile sacrifices opening one branch while irrevocably collapsing the alternative route.
5. **Dead Hand Invalidation (Furiten & Chombo)**: Stealth navigation through Watcher Sentinel searchlights via safe discard zones, culminating in a ceremonial gong strike declaring an invalid hand.
6. **Refusal of the Premise (The White Tile Climax)**: Refusing the synthetic judgment of The Dealer by playing the uncarved White Tile (_Haku_), proving that _"A hand may be complete and still be wrong."_
7. **Procedural Web Audio Engine**: Zero-asset, pure browser Web Audio synthesis providing ceramic tile clicks, deep stone grinding, crystalline shimmers, metallic gongs, and ethereal climax chords.

---

## 🏛 Architecture & Guidelines

- **`src/domain/`**: Pure deterministic game logic (Mahjong resolver, puzzle rules, boss topology, stealth detection). Zero React / 3D dependencies.
- **`src/audio/`**: Pure procedural Web Audio synthesis engine.
- **`src/game/`**: 3D engine runtime, player locomotion, camera controls, collision, interaction volumes.
- **`src/world/`**: Scene definitions, 3D puzzles, procedural lighting, materials, and environmental props.
- **`src/state/`**: Cross-system reactive application state (Zustand) with versioned localStorage persistence.
- **`src/ui/`**: Responsive, accessible HUD, dialogue cards, inspection overlays, and victory climax modal.
- **`docs/adr/`**: Architecture Decision Records.

See [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) and [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) for details.

---

## 📜 License

MIT License. See [LICENSE](./LICENSE) for details.
