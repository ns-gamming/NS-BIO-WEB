import { useCallback, useRef } from 'react';

export type SoundType = 'click' | 'hover' | 'success' | 'error' | 'notify' | 'swoosh' | 'pop';

const soundUrls: Record<SoundType, string> = {
  click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBz/LZiTYIG2m98OScTgwOU6rk7q1hGQc2j9Xy0YA1ByZ+zPDZjT0JFmS56+qfUQ4LRpzj8r1qHgUsgs/y2Ig2CBtpvO/knE4MDFOq5O6tYBgHNo/W8tOANQckf8vw240+CRVkuuvqnlIMC0ac4/K9ah4FLIHo8tiJNgkbabzv5ZxODAxTquTurWAYBzaP1fLTgDUHJH/L8NuNPgkVZLrr6p5SDAo=',
  hover: 'data:audio/wav;base64,UklGRnQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVAAAAA/QEBAPz5APkA+QEA/Pj4+Pz4+Pj8+Pz4+Pz4/Pz8+Pj4/Pj8+Pz4/Pz4+Pj4+Pz4+Pj4+Pz4/Pj4+Pz4+Pj4/Pj8+Pz4/',
  success: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
  error: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
  notify: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
  swoosh: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
  pop: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='
};

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

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

      gainNode.gain.setValueAtTime(volume, context.currentTime);
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
        playTone(800, 0.1, 0.2);
        break;
      case 'hover':
        playTone(600, 0.05, 0.1);
        break;
      case 'success':
        playTone(523.25, 0.1, 0.2);
        setTimeout(() => playTone(659.25, 0.1, 0.2), 100);
        setTimeout(() => playTone(783.99, 0.15, 0.2), 200);
        break;
      case 'error':
        playTone(200, 0.2, 0.3);
        break;
      case 'notify':
        playTone(1000, 0.1, 0.15);
        setTimeout(() => playTone(1200, 0.1, 0.15), 100);
        break;
      case 'swoosh':
        for (let i = 0; i < 10; i++) {
          setTimeout(() => playTone(400 + i * 50, 0.05, 0.1), i * 20);
        }
        break;
      case 'pop':
        playTone(1200, 0.05, 0.2);
        break;
    }
  }, [playTone]);

  const toggleSound = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    return enabledRef.current;
  }, []);

  return {
    playSound,
    toggleSound,
    isEnabled: () => enabledRef.current
  };
}
