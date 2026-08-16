import { describe, it, expect, beforeEach } from 'vitest';
import { audioEngine } from '../audio/audioEngine';

describe('AudioEngine procedural sound system', () => {
  beforeEach(() => {
    audioEngine.setMuted(false);
  });

  it('handles playTileInteractSound without throwing in test environment', () => {
    expect(() => audioEngine.playTileInteractSound(0.8)).not.toThrow();
  });

  it('handles playGateShiftSound without throwing in test environment', () => {
    expect(() => audioEngine.playGateShiftSound(0.5)).not.toThrow();
  });

  it('handles playMemoryHologramSound without throwing in test environment', () => {
    expect(() => audioEngine.playMemoryHologramSound(0.6)).not.toThrow();
  });

  it('handles playChomboGongSound without throwing in test environment', () => {
    expect(() => audioEngine.playChomboGongSound(0.9)).not.toThrow();
  });

  it('handles playClimaxShatterSound without throwing in test environment', () => {
    expect(() => audioEngine.playClimaxShatterSound(1.0)).not.toThrow();
  });

  it('respects muted state and zero volume gracefully', () => {
    audioEngine.setMuted(true);
    expect(() => audioEngine.playTileInteractSound(0.5)).not.toThrow();
    expect(() => audioEngine.playTileInteractSound(0)).not.toThrow();
  });
});
