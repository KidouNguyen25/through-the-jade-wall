import { useGameStore } from '../../state/gameStore';

export function DialogueOverlay() {
  const activeDialogueNode = useGameStore((state) => state.activeDialogueNode);
  const advanceDialogue = useGameStore((state) => state.advanceDialogue);
  const closeDialogue = useGameStore((state) => state.closeDialogue);

  if (!activeDialogueNode) return null;

  return (
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
              className={`speaker-badge speaker-${activeDialogueNode.speaker
                .toLowerCase()
                .replace(/\s+/g, '-')}`}
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
  );
}

export default DialogueOverlay;
