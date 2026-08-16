import { useState } from 'react';
import GameRoot from '../game/GameRoot';
import { useSettingsStore } from '../state/settingsStore';
import { useGameStore } from '../state/gameStore';
import './App.css';

export function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { activeCheckpoint } = useGameStore();
  const {
    masterVolume,
    setMasterVolume,
    subtitles,
    setSubtitles,
    reducedMotion,
    setReducedMotion,
  } = useSettingsStore();

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
            <span className="game-subtitle">Prologue // Jade Court Memory Engine</span>
          </div>

          <div className="header-actions">
            <div className="status-badge" role="status" aria-label="System status">
              <span className="status-dot" aria-hidden="true" />
              <span>Phase 0: Industrial Bootstrap</span>
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

        <footer className="ui-footer">
          <div className="hint-bar" role="region" aria-label="Control hints">
            <div className="hint-item">
              <span className="key-cap">Mouse Drag</span>
              <span>Orbit View</span>
            </div>
            <div className="hint-item">
              <span className="key-cap">Scroll</span>
              <span>Zoom</span>
            </div>
            <div className="hint-item">
              <span className="key-cap">State</span>
              <span>{activeCheckpoint}</span>
            </div>
          </div>

          <div className="version-tag">
            <span>v0.0.1 (Pre-Alpha)</span>
          </div>
        </footer>
      </div>

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
