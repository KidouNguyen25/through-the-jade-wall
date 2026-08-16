# WORLD DESIGN

## Spatial thesis

Jade Court should feel larger than its actual production footprint through:

- sightlines;
- recursive architecture;
- inaccessible visible spaces;
- scale shifts;
- windows into alternate states;
- reused geometry under changed rules.

## Vertical slice map

### 1. Rain Alley

Purpose:

- establish ordinary reality;
- teach movement;
- present White Tile.

No puzzle.

### 2. Tea House

Purpose:

- interaction tutorial;
- first impossible event;
- set up abandoned Mahjong hand.

Key prop:
A table with four seats. Alice sees only one shadow: her own.

### 3. The Falling Table

Short transition space.
Alice falls past:

- giant tiles;
- upside-down rooms;
- repeated doors;
- fragments of dialogue.

Keep technically simple: controlled camera + authored geometry rather than expensive simulation.

### 4. East Arcade

Hub for vertical slice.

Landmarks:

- Brass Clock;
- Three Balcony Houses;
- Tile Market;
- locked Memory Room;
- Dealer's Court gate.

Puzzle A:
Find Bamboo 4 and complete 2–3–4 sequence.
Result:
three balcony sections align into a bridge.

Puzzle B:
Pair two identical door plaques.
Result:
the city treats two separate doors as "the same door," allowing impossible traversal.

### 5. Memory Room

A dark archive where spatial reconstruction is projected as translucent geometry.

Player combines three fragments:

- East Gate;
- Midnight Bell;
- Captain.

The reconstruction shows the Captain opening the gate, but one shadow belongs to a child.

### 6. Discard Passage

The exit demands the player discard one memory:

- "Order"
- "Mercy"
- "Witness"

For the slice, consequences change dialogue and final scene framing.

### 7. Dealer's Court

Circular court containing four rotating district segments.
Dealer's Winds modify the arena.

Hidden solution:
the court recognizes two statues as a pair. The player can break the identity relation instead of selecting a suspect.

## Environmental storytelling rules

Every important location needs:

- dominant visual question;
- one readable interaction;
- one narrative clue;
- one mechanical purpose.

Avoid decorating rooms that do not matter.

## Level metrics

For vertical slice:

- 6–8 meaningful spaces;
- 2 optional side spaces;
- no more than 2 minutes of traversal without interaction;
- checkpoints before/after irreversible choices and boss encounter.

## Impossible-space implementation

Prefer controlled techniques:

- teleport portals hidden at thresholds;
- duplicated rooms;
- scale swaps;
- scene graph transforms;
- occlusion;
- camera-relative reveals.

Do not build a generalized non-Euclidean engine before the slice proves the mechanic.
