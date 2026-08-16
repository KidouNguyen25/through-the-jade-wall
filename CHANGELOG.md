# CHANGELOG

All notable changes to **Through the Jade Wall** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-08-16

### Added
- **Mahjong Domain Model**: Strict TypeScript types and catalog for standard Mahjong suits (Bamboo, Character, Circle, Wind, Dragon, Blank) in `src/domain/mahjong/tileTypes.ts`.
- **Pure Meld Resolver**: Deterministic pure domain resolver in `src/domain/mahjong/meldResolver.ts` validating Pairs (*Toitsu*), Triplets (*Pung*), and Sequences (*Chow*) with out-of-order normalization and strict suit matching.
- **Puzzle Socket Architecture**: Data-driven puzzle and socket evaluation engine in `src/domain/puzzle/puzzleModel.ts` mapping physical in-world sockets to pure domain logic.
- **Interactive Multi-Slot Inventory HUD**: UI tray supporting up to 4 concurrent tiles with keyboard selection (1..4 keys), click selection, and detailed lore inspection tooltip card in `App.tsx` and `App.css`.
- **East Arcade Level & Three Balconies**: 3D level in `src/world/scenes/EastArcadeScene.tsx` featuring open promenade, chasm void, antique merchant table with Bamboo 4 tile pickup, and three floating disconnected balconies.
- **Sequence Gate Mechanical Alignment**: Sequence socket pedestal in `src/world/puzzles/SequenceGate.tsx` that smoothly shifts and aligns the three balcony segments into a continuous bridge when the player completes `Sequence(Bamboo 2, 3, 4)`.
- **Comprehensive Unit Tests**: Vitest test suites covering Mahjong tile equality, meld verification, invalid meld rejection, and puzzle socket evaluation (26/26 tests passing).
- **Automated Progression E2E Test**: Playwright test suite verifying the complete multi-room player journey: Rain Alley → White Tile pickup → Tea House doorway → East Arcade transition → Bamboo 4 collection → Sequence Socket placement → Balcony alignment.

## [0.1.0] - 2026-08-16

### Added
- **Player Locomotion & Character Controller**: Third-person movement system with smooth rotation, sprinting, walk bobbing, and collision boundaries in `PlayerController.tsx`.
- **Smooth Follow Camera**: Lerped third-person camera trailing Alice with look-at dampening and accessibility support for reduced motion in `ThirdPersonCamera.tsx`.
- **Rain Alley Level & Atmosphere**: Full 3D graybox level featuring wet slate streets, boundary walls, ambient red/amber lanterns, and dynamic falling rain particle system in `RainAlleyScene.tsx`.
- **Interaction System & White Tile Mechanic**: Proximity trigger system and HUD prompts. Picking up the hovering White Tile adds it to inventory and unlocks the Tea House entrance.
- **Tea House Architectural Entrance**: Sliding wooden lattice gate with smooth unlocking animation and warm golden lantern illumination revealing the four-seat tea table interior.
- **Automated Locomotion Tests**: Unit tests for AABB collision clamping/resolution, proximity detection, and a full Playwright e2e test suite simulating player locomotion and progression.

## [0.0.1] - 2026-08-16

### Added
- **Repository Bootstrap**: Vite + React 18 + TypeScript strict mode project scaffolding.
- **3D Graphics Engine**: Three.js and React Three Fiber rendering pipeline with procedural jade tile model, pedestal, fog, and orbit controls.
- **State Management**: Zustand stores for game state transitions (`gameStore`) and accessibility/audio configuration (`settingsStore`).
- **UI Shell**: Minimalist dark tea-house aesthetic HUD, responsive controls hint bar, and system configuration modal.
- **Quality Gates**: ESLint 9 flat configuration, Prettier, TypeScript strict check, Vitest unit test suite, and Playwright e2e smoke testing.
- **CI/CD**: GitHub Actions CI workflow and GitHub Pages continuous deployment workflow.
- **Documentation**: Comprehensive README, WORKLOG, ASSET_PROVENANCE, and Architecture Decision Records (ADR 0001).
