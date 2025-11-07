
import { useCallback, useRef, useEffect } from 'react';

export type SoundType = 
  | 'click' | 'hover' | 'success' | 'error' | 'notify' | 'swoosh' | 'pop'
  | 'shoot' | 'explosion' | 'powerup' | 'hit' | 'levelup' | 'gameover' | 'victory'
  | 'buttonPress' | 'formSubmit' | 'achievement';

export type MusicType = 'menu' | 'gameplay' | 'boss' | 'victory';

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);
  const volumeRef = useRef(0.3); // Reduced default volume for better UX
  const musicVolumeRef = useRef(0.2);
  const lastPlayTimeRef = useRef<{ [key: string]: number }>({});

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Prevent sound spam - minimum time between same sounds
  const canPlaySound = useCallback((type: SoundType): boolean => {
    const now = Date.now();
    const lastPlay = lastPlayTimeRef.current[type] || 0;
    const minInterval = type === 'hover' ? 100 : 50; // Longer for hover sounds
    
    if (now - lastPlay < minInterval) {
      return false;
    }
    
    lastPlayTimeRef.current[type] = now;
    return true;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, volume: number = 0.2, waveType: OscillatorType = 'sine') => {
    if (!enabledRef.current) return;

    try {
      const context = initAudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      const filter = context.createBiquadFilter();

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = waveType;
      
      // Add filter for smoother sound
      filter.type = 'lowpass';
      filter.frequency.value = frequency * 2;

      // Smooth envelope to prevent clicks
      const now = context.currentTime;
      const attackTime = 0.01;
      const releaseTime = duration * 0.3;
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume * volumeRef.current, now + attackTime);
      gainNode.gain.setValueAtTime(volume * volumeRef.current, now + duration - releaseTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }, [initAudioContext]);

  const playSound = useCallback((type: SoundType) => {
    if (!enabledRef.current || !canPlaySound(type)) return;

    switch (type) {
      case 'click':
      case 'buttonPress':
        playTone(800, 0.08, 0.15, 'sine');
        setTimeout(() => playTone(1000, 0.05, 0.1, 'sine'), 30);
        break;
        
      case 'hover':
        playTone(600, 0.04, 0.08, 'sine');
        break;
        
      case 'success':
      case 'formSubmit':
        playTone(523.25, 0.08, 0.15, 'sine');
        setTimeout(() => playTone(659.25, 0.08, 0.15, 'sine'), 80);
        setTimeout(() => playTone(783.99, 0.12, 0.15, 'sine'), 160);
        break;
        
      case 'achievement':
        const achievementNotes = [440, 523.25, 659.25, 880];
        achievementNotes.forEach((note, i) => {
          setTimeout(() => playTone(note, 0.15, 0.2, 'triangle'), i * 100);
        });
        break;
        
      case 'error':
        playTone(200, 0.15, 0.2, 'square');
        setTimeout(() => playTone(150, 0.2, 0.15, 'square'), 100);
        break;
        
      case 'notify':
        playTone(1000, 0.08, 0.12, 'sine');
        setTimeout(() => playTone(1200, 0.08, 0.12, 'sine'), 80);
        break;
        
      case 'swoosh':
        for (let i = 0; i < 10; i++) {
          setTimeout(() => playTone(400 + i * 80, 0.04, 0.1, 'sine'), i * 15);
        }
        break;
        
      case 'pop':
        playTone(1200, 0.04, 0.15, 'sine');
        setTimeout(() => playTone(800, 0.03, 0.1, 'sine'), 40);
        break;
        
      case 'shoot':
        playTone(800, 0.04, 0.25, 'square');
        setTimeout(() => playTone(400, 0.04, 0.15, 'square'), 25);
        break;
        
      case 'explosion':
        playTone(100, 0.2, 0.3, 'sawtooth');
        setTimeout(() => playTone(80, 0.25, 0.25, 'sawtooth'), 50);
        for (let i = 0; i < 6; i++) {
          setTimeout(() => playTone(150 + Math.random() * 100, 0.08, 0.15, 'square'), i * 40);
        }
        break;
        
      case 'powerup':
        for (let i = 0; i < 5; i++) {
          setTimeout(() => playTone(400 + i * 150, 0.1, 0.15, 'triangle'), i * 70);
        }
        break;
        
      case 'hit':
        playTone(300, 0.06, 0.25, 'square');
        setTimeout(() => playTone(250, 0.06, 0.15, 'square'), 35);
        break;
        
      case 'levelup':
        const levelNotes = [523.25, 659.25, 783.99, 1046.50];
        levelNotes.forEach((note, i) => {
          setTimeout(() => playTone(note, 0.15, 0.2, 'triangle'), i * 100);
        });
        break;
        
      case 'gameover':
        playTone(400, 0.15, 0.2, 'triangle');
        setTimeout(() => playTone(350, 0.15, 0.2, 'triangle'), 150);
        setTimeout(() => playTone(300, 0.2, 0.2, 'triangle'), 300);
        setTimeout(() => playTone(250, 0.25, 0.2, 'triangle'), 500);
        break;
        
      case 'victory':
        const victoryNotes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
        victoryNotes.forEach((note, i) => {
          setTimeout(() => playTone(note, 0.18, 0.2, 'sine'), i * 120);
        });
        break;
    }
  }, [playTone, canPlaySound]);

  const playMusic = useCallback((type: MusicType, loop: boolean = true) => {
    // Music implementation can be added here
  }, []);

  const stopMusic = useCallback(() => {
    // Stop music implementation
  }, []);

  const toggleSound = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    return enabledRef.current;
  }, []);

  const setVolume = useCallback((volume: number) => {
    volumeRef.current = Math.max(0, Math.min(1, volume));
  }, []);

  const setMusicVolume = useCallback((volume: number) => {
    musicVolumeRef.current = Math.max(0, Math.min(1, volume));
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
