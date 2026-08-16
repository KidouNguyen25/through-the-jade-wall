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

## 🏛 Architecture & Guidelines

- **`src/domain/`**: Pure deterministic game logic (Mahjong resolver, puzzle rules). No React / 3D dependencies.
- **`src/game/`**: 3D engine runtime, player locomotion, camera controls, collision, interaction volumes.
- **`src/world/`**: Scene definitions, puzzles, lighting, and environmental props.
- **`src/state/`**: Cross-system application state (Zustand).
- **`src/ui/`**: Responsive accessible HUD, dialogue overlays, modals.
- **`docs/adr/`**: Architecture Decision Records.

See [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) and [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) for details.

---

## 📜 License

MIT License. See [LICENSE](./LICENSE) for details.
