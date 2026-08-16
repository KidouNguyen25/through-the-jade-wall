import { DialogueTree } from './narrativeTypes';

export const MEMORY_ROOM_ENTRY_TREE: DialogueTree = {
  id: 'memory_room_entry',
  initialNodeId: 'node_entry_1',
  nodes: {
    node_entry_1: {
      id: 'node_entry_1',
      speaker: 'Alice',
      speakerRole: 'Architectural Explorer',
      text: 'The air here smells of aged sandalwood and cold stone... A sanctuary hidden between distorted walls.',
      nextNodeId: 'node_entry_2',
    },
    node_entry_2: {
      id: 'node_entry_2',
      speaker: 'Keeper Echo',
      speakerRole: 'Memory of the Jade Court',
      text: 'Welcome, traveler. You stepped through matching gates where others saw only solid brick.',
      choices: [
        {
          label: 'What is this place?',
          nextNodeId: 'node_entry_place',
          setFlag: 'asked_about_sanctuary',
        },
        {
          label: 'Why did the city seal itself?',
          nextNodeId: 'node_entry_seals',
          setFlag: 'asked_about_seals',
        },
      ],
    },
    node_entry_place: {
      id: 'node_entry_place',
      speaker: 'Keeper Echo',
      speakerRole: 'Memory of the Jade Court',
      text: 'This is the Dais of Triads. When three resonance fragments align, the true memory of the Jade Wall will project into physical light.',
      nextNodeId: 'node_entry_end',
    },
    node_entry_seals: {
      id: 'node_entry_seals',
      speaker: 'Keeper Echo',
      speakerRole: 'Memory of the Jade Court',
      text: 'The Dealer demanded a game where space obeys no geometry. To survive, the citizens crystallized their history into three sacred fragments.',
      nextNodeId: 'node_entry_end',
    },
    node_entry_end: {
      id: 'node_entry_end',
      speaker: 'Observation Log',
      text: 'Examine the three memory pedestals surrounding the central dais to recover the city record.',
    },
  },
};

export const FRAGMENT_EAST_GATE_TREE: DialogueTree = {
  id: 'fragment_east_gate',
  initialNodeId: 'node_eg_1',
  nodes: {
    node_eg_1: {
      id: 'node_eg_1',
      speaker: 'Observation Log',
      text: 'Memory Fragment I: [The Closed East Perimeter]. The gates were locked under the East Wind.',
      nextNodeId: 'node_eg_2',
    },
    node_eg_2: {
      id: 'node_eg_2',
      speaker: 'Alice',
      text: 'They sealed the outer perimeter to prevent the non-Euclidean decay from escaping into the valley.',
    },
  },
};

export const FRAGMENT_MIDNIGHT_BELL_TREE: DialogueTree = {
  id: 'fragment_midnight_bell',
  initialNodeId: 'node_mb_1',
  nodes: {
    node_mb_1: {
      id: 'node_mb_1',
      speaker: 'Observation Log',
      text: 'Memory Fragment II: [The Midnight Bell]. A resonant chime that locked spatial dimensions.',
      nextNodeId: 'node_mb_2',
    },
    node_mb_2: {
      id: 'node_mb_2',
      speaker: 'Keeper Echo',
      text: 'When the bell toll froze in mid-air, sequences began determining architectural layout instead of gravity.',
    },
  },
};

export const FRAGMENT_CAPTAIN_SEAL_TREE: DialogueTree = {
  id: 'fragment_captain_seal',
  initialNodeId: 'node_cs_1',
  nodes: {
    node_cs_1: {
      id: 'node_cs_1',
      speaker: 'Observation Log',
      text: "Memory Fragment III: [The Captain's Discard Seal]. An official decree on tile sacrifices.",
      nextNodeId: 'node_cs_2',
    },
    node_cs_2: {
      id: 'node_cs_2',
      speaker: 'Alice',
      text: '“To open the innermost sanctum, one must discard what is most precious without turning back.”',
    },
  },
};

export const MEMORY_RECONSTRUCTED_TREE: DialogueTree = {
  id: 'memory_reconstructed',
  initialNodeId: 'node_rec_1',
  nodes: {
    node_rec_1: {
      id: 'node_rec_1',
      speaker: 'Observation Log',
      text: 'Holographic Projection Online: A complete Triad of Memories has illuminated the Dais.',
      nextNodeId: 'node_rec_2',
    },
    node_rec_2: {
      id: 'node_rec_2',
      speaker: 'Keeper Echo',
      speakerRole: 'Memory of the Jade Court',
      text: 'Behold the true Jade Wall. The way forward to the Discard Passage and Dealer’s Court is now unsealed.',
      choices: [
        {
          label: 'I am ready to enter the Discard Passage.',
          nextNodeId: 'node_rec_3',
        },
      ],
    },
    node_rec_3: {
      id: 'node_rec_3',
      speaker: 'Alice',
      text: 'The path is clear. I must proceed into the deeper courts.',
    },
  },
};
