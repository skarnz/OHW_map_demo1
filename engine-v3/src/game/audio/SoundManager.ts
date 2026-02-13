import { Platform } from 'react-native';

type SoundName = 'tap' | 'walk' | 'celebrate' | 'transition' | 'complete';

const SOUND_VOLUME: Record<SoundName, number> = {
  tap: 0.3,
  walk: 0.2,
  celebrate: 0.5,
  transition: 0.3,
  complete: 0.6,
};

// Dynamically require assets so the module still loads even if
// expo-audio is unavailable (e.g. during smoke tests on Node).
const SOUND_ASSETS: Record<SoundName, ReturnType<typeof require>> = {
  tap: require('../../assets/audio/tap.mp3'),
  walk: require('../../assets/audio/walk.mp3'),
  celebrate: require('../../assets/audio/celebrate.mp3'),
  transition: require('../../assets/audio/transition.mp3'),
  complete: require('../../assets/audio/complete.mp3'),
};

interface AudioPlayerLike {
  volume: number;
  seekTo: (ms: number) => void;
  play: () => void;
  remove: () => void;
}

export class SoundManager {
  private static instance: SoundManager | null = null;
  private enabled = true;
  private initialized = false;
  private players = new Map<SoundName, AudioPlayerLike>();

  static shared(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  async init() {
    if (this.initialized) return;
    this.initialized = true;

    // expo-audio's createAudioPlayer may not work on web or in
    // test environments. Guard the import and skip gracefully.
    if (Platform.OS === 'web') return;

    let createAudioPlayer: ((source: unknown) => AudioPlayerLike) | null = null;
    try {
      const mod = require('expo-audio');
      createAudioPlayer = mod.createAudioPlayer;
    } catch {
      return; // expo-audio not available
    }
    if (!createAudioPlayer) return;

    for (const [name, source] of Object.entries(SOUND_ASSETS) as [SoundName, ReturnType<typeof require>][]) {
      try {
        const player = createAudioPlayer(source);
        player.volume = SOUND_VOLUME[name];
        this.players.set(name, player);
      } catch (err) {
        console.warn(`Failed to load sound: ${name}`, err);
      }
    }
  }

  play(name: SoundName) {
    if (!this.enabled || !this.initialized) return;

    const player = this.players.get(name);
    if (!player) return;

    try {
      player.seekTo(0);
      player.play();
    } catch {
      // Audio is non-critical; swallow errors silently.
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  destroy() {
    for (const player of this.players.values()) {
      try {
        player.remove();
      } catch {
        // ignore
      }
    }
    this.players.clear();
    this.initialized = false;
    SoundManager.instance = null;
  }
}
