import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../state/gameStore';
import { MEMORY_ROOM_ENTRY_TREE } from '../domain/narrative/dialogueData';

describe('Narrative State & Dialogue Tree Navigation', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('initializes and advances dialogue tree with sequential nodes', () => {
    const store = useGameStore.getState();
    store.startDialogue(MEMORY_ROOM_ENTRY_TREE);

    const afterStart = useGameStore.getState();
    expect(afterStart.activeDialogueNode?.id).toBe('node_entry_1');
    expect(afterStart.activeDialogueNode?.speaker).toBe('Alice');

    // Advance to node 2 (Keeper Echo choices)
    store.advanceDialogue();
    const node2 = useGameStore.getState().activeDialogueNode;
    expect(node2?.id).toBe('node_entry_2');
    expect(node2?.speaker).toBe('Keeper Echo');
    expect(node2?.choices?.length).toBe(2);
  });

  it('selects dialogue choice and sets appropriate narrative flag', () => {
    const store = useGameStore.getState();
    store.startDialogue(MEMORY_ROOM_ENTRY_TREE, 'node_entry_2');

    // Select choice index 0 ("What is this place?")
    store.advanceDialogue(0);

    const updated = useGameStore.getState();
    expect(updated.activeDialogueNode?.id).toBe('node_entry_place');
    expect(updated.narrativeFlags['asked_about_sanctuary']).toBe(true);
  });

  it('closes dialogue when reaching end of tree or invoking closeDialogue', () => {
    const store = useGameStore.getState();
    store.startDialogue(MEMORY_ROOM_ENTRY_TREE, 'node_entry_end');

    expect(useGameStore.getState().activeDialogueNode?.id).toBe('node_entry_end');

    store.advanceDialogue();
    expect(useGameStore.getState().activeDialogueNode).toBeNull();
    expect(useGameStore.getState().activeDialogueTree).toBeNull();
  });

  it('reconstructs memory hologram when all 3 fragments are collected and dialogue concludes', () => {
    const store = useGameStore.getState();
    store.enterMemoryRoom();

    expect(useGameStore.getState().memoryReconstructed).toBe(false);

    store.collectMemoryFragment('eastGate');
    expect(useGameStore.getState().memoryFragments.eastGate).toBe(true);
    expect(useGameStore.getState().memoryReconstructed).toBe(false);
    store.closeDialogue();

    store.collectMemoryFragment('midnightBell');
    expect(useGameStore.getState().memoryFragments.midnightBell).toBe(true);
    expect(useGameStore.getState().memoryReconstructed).toBe(false);
    store.closeDialogue();

    store.collectMemoryFragment('captainSeal');
    expect(useGameStore.getState().memoryFragments.captainSeal).toBe(true);
    // Fragment dialogue is shown first
    expect(useGameStore.getState().activeDialogueNode?.id).toBe('node_cs_1');

    // Advance and conclude fragment dialogue
    store.advanceDialogue();
    store.advanceDialogue();

    // Verification of holographic reconstruction
    expect(useGameStore.getState().memoryReconstructed).toBe(true);
    expect(useGameStore.getState().checkpoint).toBe('cp_memory_reconstructed');
    expect(useGameStore.getState().activeDialogueNode?.id).toBe('node_rec_1');
  });
});
