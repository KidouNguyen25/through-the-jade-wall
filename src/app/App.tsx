import { useState, useEffect, useCallback } from 'react';
import GameRoot from '../game/GameRoot';
import { useGameStore } from '../state/gameStore';
import { useSettingsStore } from '../state/settingsStore';
import { TILE_CATALOG } from '../domain/mahjong/tileTypes';
import './App.css';

export function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    currentScene,
    inventoryTiles,
    selectedSlot,
    setSelectedSlot,
    activeInteractable,
    activeInspection,
    setActiveInspection,
    narrativeMessage,
    checkpoint,
    portalWarping,
    activeHintLevel,
    hintModalOpen,
    setHintLevel,
    toggleHintModal,
    // Phase 4: Dialogue & Memory Fragments
    activeDialogueNode,
    advanceDialogue,
    closeDialogue,
    memoryFragments,
    memoryReconstructed,
  } = useGameStore();

  const {
    masterVolume,
    reducedMotion,
    highContrastIndicator,
    showControlHints,
    setMasterVolume,
    setReducedMotion,
    setHighContrastIndicator,
    setShowControlHints,
  } = useSettingsStore();

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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleSettings = () => {
    setSettingsOpen((prev) => !prev);
  };

  const handlePromptClick = () => {
    if (activeInteractable) {
      window.dispatchEvent(
        new CustomEvent('ttjw-interact', { detail: { id: activeInteractable.id } }),
      );
    }
  };

  const selectedTileId = inventoryTiles[selectedSlot] ?? null;
  const selectedTile = selectedTileId ? (TILE_CATALOG[selectedTileId] ?? null) : null;

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
        {/* Header HUD */}
        <header className="ui-header">
          <div className="title-group">
            <h1 className="game-title">THROUGH THE JADE WALL</h1>
            <span className="game-subtitle">
              {currentScene === 'dead_hand'
                ? 'Act I // Courtyard of the Watchers'
                : currentScene === 'discard_passage'
                  ? 'Act I // Passage of Broken Tiles'
                  : currentScene === 'memory_room'
                    ? 'Act I // Memory Sanctuary — Dais of Triads'
                    : currentScene === 'east_arcade'
                      ? 'Act I // East Arcade — Three Balconies'
                      : 'Prologue // Rain Alley'}
            </span>
          </div>

          <div className="header-actions">
            {/* Memory Fragments Progress Badge in Memory Room */}
            {currentScene === 'memory_room' && (
              <div
                className="memory-fragments-badge"
                title="Triad Memory Resonance Fragments"
                data-testid="memory-fragments-tracker"
              >
                <span
                  className={`fragment-dot ${memoryFragments.eastGate ? 'active' : ''}`}
                  title="East Gate Fragment"
                >
                  I
                </span>
                <span
                  className={`fragment-dot ${memoryFragments.midnightBell ? 'active' : ''}`}
                  title="Midnight Bell Fragment"
                >
                  II
                </span>
                <span
                  className={`fragment-dot ${memoryFragments.captainSeal ? 'active' : ''}`}
                  title="Captain Seal Fragment"
                >
                  III
                </span>
                <span className="fragment-label">
                  {memoryReconstructed
                    ? 'Triad Reconstructed'
                    : `Fragments (${
                        Number(memoryFragments.eastGate) +
                        Number(memoryFragments.midnightBell) +
                        Number(memoryFragments.captainSeal)
                      }/3)`}
                </span>
              </div>
            )}

            <div className="status-badge" role="status" aria-label="System status">
              <span className="status-dot" />
              <span>
                {currentScene === 'boss_court'
                  ? useGameStore.getState().verticalSliceCompleted
                    ? 'Phase 7: Trial Shattered (Victory)'
                    : useGameStore.getState().dealerPhase === 'forced_hand'
                      ? 'Phase 7: The Final Hand (Ron)'
                      : useGameStore.getState().dealerPhase === 'wind_south'
                        ? 'Phase 7: Wind of the South'
                        : useGameStore.getState().dealerPhase === 'wind_east'
                          ? 'Phase 7: Wind of the East'
                          : 'Phase 7: Dealer’s Court'
                  : currentScene === 'dead_hand'
                    ? useGameStore.getState().deadHandInvalidated
                      ? 'Phase 6: Dead Hand Declared (Stasis Lock)'
                      : 'Phase 6: Watcher Encounter'
                    : currentScene === 'discard_passage'
                      ? useGameStore.getState().discardPassageChoice === 'archivist'
                        ? 'Phase 5: Scholar’s Ascent (West Unlocked)'
                        : useGameStore.getState().discardPassageChoice === 'regent'
                          ? 'Phase 5: Martial Passage (East Unlocked)'
                          : 'Phase 5: Discard Consequence'
                      : currentScene === 'memory_room'
                        ? memoryReconstructed
                          ? 'Phase 4: Memory Reconstructed'
                          : 'Phase 4: Memory Sanctuary'
                        : currentScene === 'east_arcade'
                          ? useGameStore.getState().sameDoorPairActive
                            ? 'Phase 3: Impossible Space Gate'
                            : 'Phase 2: Mahjong Sequence Gate'
                          : 'Phase 1: Rain Alley Slice'}
              </span>
            </div>

            <button
              className="btn-icon"
              onClick={toggleHintModal}
              aria-label="Open Guidance Hints"
              title="Guidance (H)"
            >
              Guidance (H)
            </button>

            <button
              className="btn-icon"
              onClick={toggleSettings}
              aria-label="Open Settings"
              title="Settings"
            >
              Settings
            </button>
          </div>
        </header>

        {/* Narrative Progression Banner */}
        {narrativeMessage && (
          <aside className="narrative-banner" role="status">
            <p className="narrative-text">{narrativeMessage}</p>
          </aside>
        )}

        {/* Interaction Prompt Overlay */}
        {activeInteractable && !activeDialogueNode && (
          <div className="interaction-prompt-container">
            <button
              className="interaction-prompt-badge"
              onClick={handlePromptClick}
              data-testid="interaction-prompt-button"
            >
              <span className="interact-key">E</span>
              <span>{activeInteractable.promptText}</span>
            </button>
          </div>
        )}

        {/* Phase 4: Dialogue Presentation Modal */}
        {activeDialogueNode && (
          <div
            className="dialogue-overlay-container"
            role="region"
            aria-label="Dialogue Monologue"
            data-testid="dialogue-card"
          >
            <div className="dialogue-card">
              <div className="dialogue-header">
                <div className="dialogue-speaker-tag">
                  <span
                    className={`speaker-badge speaker-${activeDialogueNode.speaker.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {activeDialogueNode.speaker}
                  </span>
                  {activeDialogueNode.speakerRole && (
                    <span className="speaker-role">{activeDialogueNode.speakerRole}</span>
                  )}
                </div>
                <button
                  className="dialogue-close-btn"
                  onClick={closeDialogue}
                  aria-label="Close dialogue"
                >
                  ✕
                </button>
              </div>

              <p className="dialogue-text">{activeDialogueNode.text}</p>

              {/* Dialogue Choices */}
              {activeDialogueNode.choices && activeDialogueNode.choices.length > 0 ? (
                <div className="dialogue-choices-list">
                  {activeDialogueNode.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      className="dialogue-choice-btn"
                      onClick={() => advanceDialogue(idx)}
                      data-testid={`dialogue-choice-${idx}`}
                    >
                      <span className="choice-number">{idx + 1}</span>
                      <span>{choice.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="dialogue-footer">
                  <button
                    className="dialogue-continue-btn"
                    onClick={() => advanceDialogue()}
                    data-testid="dialogue-continue-btn"
                  >
                    <span>Continue</span>
                    <span className="key-cap">Space / E</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer HUD */}
        <footer className="ui-footer">
          {/* Controls Hint Bar */}
          {showControlHints && (
            <nav className="hint-bar" aria-label="Control hints">
              <div className="hint-item">
                <span className="key-cap">WASD</span> / <span className="key-cap">↑←↓→</span> Move
                Alice
              </div>
              <div className="hint-item">
                <span className="key-cap">Shift</span> Sprint
              </div>
              <div className="hint-item">
                <span className="key-cap">E</span> / <span className="key-cap">Space</span> Interact
              </div>
              <div className="hint-item">
                <span className="key-cap">1..4</span> Select Tile
              </div>
              <div className="hint-item">
                <span className="key-cap">H</span> Hint
              </div>
              <div className="hint-item">
                <span className="version-tag">State {checkpoint}</span>
              </div>
            </nav>
          )}

          {/* Interactive Multi-Slot Tile Inventory Tray */}
          <div className="inventory-tray-container">
            {/* Tile Lore Description Tooltip (hidden during active dialogue) */}
            {!activeDialogueNode && selectedTile && (
              <div
                className="tile-tooltip"
                role="region"
                aria-label="Selected Tile Description"
                data-testid="tile-tooltip"
              >
                <span className="tooltip-title">{selectedTile.label}</span>
                <span className="tooltip-text">
                  {selectedTile.narrativeFragment || 'A sacred mahjong tile bearing ancient seal.'}
                </span>
              </div>
            )}

            <div className="inventory-hud" role="region" aria-label="Tile Inventory">
              {[0, 1, 2, 3].map((idx) => {
                const tileId = inventoryTiles[idx];
                const tile = tileId ? TILE_CATALOG[tileId] : null;
                const isSelected = idx === selectedSlot && !!tile;

                return (
                  <button
                    key={idx}
                    className={`inventory-slot ${tile ? 'occupied' : ''} ${
                      isSelected ? 'selected' : ''
                    }`}
                    onClick={() => {
                      if (tile) setSelectedSlot(idx);
                    }}
                    title={tile ? `${tile.label} (Press ${idx + 1})` : `Empty Slot ${idx + 1}`}
                    data-testid={`inventory-slot-${idx}`}
                  >
                    <span className="slot-number">{idx + 1}</span>
                    {tile ? (
                      <div className="tile-icon">
                        <span className="tile-name">{tile.shortName}</span>
                      </div>
                    ) : (
                      <span className="empty-slot-marker">—</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="version-tag">v1.0.0</div>
        </footer>
      </div>

      {/* Tiered Hint System Modal */}
      {hintModalOpen && (
        <div
          className="modal-backdrop"
          onClick={toggleHintModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="hint-modal-title"
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="hint-modal-title" className="modal-title">
                Sanctuary Guidance & Insights
              </h2>
              <button
                className="modal-close"
                onClick={toggleHintModal}
                aria-label="Close guidance modal"
              >
                ✕
              </button>
            </div>

            <div className="hint-content">
              {/* Layer 1: Environmental Clue */}
              <div className={`hint-section ${activeHintLevel >= 1 ? 'active' : ''}`}>
                <span className="hint-tier-tag">Layer I — Environmental Observation</span>
                <p className="hint-body">
                  {currentScene === 'dead_hand'
                    ? 'Two mechanical Watchers sweep ocular lantern searchlights across the courtyard. Glowing green sanctuaries line the stone floor.'
                    : currentScene === 'discard_passage'
                      ? 'Two ceremonial sacrificial altars stand at the cliff edge: the Scholar’s Furnace to the West, and the Regent’s Brazier to the East.'
                      : currentScene === 'memory_room'
                        ? 'Three pedestal prisms surround the central Dais of Triads. Each holds a memory crystal from the past.'
                        : currentScene === 'east_arcade'
                          ? 'The three balconies over the abyss have tile sockets. The walls show a 2-3-4 bamboo carving.'
                          : 'The tea house gate requires a key of pure intention. Look for the glowing stone pedestal.'}
                </p>
              </div>

              {/* Layer 2: Mahjong Space Principle */}
              {activeHintLevel >= 2 && (
                <div className={`hint-section ${activeHintLevel >= 2 ? 'active' : ''}`}>
                  <span className="hint-tier-tag">Layer II — Mahjong Space Principle</span>
                  <p className="hint-body">
                    {currentScene === 'dead_hand'
                      ? 'Furiten / Genbutsu rule: Safe tiles already discarded cannot be called for win. Standing within the glowing Discard Sanctuaries shields you completely from the Watchers’ sight.'
                      : currentScene === 'discard_passage'
                        ? 'In Mahjong, a discard (Tedashi) is an irreversible commitment that alters future hand topologies. Discarding a tile unlocks one route while permanently collapsing the other.'
                        : currentScene === 'memory_room'
                          ? 'Triads (Chow/Pung) create solid reality out of scattered fragments. Align all 3 memories on the table.'
                          : currentScene === 'east_arcade'
                            ? 'Sequences (Chow) connect disparate physical platforms. Pairs (Toitsu) bind separate doorways into identical coordinates.'
                            : 'White Dragons (Haku) symbolize the blank slate — the opening state before any meld is declared.'}
                  </p>
                </div>
              )}

              {/* Layer 3: Direct Actionable Solution */}
              {activeHintLevel >= 3 && (
                <div className="hint-section actionable">
                  <span className="hint-tier-tag">Layer III — Actionable Solution</span>
                  <p className="hint-body">
                    {currentScene === 'dead_hand'
                      ? 'Sprint between the Discard Sanctuaries while the Watchers turn away. Reach the Central Invalidation Dais at [0, 0, -8.0] and strike the Gong with the White Tile to declare Chombo and freeze them in stasis.'
                      : currentScene === 'discard_passage'
                        ? 'Select Bamboo 4 or Red Dragon in your inventory (1..4 keys), approach the respective altar (Furnace for West, Brazier for East), and press E to sacrifice it and unlock the path.'
                        : currentScene === 'memory_room'
                          ? 'Walk to all 3 memory pedestals (East Gate, Midnight Bell, Captain’s Seal) and press E to activate the projection.'
                          : currentScene === 'east_arcade'
                            ? 'Pick up 4 Bamboo from the merchant table and place it into Balcony Socket 3. Then take the Red Dragon Plaque to Doorway Beta.'
                            : 'Walk to the stone pedestal at the right wall, press E to pick up the White Tile, then proceed to the sliding gate.'}
                  </p>
                </div>
              )}

              <div className="hint-actions">
                {activeHintLevel < 3 ? (
                  <button
                    className="btn-hint-expand"
                    onClick={() => setHintLevel(activeHintLevel + 1)}
                  >
                    Request Deeper Insight (Layer {activeHintLevel + 1})
                  </button>
                ) : (
                  <span className="hint-max-reached">Maximum insight reached</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div
          className="modal-backdrop"
          onClick={toggleSettings}
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="settings-title" className="modal-title">
                Preferences & Accessibility
              </h2>
              <button
                className="modal-close"
                onClick={toggleSettings}
                aria-label="Close settings modal"
              >
                ✕
              </button>
            </div>

            <div className="setting-row">
              <label htmlFor="volume-slider" className="setting-label">
                Master Volume ({Math.round(masterVolume * 100)}%)
              </label>
              <div className="setting-control">
                <input
                  id="volume-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="setting-row">
              <label htmlFor="reduced-motion-toggle" className="setting-label">
                Reduced Motion (Reduce camera drift)
              </label>
              <div className="setting-control">
                <input
                  id="reduced-motion-toggle"
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                />
              </div>
            </div>

            <div className="setting-row">
              <label htmlFor="high-contrast-toggle" className="setting-label">
                High Contrast Indicator
              </label>
              <div className="setting-control">
                <input
                  id="high-contrast-toggle"
                  type="checkbox"
                  checked={highContrastIndicator}
                  onChange={(e) => setHighContrastIndicator(e.target.checked)}
                />
              </div>
            </div>

            <div className="setting-row">
              <label htmlFor="control-hints-toggle" className="setting-label">
                Show On-Screen Control Hints
              </label>
              <div className="setting-control">
                <input
                  id="control-hints-toggle"
                  type="checkbox"
                  checked={showControlHints}
                  onChange={(e) => setShowControlHints(e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vertical Slice Victory Climax Modal */}
      {useGameStore.getState().victoryModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => useGameStore.getState().closeVictoryModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="victory-title"
          data-testid="victory-modal"
        >
          <div
            className="modal-card victory-card"
            style={{
              borderColor: '#10b981',
              boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header" style={{ justifyContent: 'center' }}>
              <h2
                id="victory-title"
                className="modal-title"
                style={{ color: '#34d399', letterSpacing: '0.15em', fontSize: '1.4rem' }}
              >
                VERTICAL SLICE COMPLETE
              </h2>
            </div>

            <p
              style={{
                fontStyle: 'italic',
                color: '#fef08a',
                margin: '1.2rem 0',
                fontSize: '1.15rem',
                borderLeft: '3px solid #10b981',
                paddingLeft: '1rem',
                textAlign: 'left',
              }}
            >
              “A hand may be complete and still be wrong.”
            </p>

            <div
              style={{
                fontSize: '0.95rem',
                color: '#cbd5e1',
                lineHeight: 1.6,
                textAlign: 'left',
                margin: '1.2rem 0',
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(51, 65, 85, 0.8)',
              }}
            >
              <div style={{ color: '#38bdf8', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                JOURNEY RECORD:
              </div>
              <div>✔ Sequence Bridge: Linked Bamboo 2-3-4 across the void</div>
              <div>✔ Same-Door Principle: Traversed identical Red Dragon portals</div>
              <div>✔ Holographic Rebirth: Synthesized 3 memory fragments of the Jade Wall</div>
              <div>✔ Discard Consequence: Permanent sacrifice rendered in the Obsidian Canyon</div>
              <div>✔ Dead Hand Invalidation: Watcher Sentinels locked in stasis by Chombo rule</div>
              <div>✔ Refusal of the Premise: The uncarved White Tile broke the synthetic trial</div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                marginTop: '1.5rem',
              }}
            >
              <button
                className="btn-primary"
                onClick={() => useGameStore.getState().closeVictoryModal()}
                style={{ background: '#059669', color: '#ffffff', padding: '0.6rem 1.4rem' }}
              >
                Continue Exploring
              </button>
              <button
                className="btn-secondary"
                onClick={() => useGameStore.getState().resetGame()}
                style={{ padding: '0.6rem 1.4rem' }}
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
