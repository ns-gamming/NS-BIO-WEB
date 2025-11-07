export interface PlayerProgress {
  currentLevel: number;
  unlockedLevels: number[];
  coins: number;
  upgrades: {
    weaponDamage: number;
    fireRate: number;
    shipSpeed: number;
    maxShield: number;
  };
  bestScores: Record<number, number>;
  achievements: string[];
  settings: {
    volume: number;
    musicEnabled: boolean;
    sfxEnabled: boolean;
    quality: 'low' | 'medium' | 'high';
  };
}

export interface LevelStats {
  score: number;
  enemiesDestroyed: number;
  damageT aken: number;
  maxCombo: number;
  powerUpsCollected: number;
  timeElapsed: number;
}

const DEFAULT_PROGRESS: PlayerProgress = {
  currentLevel: 1,
  unlockedLevels: [1],
  coins: 0,
  upgrades: {
    weaponDamage: 1,
    fireRate: 1,
    shipSpeed: 1,
    maxShield: 1,
  },
  bestScores: {},
  achievements: [],
  settings: {
    volume: 0.7,
    musicEnabled: true,
    sfxEnabled: true,
    quality: 'high',
  },
};

export class GameProgressService {
  private static STORAGE_KEY = 'space_shooter_progress';

  static loadProgress(): PlayerProgress {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const progress = JSON.parse(saved);
        return { ...DEFAULT_PROGRESS, ...progress };
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
    return { ...DEFAULT_PROGRESS };
  }

  static saveProgress(progress: PlayerProgress): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  static unlockLevel(progress: PlayerProgress, level: number): PlayerProgress {
    if (!progress.unlockedLevels.includes(level)) {
      progress.unlockedLevels.push(level);
      progress.unlockedLevels.sort((a, b) => a - b);
    }
    return progress;
  }

  static updateBestScore(progress: PlayerProgress, level: number, score: number): PlayerProgress {
    const currentBest = progress.bestScores[level] || 0;
    if (score > currentBest) {
      progress.bestScores[level] = score;
    }
    return progress;
  }

  static addCoins(progress: PlayerProgress, amount: number): PlayerProgress {
    progress.coins += amount;
    return progress;
  }

  static purchaseUpgrade(
    progress: PlayerProgress,
    upgrade: keyof PlayerProgress['upgrades'],
    cost: number
  ): PlayerProgress | null {
    if (progress.coins >= cost && progress.upgrades[upgrade] < 10) {
      progress.coins -= cost;
      progress.upgrades[upgrade] += 1;
      return progress;
    }
    return null;
  }

  static unlockAchievement(progress: PlayerProgress, achievementId: string): PlayerProgress {
    if (!progress.achievements.includes(achievementId)) {
      progress.achievements.push(achievementId);
    }
    return progress;
  }

  static updateSettings(
    progress: PlayerProgress,
    settings: Partial<PlayerProgress['settings']>
  ): PlayerProgress {
    progress.settings = { ...progress.settings, ...settings };
    return progress;
  }

  static resetProgress(): PlayerProgress {
    const fresh = { ...DEFAULT_PROGRESS };
    this.saveProgress(fresh);
    return fresh;
  }

  static getUpgradeCost(currentLevel: number): number {
    return Math.floor(100 * Math.pow(1.5, currentLevel - 1));
  }

  static getTotalUpgradeValue(progress: PlayerProgress): number {
    const { weaponDamage, fireRate, shipSpeed, maxShield } = progress.upgrades;
    return weaponDamage + fireRate + shipSpeed + maxShield;
  }
}

export const ACHIEVEMENTS = [
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Destroy your first enemy',
    icon: '🎯',
  },
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'Complete a level without taking damage',
    icon: '🛡️',
  },
  {
    id: 'combo_master',
    name: 'Combo Master',
    description: 'Achieve a 10x combo',
    icon: '🔥',
  },
  {
    id: 'boss_slayer',
    name: 'Boss Slayer',
    description: 'Defeat your first boss',
    icon: '👑',
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Complete all 10 levels',
    icon: '⭐',
  },
  {
    id: 'coin_collector',
    name: 'Coin Collector',
    description: 'Collect 1000 coins',
    icon: '💰',
  },
  {
    id: 'fully_upgraded',
    name: 'Fully Upgraded',
    description: 'Max out all upgrades',
    icon: '⚡',
  },
  {
    id: 'speed_runner',
    name: 'Speed Runner',
    description: 'Complete a level in under 60 seconds',
    icon: '⏱️',
  },
];

export const LEVELS = [
  {
    id: 1,
    name: 'Training Ground',
    objective: 'Destroy 10 enemies',
    enemyCount: 10,
    bossLevel: false,
    difficulty: 1,
  },
  {
    id: 2,
    name: 'Asteroid Field',
    objective: 'Survive 90 seconds',
    enemyCount: 15,
    bossLevel: false,
    difficulty: 1.2,
  },
  {
    id: 3,
    name: 'Scout Ambush',
    objective: 'Destroy 20 enemies',
    enemyCount: 20,
    bossLevel: false,
    difficulty: 1.5,
  },
  {
    id: 4,
    name: 'First Boss',
    objective: 'Defeat the Guardian',
    enemyCount: 1,
    bossLevel: true,
    difficulty: 2,
  },
  {
    id: 5,
    name: 'Deep Space',
    objective: 'Destroy 25 enemies',
    enemyCount: 25,
    bossLevel: false,
    difficulty: 2,
  },
  {
    id: 6,
    name: 'Fighter Squadron',
    objective: 'Destroy 30 enemies',
    enemyCount: 30,
    bossLevel: false,
    difficulty: 2.5,
  },
  {
    id: 7,
    name: 'Nebula Chaos',
    objective: 'Survive 120 seconds',
    enemyCount: 35,
    bossLevel: false,
    difficulty: 3,
  },
  {
    id: 8,
    name: 'Second Boss',
    objective: 'Defeat the Destroyer',
    enemyCount: 1,
    bossLevel: true,
    difficulty: 3.5,
  },
  {
    id: 9,
    name: 'Final Assault',
    objective: 'Destroy 40 enemies',
    enemyCount: 40,
    bossLevel: false,
    difficulty: 4,
  },
  {
    id: 10,
    name: 'Ultimate Challenge',
    objective: 'Defeat the final boss',
    enemyCount: 1,
    bossLevel: true,
    difficulty: 5,
  },
];
