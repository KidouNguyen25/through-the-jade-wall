import { useGameStore } from '../../state/gameStore';
import { useSettingsStore } from '../../state/settingsStore';
import { TILE_CATALOG } from '../../domain/mahjong/tileTypes';

export function InventoryHUD() {
  const inventoryTiles = useGameStore((state) => state.inventoryTiles);
  const selectedSlot = useGameStore((state) => state.selectedSlot);
  const setSelectedSlot = useGameStore((state) => state.setSelectedSlot);
  const hasActiveDialogue = useGameStore((state) => Boolean(state.activeDialogueNode));
  const checkpoint = useGameStore((state) => state.checkpoint);
  const showControlHints = useSettingsStore((state) => state.showControlHints);

  const selectedTileId = inventoryTiles[selectedSlot] ?? null;
  const selectedTile = selectedTileId ? (TILE_CATALOG[selectedTileId] ?? null) : null;

  return (
    <footer className="ui-footer">
      {/* Controls Hint Bar */}
      {showControlHints && (
        <nav className="hint-bar" aria-label="Control hints">
          <div className="hint-item">
            <span className="key-cap">WASD</span> / <span className="key-cap">↑←↓→</span> Move Alice
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
        {!hasActiveDialogue && selectedTile && (
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
                className={`inventory-slot ${tile ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
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
  );
}

export default InventoryHUD;
