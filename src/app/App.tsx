import { useState } from 'react';
import GameRoot from '../game/GameRoot';
import { useSettingsStore } from '../state/settingsStore';
import { useGameStore } from '../state/gameStore';
import './App.css';

export function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    activeCheckpoint,
    activeInteractable,
    activeInspection,
    setActiveInspection,
    hasWhiteTile,
    bannerMessage,
    collectWhiteTile,
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

  const handlePromptClick = () => {
    if (!activeInteractable) return;
    if (activeInteractable.id === 'white_tile_pickup') {
      collectWhiteTile();
    } else if (activeInteractable.id === 'enter_tea_house_trigger') {
      enterTeaHouse();
    }
  };

  return (
    <div className="app-container">
      {/* 3D WebGL Canvas Layer */}
      <div className="canvas-layer">
        <GameRoot />
      </div>

      {/* HTML / CSS UI Overlay */}
      <div className="ui-overlay">
        <header className="ui-header">
          <div className="title-group">
            <h1 className="game-title">THROUGH THE JADE WALL</h1>
            <span className="game-subtitle">Prologue // Rain Alley</span>
          </div>

          <div className="header-actions">
            <div className="status-badge" role="status" aria-label="System status">
              <span className="status-dot" aria-hidden="true" />
              <span>Phase 1: Rain Alley Slice</span>
            </div>

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
              <span className="key-cap">State</span>
              <span>{activeCheckpoint}</span>
            </div>
          </div>

          {/* Inventory Tray */}
          <div className="inventory-hud" aria-label="Tile inventory">
            <div
              className={`inventory-slot ${hasWhiteTile ? 'occupied' : ''}`}
              title={hasWhiteTile ? 'The White Tile (White Dragon)' : 'Empty Slot'}
              data-testid="inventory-slot-0"
            >
              {hasWhiteTile ? (
                <div className="tile-icon">
                  <span>WHITE</span>
                  <br />
                  <span>TILE</span>
                </div>
              ) : (
                <span style={{ color: '#4a6358', fontSize: '0.7rem' }}>—</span>
              )}
            </div>
          </div>

          <div className="version-tag">
            <span>v0.1.0-alpha</span>
          </div>
        </footer>
      </div>

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
