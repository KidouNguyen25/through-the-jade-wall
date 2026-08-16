# GAMEPLAY SYSTEMS

## 1. Movement and camera

Baseline:

- third-person;
- WASD;
- mouse orbit;
- interact key;
- inspect focus;
- sprint optional, but puzzle spaces must not require precision platforming.

Implementation priority:

1. reliable movement;
2. collision;
3. camera obstruction handling;
4. interaction ray/volume;
5. animation polish.

## 2. Tile system

### Tile model

Each tile is data, not scene-specific logic.

Example conceptual schema:

- suit: bamboo | character | circle | wind | dragon | blank
- rank: 1..9 where applicable
- wind: east | south | west | north
- dragon: red | green | white
- uniqueId
- narrativeTags[]
- worldEffects[]

### Meld types for early game

- Pair: two identical tiles
- Sequence: three sequential suited tiles
- Triplet: three identical tiles

Do not implement the entire scoring ruleset of real Mahjong for the vertical slice.

### Resolver

Pure deterministic function:
`resolveMeld(tiles) -> MeldResult`

The resolver must be unit tested and independent from Three.js.

## 3. Environmental rule binding

A world object can subscribe to a puzzle condition.

Concept:
`condition -> state transition`

Example:
`Sequence(Bamboo 2,3,4) -> ALIGN_BALCONIES`

Do not hard-code every puzzle in React component conditionals.
Use data-driven puzzle definitions.

## 4. Inventory

The player carries a deliberately small number of active tiles.
Requirements:

- visible slots;
- inspect metadata;
- select tile;
- place into puzzle socket;
- recover tile when puzzle rules permit.

## 5. Memory fragments

Memory fragments are separate from ordinary tiles even when visually represented by tiles.

Each fragment contains:

- id;
- source;
- timestamp claim;
- people;
- location;
- propositions;
- contradictions;
- player-known state.

A reconstruction combines fragments to create a scene or conclusion.

## 6. Discard

Discard is irreversible inside the current narrative branch unless the story explicitly provides a recovery mechanic.

Before discard:

- make consequence legible;
- no fake confirm spam;
- save after resolution.

Discard can alter:

- NPC dialogue availability;
- reconstruction candidates;
- environmental ghost scenes;
- endings.

## 7. Dead Hands

Enemies are puzzle agents with visible rules.

Vertical slice enemy:
**Watcher Pair**

- exists as two mirrored forms;
- while paired, blocks a passage;
- separating their matching tile anchors causes them to desynchronize and disappear.

Combat design rules:

- readable;
- low input complexity;
- failure teaches;
- avoid damage sponge behavior.

## 8. Dealer encounter

The Dealer reads a scripted discard sequence.
Each discarded Wind changes arena topology.

Player tasks:

- observe discard row;
- infer next transformation;
- move into a safe/advantageous zone;
- place the blank tile to interrupt the forced pair.

No conventional health bar.

## 9. Hint model

Three layers:

1. environmental affordance;
2. inspect text;
3. optional explicit hint after repeated failure.

Never immediately show the solution.

## 10. Save system

Persist:

- current checkpoint;
- puzzle state;
- collected tiles;
- discarded memories;
- settings;
- narrative flags.

Version save schema.
Support migration or safe reset when incompatible.

## 11. Game state principle

Separate:

- domain state;
- presentation state;
- transient render state.

Puzzle truth must never depend on frame rate.
