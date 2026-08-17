import { useSettingsStore } from '../../state/settingsStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const masterVolume = useSettingsStore((state) => state.masterVolume);
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);
  const highContrastIndicator = useSettingsStore((state) => state.highContrastIndicator);
  const showControlHints = useSettingsStore((state) => state.showControlHints);

  const setMasterVolume = useSettingsStore((state) => state.setMasterVolume);
  const setReducedMotion = useSettingsStore((state) => state.setReducedMotion);
  const setHighContrastIndicator = useSettingsStore((state) => state.setHighContrastIndicator);
  const setShowControlHints = useSettingsStore((state) => state.setShowControlHints);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="settings-title" className="modal-title">
            Preferences & Accessibility
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close settings modal">
            ✕
          </button>
        </div>

        <div className="setting-row">
          <label htmlFor="volume-slider" className="setting-label">
            Master Volume ({Math.round(masterVolume * 100)}%)
          </label>
          <div className="setting-control">
            <input
              id="volume-slider"
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
          <label htmlFor="reduced-motion-toggle" className="setting-label">
            Reduced Motion (Reduce camera drift)
          </label>
          <div className="setting-control">
            <input
              id="reduced-motion-toggle"
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
            />
          </div>
        </div>

        <div className="setting-row">
          <label htmlFor="high-contrast-toggle" className="setting-label">
            High Contrast Indicator
          </label>
          <div className="setting-control">
            <input
              id="high-contrast-toggle"
              type="checkbox"
              checked={highContrastIndicator}
              onChange={(e) => setHighContrastIndicator(e.target.checked)}
            />
          </div>
        </div>

        <div className="setting-row">
          <label htmlFor="control-hints-toggle" className="setting-label">
            Show On-Screen Control Hints
          </label>
          <div className="setting-control">
            <input
              id="control-hints-toggle"
              type="checkbox"
              checked={showControlHints}
              onChange={(e) => setShowControlHints(e.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
