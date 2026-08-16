/**
 * Through the Jade Wall - Procedural Web Audio Synthesizer
 * Zero-asset, fully procedural browser audio engine using Web Audio API.
 * Generates crisp ceramic tile clicks, deep stone grinding, crystalline memory shimmers,
 * metallic invalidation gongs, and ethereal climax chords.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  /**
   * Ceramic tile interact / click sound
   * Crisp, high-frequency decaying resonance imitating hard ivory / jade stone
   */
  public playTileInteractSound(volume: number = 0.5) {
    if (this.isMuted || volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

      gain.gain.setValueAtTime(volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignore audio context errors in headless environments
    }
  }

  /**
   * Stone mechanism / heavy gate shifting rumble
   */
  public playGateShiftSound(volume: number = 0.5) {
    if (this.isMuted || volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.6);

      gain.gain.setValueAtTime(volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // Fallback for headless test environments
    }
  }

  /**
   * Crystalline memory fragment hologram shimmer
   */
  public playMemoryHologramSound(volume: number = 0.5) {
    if (this.isMuted || volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const frequencies = [587.33, 880.0, 1174.66, 1760.0]; // D5, A5, D6, A6

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(volume * 0.15, now + idx * 0.06 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.5);
      });
    } catch {
      // Fallback for headless test environments
    }
  }

  /**
   * Metallic Invalidation Gong (Chombo Declaration)
   */
  public playChomboGongSound(volume: number = 0.5) {
    if (this.isMuted || volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [185.0, 370.0, 740.0]; // F#3, F#4, F#5

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 1.2);

        gain.gain.setValueAtTime(volume * (0.3 / (i + 1)), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.2);
      });
    } catch {
      // Fallback for headless test environments
    }
  }

  /**
   * Ethereal Climax Premise Refusal & Shatter Chord
   */
  public playClimaxShatterSound(volume: number = 0.5) {
    if (this.isMuted || volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chords = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5]; // C major ascension

      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(volume * 0.12, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.4);
      });
    } catch {
      // Fallback for headless test environments
    }
  }
}

export const audioEngine = new AudioEngine();
export default audioEngine;
