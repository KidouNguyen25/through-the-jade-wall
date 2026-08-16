import { create } from 'zustand';

export interface SettingsState {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  subtitles: boolean;
  reducedMotion: boolean;
  highContrastIndicator: boolean;
  showControlHints: boolean;

  // Actions
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setSubtitles: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setHighContrastIndicator: (enabled: boolean) => void;
  setShowControlHints: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  masterVolume: 0.8,
  musicVolume: 0.7,
  sfxVolume: 0.8,
  subtitles: true,
  reducedMotion: false,
  highContrastIndicator: false,
  showControlHints: true,

  setMasterVolume: (masterVolume) => set({ masterVolume }),
  setMusicVolume: (musicVolume) => set({ musicVolume }),
  setSfxVolume: (sfxVolume) => set({ sfxVolume }),
  setSubtitles: (subtitles) => set({ subtitles }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setHighContrastIndicator: (highContrastIndicator) => set({ highContrastIndicator }),
  setShowControlHints: (showControlHints) => set({ showControlHints }),
}));
