import { useGameStore } from '../../state/gameStore';

export function VictoryModal() {
  const victoryModalOpen = useGameStore((state) => state.victoryModalOpen);
  const closeVictoryModal = useGameStore((state) => state.closeVictoryModal);
  const resetGame = useGameStore((state) => state.resetGame);

  if (!victoryModalOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={closeVictoryModal}
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
            onClick={closeVictoryModal}
            style={{ background: '#059669', color: '#ffffff', padding: '0.6rem 1.4rem' }}
          >
            Continue Exploring
          </button>
          <button
            className="btn-secondary"
            onClick={resetGame}
            style={{ padding: '0.6rem 1.4rem' }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default VictoryModal;
