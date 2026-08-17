import { useState, useEffect, useCallback } from 'react';
import GameRoot from '../game/GameRoot';
import HeaderHUD from '../ui/hud/HeaderHUD';
import NarrativeBanner from '../ui/hud/NarrativeBanner';
import InteractionPromptOverlay from '../ui/hud/InteractionPromptOverlay';
import InventoryHUD from '../ui/hud/InventoryHUD';
import DialogueOverlay from '../ui/dialogue/DialogueOverlay';
import HintModal from '../ui/modals/HintModal';
import SettingsModal from '../ui/modals/SettingsModal';
import VictoryModal from '../ui/modals/VictoryModal';
import { useGameStore } from '../state/gameStore';
import { useSettingsStore } from '../state/settingsStore';
import './App.css';

export function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Narrow keyboard navigation and presentation selectors
  const activeInspection = useGameStore((state) => state.activeInspection);
  const activeDialogueNode = useGameStore((state) => state.activeDialogueNode);
  const activeInteractable = useGameStore((state) => state.activeInteractable);
  const hintModalOpen = useGameStore((state) => state.hintModalOpen);
  const portalWarping = useGameStore((state) => state.portalWarping);

  const setActiveInspection = useGameStore((state) => state.setActiveInspection);
  const toggleHintModal = useGameStore((state) => state.toggleHintModal);
  const closeDialogue = useGameStore((state) => state.closeDialogue);
  const advanceDialogue = useGameStore((state) => state.advanceDialogue);
  const setSelectedSlot = useGameStore((state) => state.setSelectedSlot);

  const highContrastIndicator = useSettingsStore((state) => state.highContrastIndicator);

  // Keyboard shortcut listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Close inspection or modals on Escape
      if (e.code === 'Escape') {
        if (activeInspection) {
          setActiveInspection(null);
          return;
        }
        if (hintModalOpen) {
          toggleHintModal();
          return;
        }
        if (activeDialogueNode) {
          closeDialogue();
          return;
        }
        setSettingsOpen((prev) => !prev);
        return;
      }

      // Dialogue navigation (if active)
      if (activeDialogueNode) {
        if (activeDialogueNode.choices && activeDialogueNode.choices.length > 0) {
          const digit = parseInt(e.key, 10);
          if (!isNaN(digit) && digit >= 1 && digit <= activeDialogueNode.choices.length) {
            advanceDialogue(digit - 1);
            return;
          }
        } else if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter') {
          // If no active 3D prompt is showing, advance dialogue
          if (!activeInteractable) {
            advanceDialogue();
            return;
          }
        }
      }

      // Guidance Hint toggle on 'H'
      if (e.code === 'KeyH') {
        toggleHintModal();
        return;
      }

      // Inventory Slot Select (Keys 1..4)
      if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
        const slotIdx = parseInt(e.code.replace('Digit', ''), 10) - 1;
        if (slotIdx >= 0 && slotIdx < 4) {
          setSelectedSlot(slotIdx);
        }
      }
    },
    [
      activeInspection,
      hintModalOpen,
      activeDialogueNode,
      activeInteractable,
      setActiveInspection,
      toggleHintModal,
      closeDialogue,
      advanceDialogue,
      setSelectedSlot,
    ],
  );

  useEffect(() => {
    useGameStore.getState().loadGame();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleSettings = () => {
    setSettingsOpen((prev) => !prev);
  };

  return (
    <div className={`app-container ${highContrastIndicator ? 'high-contrast' : ''}`}>
      {/* 3D Canvas Viewport */}
      <div className="canvas-layer">
        <GameRoot />
      </div>

      {/* Screen flash transition when traversing portals */}
      {portalWarping && <div className="portal-warp-overlay" aria-hidden="true" />}

      {/* UI Overlay */}
      <div className="ui-overlay">
        <HeaderHUD onToggleSettings={toggleSettings} />
        <NarrativeBanner />
        <InteractionPromptOverlay />
        <DialogueOverlay />
        <InventoryHUD />
      </div>

      {/* Modals & Overlays */}
      <HintModal />
      <SettingsModal isOpen={settingsOpen} onClose={toggleSettings} />
      <VictoryModal />
    </div>
  );
}

export default App;
