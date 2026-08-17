import { useGameStore } from '../../state/gameStore';
import { getSceneDefinition } from '../../world/scenes/sceneRegistry';

interface HeaderHUDProps {
  onToggleSettings: () => void;
}

export function HeaderHUD({ onToggleSettings }: HeaderHUDProps) {
  // Narrow reactive selectors
  const currentScene = useGameStore((state) => state.currentScene);
  const memoryFragments = useGameStore((state) => state.memoryFragments);
  const memoryReconstructed = useGameStore((state) => state.memoryReconstructed);
  const toggleHintModal = useGameStore((state) => state.toggleHintModal);

  // Status badge reactive selectors (eliminates non-reactive getState() reads in render)
  const verticalSliceCompleted = useGameStore((state) => state.verticalSliceCompleted);
  const dealerPhase = useGameStore((state) => state.dealerPhase);
  const deadHandInvalidated = useGameStore((state) => state.deadHandInvalidated);
  const discardPassageChoice = useGameStore((state) => state.discardPassageChoice);
  const sameDoorPairActive = useGameStore((state) => state.sameDoorPairActive);

  const sceneDef = getSceneDefinition(currentScene);

  // Compute status text purely and reactively
  let statusText = 'Phase 1: Rain Alley Slice';
  if (currentScene === 'boss_court') {
    if (verticalSliceCompleted) {
      statusText = 'Phase 7: Trial Shattered (Victory)';
    } else if (dealerPhase === 'forced_hand') {
      statusText = 'Phase 7: The Final Hand (Ron)';
    } else if (dealerPhase === 'wind_south') {
      statusText = 'Phase 7: Wind of the South';
    } else if (dealerPhase === 'wind_east') {
      statusText = 'Phase 7: Wind of the East';
    } else {
      statusText = 'Phase 7: Dealer’s Court';
    }
  } else if (currentScene === 'dead_hand') {
    statusText = deadHandInvalidated
      ? 'Phase 6: Dead Hand Declared (Stasis Lock)'
      : 'Phase 6: Watcher Encounter';
  } else if (currentScene === 'discard_passage') {
    if (discardPassageChoice === 'archivist') {
      statusText = 'Phase 5: Scholar’s Ascent (West Unlocked)';
    } else if (discardPassageChoice === 'regent') {
      statusText = 'Phase 5: Martial Passage (East Unlocked)';
    } else {
      statusText = 'Phase 5: Discard Consequence';
    }
  } else if (currentScene === 'memory_room') {
    statusText = memoryReconstructed
      ? 'Phase 4: Memory Reconstructed'
      : 'Phase 4: Memory Sanctuary';
  } else if (currentScene === 'east_arcade') {
    statusText = sameDoorPairActive
      ? 'Phase 3: Impossible Space Gate'
      : 'Phase 2: Mahjong Sequence Gate';
  }

  return (
    <header className="ui-header">
      <div className="title-group">
        <h1 className="game-title">THROUGH THE JADE WALL</h1>
        <span className="game-subtitle">{sceneDef.actTitle}</span>
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
          <span>{statusText}</span>
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
          onClick={onToggleSettings}
          aria-label="Open Settings"
          title="Settings"
        >
          Settings
        </button>
      </div>
    </header>
  );
}

export default HeaderHUD;
