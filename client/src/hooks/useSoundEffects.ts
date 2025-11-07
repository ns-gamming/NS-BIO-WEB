import { useCallback, useRef, useEffect } from 'react';

export type SoundType = 
  | 'click' | 'hover' | 'success' | 'error' | 'notify' | 'swoosh' | 'pop'
  | 'shoot' | 'explosion' | 'powerup' | 'hit' | 'levelup' | 'gameover' | 'victory';

export type MusicType = 'menu' | 'gameplay' | 'boss' | 'victory';

export function useSoundEffects() {
  const audioRef = useRef<Map<SoundType, HTMLAudioElement>>(new Map());
  const musicRef = useRef<Map<MusicType, HTMLAudioElement>>(new Map());
  const enabledRef = useRef(true);
  const volumeRef = useRef(0.5);
  const musicVolumeRef = useRef(0.3);

  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, volume: number = 0.3) => {
    if (!enabledRef.current) return;

    try {
      const context = initAudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(volume * volumeRef.current, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + duration);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }, [initAudioContext]);

  const playSound = useCallback((type: SoundType) => {
    if (!enabledRef.current) return;

    switch (type) {
      case 'click':
        playTone(800, 0.1, 0.3);
        break;
      case 'hover':
        playTone(600, 0.05, 0.15);
        break;
      case 'success':
        playTone(523.25, 0.1, 0.25);
        setTimeout(() => playTone(659.25, 0.1, 0.25), 100);
        setTimeout(() => playTone(783.99, 0.15, 0.25), 200);
        break;
      case 'error':
        playTone(200, 0.2, 0.35);
        playTone(180, 0.3, 0.35);
        break;
      case 'notify':
        playTone(1000, 0.1, 0.2);
        setTimeout(() => playTone(1200, 0.1, 0.2), 100);
        break;
      case 'swoosh':
        for (let i = 0; i < 12; i++) {
          setTimeout(() => playTone(400 + i * 60, 0.05, 0.15), i * 18);
        }
        break;
      case 'pop':
        playTone(1200, 0.05, 0.25);
        setTimeout(() => playTone(1000, 0.03, 0.2), 50);
        break;
      case 'shoot':
        playTone(800, 0.05, 0.4);
        setTimeout(() => playTone(600, 0.05, 0.3), 30);
        setTimeout(() => playTone(400, 0.05, 0.2), 60);
        break;
      case 'explosion':
        playTone(100, 0.3, 0.5);
        setTimeout(() => playTone(80, 0.4, 0.5), 50);
        setTimeout(() => playTone(60, 0.5, 0.4), 150);
        for (let i = 0; i < 8; i++) {
          setTimeout(() => playTone(200 + Math.random() * 100, 0.1, 0.3), i * 50);
        }
        break;
      case 'powerup':
        for (let i = 0; i < 5; i++) {
          setTimeout(() => playTone(400 + i * 200, 0.1, 0.25), i * 80);
        }
        break;
      case 'hit':
        playTone(300, 0.08, 0.4);
        setTimeout(() => playTone(250, 0.08, 0.3), 40);
        break;
      case 'levelup':
        for (let i = 0; i < 6; i++) {
          setTimeout(() => playTone(523.25 + i * 100, 0.15, 0.3), i * 120);
        }
        break;
      case 'gameover':
        playTone(400, 0.2, 0.3);
        setTimeout(() => playTone(350, 0.2, 0.3), 200);
        setTimeout(() => playTone(300, 0.3, 0.3), 400);
        setTimeout(() => playTone(250, 0.4, 0.3), 650);
        break;
      case 'victory':
        const victoryNotes = [523.25, 587.33, 659.25, 783.99, 880.00, 987.77];
        victoryNotes.forEach((note, i) => {
          setTimeout(() => playTone(note, 0.2, 0.3), i * 150);
        });
        break;
    }
  }, [playTone]);

  const playMusic = useCallback((type: MusicType, loop: boolean = true) => {
    if (!enabledRef.current) return;

    musicRef.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  const stopMusic = useCallback(() => {
    musicRef.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  const toggleSound = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    if (!enabledRef.current) {
      stopMusic();
    }
    return enabledRef.current;
  }, [stopMusic]);

  const setVolume = useCallback((volume: number) => {
    volumeRef.current = Math.max(0, Math.min(1, volume));
  }, []);

  const setMusicVolume = useCallback((volume: number) => {
    musicVolumeRef.current = Math.max(0, Math.min(1, volume));
    musicRef.current.forEach(audio => {
      audio.volume = musicVolumeRef.current;
    });
  }, []);

  return {
    playSound,
    playMusic,
    stopMusic,
    toggleSound,
    setVolume,
    setMusicVolume,
    isEnabled: () => enabledRef.current,
    getVolume: () => volumeRef.current,
    getMusicVolume: () => musicVolumeRef.current
  };
}
