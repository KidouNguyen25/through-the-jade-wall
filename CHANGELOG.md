# CHANGELOG

All notable changes to **Through the Jade Wall** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
