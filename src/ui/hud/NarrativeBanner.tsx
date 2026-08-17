import { useGameStore } from '../../state/gameStore';

export function NarrativeBanner() {
  const narrativeMessage = useGameStore((state) => state.narrativeMessage);

  if (!narrativeMessage) return null;

  return (
    <aside className="narrative-banner" role="status">
      <p className="narrative-text">{narrativeMessage}</p>
    </aside>
  );
}

export default NarrativeBanner;
