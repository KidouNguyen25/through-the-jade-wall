import { useState, useEffect } from 'react';
import GameRoot from '../game/GameRoot';
import { useSettingsStore } from '../state/settingsStore';
import { useGameStore } from '../state/gameStore';
import { getTileById } from '../domain/mahjong/tileTypes';
import './App.css';

export function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    currentScene,
    activeCheckpoint,
    activeInteractable,
    activeInspection,
    setActiveInspection,
    inventoryTiles,
    selectedInventoryTileId,
    selectInventoryTile,
    bannerMessage,
    sameDoorPairActive,
    portalWarping,
    hintModalOpen,
    activeHintLevel,
    toggleHintModal,
    requestNextHint,
    collectWhiteTile,
    collectBamboo4,
    collectRedDragon,
    placeTileInSocket,
    traverseSameDoor,
    enterTeaHouse,
  } = useGameStore();

  const {
    masterVolume,
    setMasterVolume,
    subtitles,
    setSubtitles,
    reducedMotion,
    setReducedMotion,
  } = useSettingsStore();

  // Keyboard shortcut to select tiles using numbers 1..5 and H for Hint
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === 'KeyH') {
        toggleHintModal();
        return;
      }

      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= inventoryTiles.length) {
        const selectedId = inventoryTiles[num - 1];
        selectInventoryTile(selectedId ?? null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inventoryTiles, selectInventoryTile, toggleHintModal]);

  const handlePromptClick = () => {
    if (!activeInteractable) return;
    const id = activeInteractable.id;

    if (id === 'white_tile_pickup') {
      collectWhiteTile();
    } else if (id === 'enter_tea_house_trigger') {
      enterTeaHouse();
    } else if (id === 'bamboo_4_pickup') {
      collectBamboo4();
    } else if (id === 'socket_3_interaction') {
      if (inventoryTiles.includes('tile_bamboo_4')) {
        placeTileInSocket('socket_balcony_3', 'tile_bamboo_4');
      }
    } else if (id === 'red_dragon_pickup') {
      collectRedDragon();
    } else if (id === 'door_beta_socket') {
      if (sameDoorPairActive) {
        traverseSameDoor('beta');
      } else if (inventoryTiles.includes('tile_dragon_red')) {
        placeTileInSocket('socket_door_beta', 'tile_dragon_red');
      }
    } else if (id === 'door_alpha_portal') {
      if (sameDoorPairActive) {
        traverseSameDoor('alpha');
      }
    }
  };

  const selectedTileDef = selectedInventoryTileId ? getTileById(selectedInventoryTileId) : null;

  return (
    <div className="app-container">
      {/* Portal Spatial Warp Screen Flash */}
      {portalWarping && <div className="portal-warp-overlay" aria-hidden="true" />}

      {/* 3D WebGL Canvas Layer */}
      <div className="canvas-layer">
        <GameRoot />
      </div>

      {/* HTML / CSS UI Overlay */}
      <div className="ui-overlay">
        <header className="ui-header">
          <div className="title-group">
            <h1 className="game-title">THROUGH THE JADE WALL</h1>
            <span className="game-subtitle">
              {currentScene === 'east_arcade'
                ? sameDoorPairActive
                  ? 'Act I // East Arcade — Twin Doorway Portal'
                  : 'Act I // East Arcade — Three Balconies'
                : 'Prologue // Rain Alley'}
            </span>
          </div>

          <div className="header-actions">
            <div className="status-badge" role="status" aria-label="System status">
              <span className="status-dot" aria-hidden="true" />
              <span>
                {sameDoorPairActive
                  ? 'Phase 3: Impossible Space Gate'
                  : currentScene === 'east_arcade'
                    ? 'Phase 2: Mahjong Sequence Gate'
                    : 'Phase 1: Rain Alley Slice'}
              </span>
            </div>

            <button
              className="btn-icon"
              onClick={toggleHintModal}
              aria-label="Open Guidance Hints"
              data-testid="hint-toggle-button"
            >
              Guidance (H)
            </button>

            <button
              className="btn-icon"
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Open Settings"
            >
              Settings
            </button>
          </div>
        </header>

        {/* Narrative Progression Banner */}
        {bannerMessage && subtitles && (
          <div className="narrative-banner" role="status">
            <p className="narrative-text">{bannerMessage}</p>
          </div>
        )}

        {/* Center Screen Interaction Prompt */}
        {activeInteractable && (
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

        <footer className="ui-footer">
          <div className="hint-bar" role="region" aria-label="Control hints">
            <div className="hint-item">
              <span className="key-cap">WASD / ↑←↓→</span>
              <span>Move Alice</span>
            </div>
            <div className="hint-item">
              <span className="key-cap">Shift</span>
              <span>Sprint</span>
            </div>
            <div className="hint-item">
              <span className="key-cap">E / Space</span>
              <span>Interact</span>
            </div>
            <div className="hint-item">
              <span className="key-cap">1..4</span>
              <span>Select Tile</span>
            </div>
            <div className="hint-item">
              <span className="key-cap">H</span>
              <span>Hint</span>
            </div>
            <div className="hint-item">
              <span className="key-cap">State</span>
              <span>{activeCheckpoint}</span>
            </div>
          </div>

          {/* Multi-Slot Tile Inventory Tray */}
          <div className="inventory-tray-container">
            {selectedTileDef && (
              <div className="tile-tooltip" role="region" aria-label="Selected Tile Description">
                <span className="tooltip-title">{selectedTileDef.label}</span>
                <span className="tooltip-text">{selectedTileDef.narrativeFragment}</span>
              </div>
            )}

            <div className="inventory-hud" aria-label="Tile inventory">
              {[0, 1, 2, 3].map((index) => {
                const tileId = inventoryTiles[index];
                const tileDef = tileId ? getTileById(tileId) : null;
                const isSelected = selectedInventoryTileId === tileId && tileId !== undefined;

                return (
                  <button
                    key={index}
                    className={`inventory-slot ${tileDef ? 'occupied' : ''} ${
                      isSelected ? 'selected' : ''
                    }`}
                    title={tileDef ? tileDef.label : 'Empty Slot'}
                    onClick={() => {
                      if (tileId) {
                        selectInventoryTile(isSelected ? null : tileId);
                      }
                    }}
                    data-testid={`inventory-slot-${index}`}
                  >
                    {tileDef ? (
                      <div className="tile-icon">
                        <span className="slot-number">{index + 1}</span>
                        <span className="tile-name">{tileDef.shortName}</span>
                      </div>
                    ) : (
                      <span className="empty-slot-marker">—</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="version-tag">
            <span>v0.3.0-alpha</span>
          </div>
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
                The Court's Whispers (Tier {activeHintLevel})
              </h2>
              <button
                className="modal-close"
                onClick={toggleHintModal}
                aria-label="Close Hint Modal"
              >
                ✕
              </button>
            </div>

            <div className="hint-content">
              {/* Level 1: Environmental Affordance */}
              <div className="hint-section">
                <span className="hint-tier-tag">Layer I — Environmental Observation</span>
                <p className="hint-body">
                  Doorway Alpha on the East Pavilion bears an ancient vermilion seal: the Red Dragon
                  plaque. High on the observation tower, Doorway Beta has an empty square recess of
                  matching dimensions.
                </p>
              </div>

              {/* Level 2: Investigative Domain Rule */}
              {activeHintLevel >= 2 && (
                <div className="hint-section active">
                  <span className="hint-tier-tag">Layer II — Mahjong Space Principle</span>
                  <p className="hint-body">
                    In Mahjong, a <em>Pair (Toitsu)</em> establishes identical identity between two
                    objects. If two distant doors hold matching Dragon plaques, the architecture of
                    Jade Court binds them into the same physical doorway.
                  </p>
                </div>
              )}

              {/* Level 3: Direct Actionable Guidance */}
              {activeHintLevel >= 3 && (
                <div className="hint-section actionable">
                  <span className="hint-tier-tag">Layer III — Clear Guidance</span>
                  <p className="hint-body">
                    Retrieve the Red Dragon plaque from the altar shrine on the Upper Terrace, cross
                    to the West Tower, and place it into the empty socket above Doorway Beta. Then
                    step through either doorway to warp across space.
                  </p>
                </div>
              )}
            </div>

            <div className="hint-actions">
              {activeHintLevel < 3 ? (
                <button className="btn-hint-expand" onClick={requestNextHint}>
                  Request Deeper Insight (Layer {activeHintLevel + 1})
                </button>
              ) : (
                <span className="hint-max-reached">All guidance layers revealed.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inspection Modal */}
      {activeInspection && (
        <div
          className="modal-backdrop"
          onClick={() => setActiveInspection(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{activeInspection.title}</h2>
              <button
                className="modal-close"
                onClick={() => setActiveInspection(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p style={{ lineHeight: 1.6, fontSize: '0.9rem', color: 'var(--color-ivory)' }}>
              {activeInspection.description}
            </p>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsSettingsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="settings-title" className="modal-title">
                System Configuration
              </h2>
              <button
                className="modal-close"
                onClick={() => setIsSettingsOpen(false)}
                aria-label="Close Settings"
              >
                ✕
              </button>
            </div>

            <div className="setting-row">
              <label htmlFor="master-volume" className="setting-label">
                Master Volume ({Math.round(masterVolume * 100)}%)
              </label>
              <div className="setting-control">
                <input
                  id="master-volume"
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
              <label htmlFor="subtitles-toggle" className="setting-label">
                Subtitles
              </label>
              <div className="setting-control">
                <input
                  id="subtitles-toggle"
                  type="checkbox"
                  checked={subtitles}
                  onChange={(e) => setSubtitles(e.target.checked)}
                />
              </div>
            </div>

            <div className="setting-row">
              <label htmlFor="motion-toggle" className="setting-label">
                Reduced Motion
              </label>
              <div className="setting-control">
                <input
                  id="motion-toggle"
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
