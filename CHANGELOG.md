# CHANGELOG

All notable changes to **Through the Jade Wall** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-16

### Added

- **Procedural Web Audio Engine**: Zero-asset, fully procedural browser audio synthesizer in `src/audio/audioEngine.ts` utilizing the Web Audio API to produce real-time ceramic tile clacks, stone mechanism rumblings, crystalline holographic shimmers, metallic invalidation gongs, and ethereal climax fanfare chords.
- **Audio & Accessibility Integration**: Master and SFX volume sliders seamlessly integrated into the Settings modal; high contrast indicator and reduced motion preferences fully respected across all 3D scene shaders and physics loops.
- **Complete Act I Vertical Slice**: Finished all 8 phases of the development roadmap representing a complete 20–30 minute narrative 3D puzzle experience from the rainy alleys of Jade Court to the circular amphitheater of The Dealer.
- **Unit Test Coverage & Quality Gates**: 73/73 unit tests passing across 10 test suites; 100% Prettier formatting, ESLint 9 compliance, TypeScript strict checking, clean production bundle, and full end-to-end Playwright smoke test passing with 0 console errors.

## [0.7.0] - 2026-08-16

### Added

- **Dealer Boss Domain Model & Wind Topology Engine**: Pure deterministic domain logic in `src/domain/boss/dealerBossModel.ts` implementing Wind quadrant sectors (East, South, West, North), dynamic arena floor rotation calculations, hazard zone detection, and White Tile interruption resolution.
- **Seat of the Dealer 3D Scene**: Massive circular amphitheater level in `src/world/scenes/BossCourtScene.tsx` featuring the towering Dealer Arbiter automaton figure, four elemental Wind Obelisks, rotating jade arena floor rings, dynamic danger shields, and the Central Tribunal Anchor Dais.
- **Wind Rotation Battle Progression**: Scripted Wind declaration sequence where the Dealer discards Winds (East Ton, South Nan) dynamically re-orienting the arena floor and hazard radiants before declaring the Final Hand (Ron).
- **The Secret Third Solution — White Tile Interruption**: Place the unclassified Blank Tile on the Tribunal Anchor to refuse the false indictment premise, shatter the Dealer's synthetic pair, and complete the vertical slice with the iconic revelation: _"A hand may be complete and still be wrong."_
- **Vertical Slice Complete Victory Modal**: Celebratory end-game interface displaying journey completion milestones, philosophical resolution, and options to continue exploring or restart.
- **Quality Gates & Test Coverage**: 67/67 unit tests passing across 9 test suites; comprehensive multi-phase Playwright E2E test verifying complete player journey from Rain Alley through Balcony Bridge, Portal Gate, Memory Sanctuary, Discard Canyon, Watcher Courtyard, Dealer's Court, and Victory Climax with 0 console errors.

## [0.6.0] - 2026-08-16

### Added

- **Dead Hand Domain Model & Stealth Detection**: Pure deterministic domain logic in `src/domain/deadhand/deadHandModel.ts` implementing cone-based field-of-view scanning, safe discard sanctuary protection (_Furiten_), and Chombo invalidation mechanics.
- **Courtyard of the Watchers 3D Scene**: Atmospheric nighttime stronghold courtyard in `src/world/scenes/DeadHandScene.tsx` featuring twin Watcher Sentinel automatons with sweeping vision spotlights, safe discard trenches, central Invalidation Gong dais, and North Boss Gateway.
- **Watcher AI & Detection System**: Sweeping dynamic spotlight searchlights with volumetric vision cones, safe zone stealth flanking, and alert-state failure loops repositioning caught players with immersive narrative dialogue.
- **Chombo Invalidation Ritual**: Strike the central White Tile Gong to declare a Dead Hand, permanently locking the mechanical sentinels in stasis and opening the North Gateway to the Dealer's Court.
- **SaveSchema v1 Dead Hand Tracking**: Extended `SaveStateV1` schema with `deadHandInvalidated`, `bossCourtUnlocked`, and `'dead_hand'` scene persistence.
- **Quality Gates & Test Coverage**: 54/54 unit tests passing across 8 test suites; Playwright E2E test verifying complete multi-phase player journey from Rain Alley through Balcony Bridge, Portal Gate, Memory Sanctuary, Discard Passage, Watcher Courtyard, and Chombo Invalidation with 0 console errors.

## [0.5.0] - 2026-08-16

### Added

