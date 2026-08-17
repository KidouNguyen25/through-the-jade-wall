import { useGameStore } from '../../state/gameStore';

export function InteractionPromptOverlay() {
  const activeInteractable = useGameStore((state) => state.activeInteractable);
  const hasActiveDialogue = useGameStore((state) => Boolean(state.activeDialogueNode));

  if (!activeInteractable || hasActiveDialogue) return null;

  const handlePromptClick = () => {
    window.dispatchEvent(
      new CustomEvent('ttjw-interact', { detail: { id: activeInteractable.id } }),
    );
  };

  return (
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
  );
}

export default InteractionPromptOverlay;
