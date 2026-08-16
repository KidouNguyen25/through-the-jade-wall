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

export const DISCARD_PASSAGE_ENTRY_TREE: DialogueTree = {
  id: 'discard_passage_entry',
  initialNodeId: 'node_dp_1',
  nodes: {
    node_dp_1: {
      id: 'node_dp_1',
      speaker: 'Alice',
      text: 'The air is thick with ash and calcified jade. Two monumental altars overlook the chasm ahead.',
      nextNodeId: 'node_dp_2',
    },
    node_dp_2: {
      id: 'node_dp_2',
      speaker: 'Inscription of the Bifurcation',
      text: '“Every discarded tile reshapes the river forever. Sacrifice to the West Stone Furnace, or the East Brazen Brazier.”',
      nextNodeId: 'node_dp_3',
    },
    node_dp_3: {
      id: 'node_dp_3',
      speaker: 'Alice',
      text: 'Whichever path I unlock will permanently collapse the other. There is no turning back.',
    },
  },
};

export const DISCARD_ARCHIVIST_CONSEQUENCE_TREE: DialogueTree = {
  id: 'discard_archivist_consequence',
  initialNodeId: 'node_arc_1',
  nodes: {
    node_arc_1: {
      id: 'node_arc_1',
      speaker: 'Archivist Stone Furnace',
      text: 'Emerald flame consumes the offered tile. The massive West Portcullis grinds open, as the East Gate collapses into rubble!',
      nextNodeId: 'node_arc_2',
    },
    node_arc_2: {
      id: 'node_arc_2',
      speaker: 'Archivist Echo',
      speakerRole: 'Scholar of the Inner Library',
      text: 'You have chosen the Scholar’s Ascent. The mortal structures crumble behind you, yet the path of hidden knowledge is clear.',
    },
  },
};

export const DISCARD_REGENT_CONSEQUENCE_TREE: DialogueTree = {
  id: 'discard_regent_consequence',
  initialNodeId: 'node_reg_1',
  nodes: {
    node_reg_1: {
      id: 'node_reg_1',
      speaker: 'Regent Brazen Brazier',
      text: 'Crimson fire roars through the altar. The East Iron Gate ascends with thunderous resonance, while the West Archway seals forever!',
      nextNodeId: 'node_reg_2',
    },
    node_reg_2: {
      id: 'node_reg_2',
      speaker: 'Vermilion Regent Echo',
      speakerRole: 'Commander of the North Bastion',
      text: 'A martial discard! You cast away hesitation. Walk the Grand Promenade toward the Watcher’s Courtyard.',
    },
  },
};

export const DISCARD_WHITE_TILE_REJECTED_TREE: DialogueTree = {
  id: 'discard_white_tile_rejected',
  initialNodeId: 'node_wtr_1',
  nodes: {
    node_wtr_1: {
      id: 'node_wtr_1',
      speaker: 'Altar of Discard',
      text: 'The flames extinguish upon touching the White Tile. The Blank tile refuses to be categorized or destroyed.',
      nextNodeId: 'node_wtr_2',
    },
    node_wtr_2: {
      id: 'node_wtr_2',
      speaker: 'Alice',
      text: 'The White Tile is immune to the law of sacrifice. It must remain in my hand until the final court.',
    },
  },
};

export const DEAD_HAND_ENTRY_TREE: DialogueTree = {
  id: 'dead_hand_entry',
  initialNodeId: 'node_dhe_1',
  nodes: {
    node_dhe_1: {
      id: 'node_dhe_1',
      speaker: 'Alice',
      text: 'The Courtyard of the Watchers. Two colossal automatons sweep their ocular lanterns across the stone flags.',
      nextNodeId: 'node_dhe_2',
    },
    node_dhe_2: {
      id: 'node_dhe_2',
      speaker: 'Observation Log',
      text: 'Rule of Safe Discard (Furiten): Standing within the glowing green Discard Sanctuaries shields you from Watcher detection.',
      nextNodeId: 'node_dhe_3',
    },
    node_dhe_3: {
      id: 'node_dhe_3',
      speaker: 'Alice',
      text: 'I must reach the Central Gong of Invalidation ahead and declare Chombo to freeze their search loops.',
    },
  },
};

export const DEAD_HAND_DETECTED_TREE: DialogueTree = {
  id: 'dead_hand_detected',
  initialNodeId: 'node_det_1',
  nodes: {
    node_det_1: {
      id: 'node_det_1',
      speaker: 'Watcher Sentinel Alpha',
      speakerRole: 'Sentinel of the Outer Bastion',
      text: 'UNAUTHORIZED WAIT DETECTED! INTRUDER POSITION COMPROMISED!',
      nextNodeId: 'node_det_2',
    },
    node_det_2: {
      id: 'node_det_2',
      speaker: 'Alice',
      text: 'Their ocular beam caught me outside the discard sanctuary! I must recalibrate from the courtyard threshold.',
    },
  },
};

export const DEAD_HAND_INVALIDATED_TREE: DialogueTree = {
  id: 'dead_hand_invalidated',
  initialNodeId: 'node_inv_1',
  nodes: {
    node_inv_1: {
      id: 'node_inv_1',
      speaker: 'Gong of Invalidation',
      text: 'CHOMBO! The Blank Tile resonates through the courtyard. The Watchers’ illegal tenpai state forces immediate Dead Hand penalty!',
      nextNodeId: 'node_inv_2',
    },
    node_inv_2: {
      id: 'node_inv_2',
      speaker: 'Watcher Sentinel Beta',
      speakerRole: 'Sentinel of the Inner Bastion',
      text: 'ERROR: ILLEGAL WAIT ENCOUNTERED. HAND RENDERED VOID. ENGAGING TOTAL STASIS LOCKDOWN...',
      nextNodeId: 'node_inv_3',
    },
    node_inv_3: {
      id: 'node_inv_3',
      speaker: 'Alice',
      text: 'The Watchers are frozen in stasis! The monumental doors to the Dealer’s Court are now unsealed.',
    },
  },
};
