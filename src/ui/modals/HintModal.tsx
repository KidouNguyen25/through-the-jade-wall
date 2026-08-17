import { useGameStore } from '../../state/gameStore';

export function HintModal() {
  const hintModalOpen = useGameStore((state) => state.hintModalOpen);
  const activeHintLevel = useGameStore((state) => state.activeHintLevel);
  const currentScene = useGameStore((state) => state.currentScene);
  const setHintLevel = useGameStore((state) => state.setHintLevel);
  const toggleHintModal = useGameStore((state) => state.toggleHintModal);

  if (!hintModalOpen) return null;

  return (
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
              <button className="btn-hint-expand" onClick={() => setHintLevel(activeHintLevel + 1)}>
                Request Deeper Insight (Layer {activeHintLevel + 1})
              </button>
            ) : (
              <span className="hint-max-reached">Maximum insight reached</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HintModal;