- **Discard Domain Model & Sacrifice Mechanics**: Pure deterministic discard evaluation in `src/domain/discard/discardModel.ts` validating permanent tile sacrifices (_Tedashi_) with permanent White Dragon immunity/protection.
- **Passage of Broken Tiles 3D Scene**: Obsidian canyon level in `src/world/scenes/DiscardPassageScene.tsx` featuring the Reliquary of Lost Discards offering table, West Archivist Stone Furnace, East Regent Brazen Brazier, and North Threshold archway.
- **Dynamic Spatial Gate Collapse**: Real-time physical portcullis animations and barrier state transitions where unlocking one path permanently collapses the opposite route into impassable rubble.
- **Narrative Consequence Branching**: Rich branching lore dialogue trees (`DISCARD_PASSAGE_ENTRY_TREE`, `DISCARD_ARCHIVIST_CONSEQUENCE_TREE`, `DISCARD_REGENT_CONSEQUENCE_TREE`, `DISCARD_WHITE_TILE_REJECTED_TREE`) in `src/domain/narrative/dialogueData.ts`.
- **SaveSchema v1 Discard Tracking**: Extended `SaveStateV1` schema with `sacrificedTile`, `discardPassageChoice`, `discardPassageResolved`, `westPathOpen`, and `eastPathOpen` persistence.
- **Unit & End-to-End Test Verification**: 47/47 unit tests passing across 7 test suites; Playwright E2E test verifying complete multi-phase player journey from Rain Alley through East Arcade, Memory Sanctuary, and Discard Passage with 0 console errors.

## [0.4.0] - 2026-08-16

### Added

- **Narrative State & Dialogue Engine**: Comprehensive branching dialogue tree model in `src/domain/narrative/narrativeTypes.ts` with dialogue choice branching, speaker tags, narrative flag persistence, and rich lore trees (`MEMORY_ROOM_ENTRY_TREE`, `FRAGMENT_EAST_GATE_TREE`, `FRAGMENT_MIDNIGHT_BELL_TREE`, `FRAGMENT_CAPTAIN_SEAL_TREE`, `MEMORY_RECONSTRUCTED_TREE`).
- **SaveSchema v1 & LocalStorage Persistence**: Deterministic save/load system with schema versioning (`SaveStateV1`), backward compatibility migration pipeline, and JSON serialization in `src/domain/save/saveSchema.ts`.
- **Memory Sanctuary 3D Level**: Octagonal chamber scene in `src/world/scenes/MemoryRoomScene.tsx` featuring central Dais Projector Table, North Altar archivist wall, and 3 memory crystal pedestals (East Gate, Midnight Bell, Captain's Seal).
- **Holographic Reconstruction Climax**: 3D wireframe rotating city hologram projection, Keeper Echo silhouette, and light beams appearing upon recovering all 3 memory fragments.
- **Narrative HUD Overlay & Choice Picker**: Interactive dialogue presentation modal with keyboard and click choice selection, typewriter speaker tags, and dynamic Memory Fragment collection counters.
- **Quality Gates & Test Coverage**: 38/38 unit tests passing across 6 test suites; Playwright E2E test verifying complete multi-phase player journey from Rain Alley through Balcony Bridge, Portal Gate, and Memory Sanctuary Hologram Reconstruction.

### Added

- **Impossible Space & Same Door Mechanics**: Non-Euclidean portal traversal connecting spatially distant archways (Doorway Alpha at `[3.5, 0, -10.0]` and Doorway Beta at `[-3.5, 0, -15.0]`) when paired with matching Red Dragon tiles.
- **Portal Screen Effect & 3D Shimmer**: Radial screen flash warp shader in `App.css` and animated double-sided portal mist plane in `SameDoorGate.tsx`.
- **Upper Terrace Level Extension**: Expanded East Arcade bounds to `z = -20.0`, high observation tower platform, and Central Shrine Altar pedestal.
- **3-Tier Progressive Guidance System**: Layer 1 (Environmental Observation), Layer 2 (Mahjong Space Principle), and Layer 3 (Explicit Actionable Solution) accessible via `H` key or header HUD button.
- **Expanded Mahjong Catalog**: Added Red Dragon (_Chun_), Green Dragon (_Hatsu_), White Dragon (_Haku_), and Wind suits.
- **Domain Gate & Physics Sync**: Instant player position teleportation synchronization in `PlayerController.tsx` with dynamic chasm obstacle collision gating.
- **Phase 3 Test Suites**: Unit tests for Pair resolution and portal traversal in `puzzle.test.ts` and `locomotion.test.ts` (30/30 tests passing); full-flow Playwright E2E test in `smoke.spec.ts`.

## [0.2.0] - 2026-08-16

### Added

- **Mahjong Domain Model**: Strict TypeScript types and catalog for standard Mahjong suits (Bamboo, Character, Circle, Wind, Dragon, Blank) in `src/domain/mahjong/tileTypes.ts`.
- **Pure Meld Resolver**: Deterministic pure domain resolver in `src/domain/mahjong/meldResolver.ts` validating Pairs (_Toitsu_), Triplets (_Pung_), and Sequences (_Chow_) with out-of-order normalization and strict suit matching.
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
