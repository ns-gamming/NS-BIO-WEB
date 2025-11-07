import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useLocation } from 'wouter';
import { ArrowLeft, Play, Pause, RotateCcw, Home, Volume2, VolumeX, Trophy } from 'lucide-react';
import PlayerShip from '../../components/game/PlayerShip';
import Enemy, { EnemyType } from '../../components/game/Enemy';
import Bullet, { BulletType } from '../../components/game/Bullet';
import PowerUp, { PowerUpType } from '../../components/game/PowerUp';
import StarField from '../../components/game/StarField';
import ParticleExplosion from '../../components/game/ParticleExplosion';
import EngineTrail from '../../components/game/EngineTrail';
import { useSoundEffects } from '../../hooks/useSoundEffects';

interface GameEntity {
  id: string;
  position: [number, number, number];
}

interface EnemyEntity extends GameEntity {
  type: EnemyType;
  health: number;
  maxHealth: number;
}

interface BulletEntity extends GameEntity {
  type: BulletType;
  fromPlayer: boolean;
  velocity: [number, number, number];
}

interface PowerUpEntity extends GameEntity {
  type: PowerUpType;
}

interface ExplosionEntity extends GameEntity {
  id: string;
  size: number;
  color: string;
}

const GAME_WIDTH = 20;
const GAME_HEIGHT = 30;

const LEVEL_CONFIG = [
  { level: 1, enemySpawnRate: 0.02, maxEnemies: 5, bossLevel: false },
  { level: 2, enemySpawnRate: 0.025, maxEnemies: 7, bossLevel: false },
  { level: 3, enemySpawnRate: 0.03, maxEnemies: 10, bossLevel: true },
  { level: 4, enemySpawnRate: 0.035, maxEnemies: 12, bossLevel: false },
  { level: 5, enemySpawnRate: 0.04, maxEnemies: 15, bossLevel: false },
  { level: 6, enemySpawnRate: 0.045, maxEnemies: 18, bossLevel: true },
  { level: 7, enemySpawnRate: 0.05, maxEnemies: 20, bossLevel: false },
  { level: 8, enemySpawnRate: 0.055, maxEnemies: 22, bossLevel: false },
  { level: 9, enemySpawnRate: 0.06, maxEnemies: 25, bossLevel: true },
  { level: 10, enemySpawnRate: 0.07, maxEnemies: 30, bossLevel: true },
];

function GameScene({ 
  playerPos, 
  enemies, 
  bullets, 
  powerUps,
  explosions,
  playerHealth,
  maxHealth,
  shieldActive,
  level
}: {
  playerPos: [number, number, number];
  enemies: EnemyEntity[];
  bullets: BulletEntity[];
  powerUps: PowerUpEntity[];
  explosions: ExplosionEntity[];
  playerHealth: number;
  maxHealth: number;
  shieldActive: boolean;
  level: number;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, -10, 25);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 10, 10]} intensity={1.5} color="#ffffff" />
      <fog attach="fog" args={['#000033', 20, 60]} />

      <StarField count={Math.min(1200, 800 + level * 40)} speed={0.3 + level * 0.05} />

      <PlayerShip 
        position={playerPos} 
        health={playerHealth}
        maxHealth={maxHealth}
        shieldActive={shieldActive}
      />

      <EngineTrail position={[playerPos[0], playerPos[1] - 1, playerPos[2]]} color="#ff6600" intensity={1.5} />

      {enemies.map(enemy => (
        <Enemy
          key={enemy.id}
          id={enemy.id}
          position={enemy.position}
          type={enemy.type}
          health={enemy.health}
          maxHealth={enemy.maxHealth}
        />
      ))}

      {bullets.map(bullet => (
        <Bullet
          key={bullet.id}
          id={bullet.id}
          position={bullet.position}
          type={bullet.type}
          fromPlayer={bullet.fromPlayer}
        />
      ))}

      {powerUps.map(powerUp => (
        <PowerUp
          key={powerUp.id}
          id={powerUp.id}
          position={powerUp.position}
          type={powerUp.type}
        />
      ))}

      {explosions.map(explosion => (
        <ParticleExplosion
          key={explosion.id}
          position={explosion.position}
          count={40}
          color={explosion.color}
          size={explosion.size}
          duration={800}
        />
      ))}

      <gridHelper args={[60, 60, '#00ffff', '#003355']} position={[0, 0, -5]} />
    </>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 mb-4">WebGL context error. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function SpaceShooterEnhanced() {
  const [, navigate] = useLocation();
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver' | 'levelComplete' | 'victory'>('menu');
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, -10, 0]);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [maxHealth] = useState(100);
  const [shieldActive, setShieldActive] = useState(false);
  const [score, setScore] = useState(0);
  const [enemies, setEnemies] = useState<EnemyEntity[]>([]);
  const [bullets, setBullets] = useState<BulletEntity[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUpEntity[]>([]);
  const [explosions, setExplosions] = useState<ExplosionEntity[]>([]);
  const [level, setLevel] = useState(1);
  const [rapidFire, setRapidFire] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bossSpawned, setBossSpawned] = useState(false);

  const { playSound } = useSoundEffects();
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastShotTime = useRef(0);

  const getCurrentLevelConfig = () => {
    return LEVEL_CONFIG[Math.min(level - 1, LEVEL_CONFIG.length - 1)] || LEVEL_CONFIG[LEVEL_CONFIG.length - 1];
  };

  const startGame = () => {
    setGameState('playing');
    setPlayerPos([0, -10, 0]);
    setPlayerHealth(100);
    setScore(0);
    setEnemies([]);
    setBullets([]);
    setPowerUps([]);
    setExplosions([]);
    setLevel(1);
    setShieldActive(false);
    setRapidFire(false);
    setCombo(0);
    setBossSpawned(false);
    if (soundEnabled) playSound('notify');
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    setEnemies([]);
    setBullets([]);
    setPowerUps([]);
    setExplosions([]);
    setBossSpawned(false);
    setGameState('playing');
    setPlayerHealth(Math.min(maxHealth, playerHealth + 30));
    if (soundEnabled) playSound('levelup');
  };

  const spawnEnemy = () => {
    const levelConfig = getCurrentLevelConfig();

    if (levelConfig.bossLevel && !bossSpawned && enemies.length === 0) {
      const health = 300 + level * 50;
      setBossSpawned(true);
      setEnemies([{
        id: `boss-${Date.now()}`,
        position: [0, GAME_HEIGHT / 2, 0],
        type: 'boss',
        health,
        maxHealth: health
      }]);
      if (soundEnabled) playSound('notify');
      return;
    }

    if (enemies.length >= levelConfig.maxEnemies) return;

    const types: EnemyType[] = level > 1 ? ['scout', 'fighter'] : ['scout'];
    const weights = level > 1 ? [0.65, 0.35] : [1.0];

    const rand = Math.random();
    let type: EnemyType = 'scout';
    let cumWeight = 0;

    for (let i = 0; i < types.length; i++) {
      cumWeight += weights[i];
      if (rand < cumWeight) {
        type = types[i];
        break;
      }
    }

    const maxHealthMap = { 
      scout: 20 + level * 5, 
      fighter: 50 + level * 10, 
      boss: 200 + level * 30 
    };
    const health = maxHealthMap[type];

    setEnemies(prev => [...prev, {
      id: `enemy-${Date.now()}-${Math.random()}`,
      position: [
        (Math.random() - 0.5) * GAME_WIDTH,
        GAME_HEIGHT / 2,
        0
      ],
      type,
      health,
      maxHealth: health
    }]);
  };

  const spawnPowerUp = () => {
    const types: PowerUpType[] = ['health', 'shield', 'rapidfire', 'coins'];
    const type = types[Math.floor(Math.random() * types.length)];

    setPowerUps(prev => [...prev, {
      id: `powerup-${Date.now()}`,
      position: [
        (Math.random() - 0.5) * GAME_WIDTH,
        GAME_HEIGHT / 2,
        0
      ],
      type
    }]);
  };

  const createExplosion = (position: [number, number, number], size: number = 0.3, color: string = '#ff6600') => {
    setExplosions(prev => [...prev, {
      id: `explosion-${Date.now()}-${Math.random()}`,
      position,
      size,
      color
    }]);

    setTimeout(() => {
      setExplosions(prev => prev.slice(1));
    }, 1000);
  };

  const shoot = () => {
    if (gameState !== 'playing') return;

    const now = Date.now();
    const fireRate = rapidFire ? 100 : 200;
    if (now - lastShotTime.current < fireRate) return;
    lastShotTime.current = now;

    if (soundEnabled) playSound('shoot');

    const newBullets: BulletEntity[] = [{
      id: `bullet-${Date.now()}-${Math.random()}`,
      position: [playerPos[0], playerPos[1] + 1, playerPos[2]],
      type: 'laser',
      fromPlayer: true,
      velocity: [0, 2.5, 0]
    }];

    if (rapidFire) {
      newBullets.push({
        id: `bullet-${Date.now()}-${Math.random()}-left`,
        position: [playerPos[0] - 0.5, playerPos[1] + 1, playerPos[2]],
        type: 'laser',
        fromPlayer: true,
        velocity: [-0.3, 2.5, 0]
      });
      newBullets.push({
        id: `bullet-${Date.now()}-${Math.random()}-right`,
        position: [playerPos[0] + 0.5, playerPos[1] + 1, playerPos[2]],
        type: 'laser',
        fromPlayer: true,
        velocity: [0.3, 2.5, 0]
      });
    }

    setBullets(prev => [...prev, ...newBullets]);
  };

  const handleMove = (dx: number, dy: number) => {
    setPlayerPos(prev => {
      const newX = Math.max(-GAME_WIDTH / 2, Math.min(GAME_WIDTH / 2, prev[0] + dx));
      const newY = Math.max(-GAME_HEIGHT / 2, Math.min(-5, prev[1] + dy));
      return [newX, newY, prev[2]];
    });
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const speed = 0.6;
      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          handleMove(-speed, 0);
          break;
        case 'arrowright':
        case 'd':
          handleMove(speed, 0);
          break;
        case 'arrowup':
        case 'w':
          handleMove(0, speed);
          break;
        case 'arrowdown':
        case 's':
          handleMove(0, -speed);
          break;
        case ' ':
          e.preventDefault();
          shoot();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, playerPos, rapidFire]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setBullets(prev => prev
        .map(b => ({
          ...b,
          position: [
            b.position[0] + b.velocity[0] * 0.1,
            b.position[1] + b.velocity[1] * 0.1,
            b.position[2] + b.velocity[2] * 0.1
          ] as [number, number, number]
        }))
        .filter(b => Math.abs(b.position[1]) < GAME_HEIGHT && Math.abs(b.position[0]) < GAME_WIDTH)
      );

      setEnemies(prev => prev
        .map(e => ({
          ...e,
          position: [e.position[0], e.position[1] - (e.type === 'boss' ? 0.05 : 0.12), e.position[2]] as [number, number, number]
        }))
        .filter(e => {
          if (e.position[1] < -GAME_HEIGHT / 2) {
            setPlayerHealth(h => Math.max(0, h - 10));
            return false;
          }
          return true;
        })
      );

      setPowerUps(prev => prev
        .map(p => ({
          ...p,
          position: [p.position[0], p.position[1] - 0.15, p.position[2]] as [number, number, number]
        }))
        .filter(p => p.position[1] > -GAME_HEIGHT / 2)
      );

      setBullets(prevBullets => {
        const remainingBullets = [...prevBullets];

        setEnemies(prevEnemies => {
          const remainingEnemies = [...prevEnemies];

          prevBullets.forEach((bullet, bIndex) => {
            if (!bullet.fromPlayer) return;

            prevEnemies.forEach((enemy, eIndex) => {
              if (remainingBullets[bIndex] === null || remainingEnemies[eIndex] === null) return;

              const dx = bullet.position[0] - enemy.position[0];
              const dy = bullet.position[1] - enemy.position[1];
              const distance = Math.sqrt(dx * dx + dy * dy);

              const hitRadius = enemy.type === 'boss' ? 1.8 : enemy.type === 'fighter' ? 0.8 : 0.6;

              if (distance < hitRadius) {
                remainingBullets[bIndex] = null as any;
                const damage = 15;
                remainingEnemies[eIndex] = {
                  ...enemy,
                  health: enemy.health - damage
                };

                if (soundEnabled) playSound('hit');
                createExplosion(bullet.position, 0.2, '#00ffff');

                if (remainingEnemies[eIndex].health <= 0) {
                  if (soundEnabled) playSound('explosion');
                  const points = enemy.type === 'boss' ? 500 : enemy.type === 'fighter' ? 100 : 50;
                  setScore(s => s + points * (1 + combo * 0.1));
                  setCombo(c => c + 1);
                  createExplosion(enemy.position, enemy.type === 'boss' ? 1.5 : 0.5, enemy.type === 'boss' ? '#aa00ff' : '#ff6600');
                  remainingEnemies[eIndex] = null as any;

                  if (Math.random() < 0.15) {
                    spawnPowerUp();
                  }
                }
              }
            });
          });

          return remainingEnemies.filter(e => e !== null);
        });

        return remainingBullets.filter(b => b !== null);
      });

      setPowerUps(prevPowerUps => {
        const remaining = [...prevPowerUps];

        prevPowerUps.forEach((powerUp, index) => {
          const dx = powerUp.position[0] - playerPos[0];
          const dy = powerUp.position[1] - playerPos[1];
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 1.2) {
            remaining[index] = null as any;

            if (soundEnabled) playSound('powerup');
            createExplosion(powerUp.position, 0.3, '#ffff00');

            switch (powerUp.type) {
              case 'health':
                setPlayerHealth(h => Math.min(maxHealth, h + 40));
                break;
              case 'shield':
                setShieldActive(true);
                setTimeout(() => setShieldActive(false), 7000);
                break;
              case 'rapidfire':
                setRapidFire(true);
                setTimeout(() => setRapidFire(false), 8000);
                break;
              case 'coins':
                setScore(s => s + 100);
                break;
            }
          }
        });

        return remaining.filter(p => p !== null);
      });

      const levelConfig = getCurrentLevelConfig();
      if (Math.random() < levelConfig.enemySpawnRate) {
        spawnEnemy();
      }

      if (Math.random() < 0.008) {
        spawnPowerUp();
      }

      if (rapidFire && Math.random() < 0.4) {
        shoot();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [gameState, playerPos, level, rapidFire, enemies, combo]);

  useEffect(() => {
    const levelConfig = getCurrentLevelConfig();
    if (levelConfig.bossLevel && bossSpawned && enemies.length === 0 && gameState === 'playing') {
      if (level >= 10) {
        setGameState('victory');
        if (soundEnabled) playSound('victory');
      } else {
        setGameState('levelComplete');
        if (soundEnabled) playSound('levelup');
      }
    }
  }, [enemies, gameState, level, bossSpawned]);

  useEffect(() => {
    const levelConfig = getCurrentLevelConfig();
    if (score > 0 && score % 1000 === 0 && !levelConfig.bossLevel && level < 10) {
        setGameState('levelComplete');
        if (soundEnabled) playSound('levelup');
    }
  }, [score]);

  useEffect(() => {
    if (playerHealth <= 0) {
      setGameState('gameOver');
      if (soundEnabled) playSound('gameover');
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [playerHealth]);

  useEffect(() => {
    const timeout = setTimeout(() => setCombo(0), 3000);
    return () => clearTimeout(timeout);
  }, [combo]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.touches[0];
    const dx = (touch.clientX - touchStartRef.current.x) * 0.05;
    const dy = -(touch.clientY - touchStartRef.current.y) * 0.05;

    handleMove(dx, dy);
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    shoot();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/games')}
            className="flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 hover:text-cyan-300 px-6 py-3 rounded-lg transition-all duration-300 border border-cyan-500/50 hover:border-cyan-400 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Games</span>
          </button>

          <button
            onClick={() => navigate('/games')}
            className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 hover:text-purple-300 px-6 py-3 rounded-lg transition-all duration-300 border border-purple-500/50 hover:border-purple-400 backdrop-blur-sm"
          >
            <Home className="w-5 h-5" />
            <span className="font-semibold">Games Hub</span>
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse">
          🚀 Space Shooter 3D - Enhanced Edition
        </h1>

        <div className="relative w-full max-w-4xl mx-auto aspect-[3/4] md:aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-cyan-500/30">
          {gameState === 'menu' && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/90 via-purple-900/30 to-black/90 backdrop-blur-md z-10">
              <div className="text-center space-y-6 p-8">
                <div className="animate-pulse mb-6">
                  <div className="text-7xl mb-4">🚀</div>
                </div>
                <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 animate-pulse">
                  Space Shooter 3D
                </h2>
                <p className="text-2xl text-gray-300 mb-2 font-semibold">Enhanced Edition</p>
                <p className="text-lg text-cyan-400 mb-8">10 Epic Levels • Boss Battles • Advanced Graphics</p>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-5 rounded-xl text-2xl font-bold transition-all transform hover:scale-110 flex items-center gap-3 mx-auto shadow-2xl shadow-cyan-500/50 border-2 border-cyan-400/50"
                >
                  <Play className="w-8 h-8" />
                  Start Game
                </button>
                {highScore > 0 && (
                  <div className="mt-6 bg-black/50 backdrop-blur-sm p-4 rounded-xl border border-yellow-500/30">
                    <p className="text-yellow-400 font-bold text-xl">🏆 High Score: {highScore}</p>
                  </div>
                )}
                <div className="mt-10 bg-black/50 backdrop-blur-sm p-6 rounded-xl max-w-md mx-auto border border-cyan-500/30">
                  <h3 className="text-cyan-400 font-bold mb-3 text-lg">Controls:</h3>
                  <div className="text-left text-gray-300 text-sm space-y-2">
                    <p><strong className="text-cyan-400">Desktop:</strong> Arrow keys or WASD to move, Space to shoot</p>
                    <p><strong className="text-cyan-400">Mobile:</strong> Touch and drag to move, release to shoot</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-cyan-500/30">
                    <p className="text-yellow-400 text-xs font-semibold">🎮 Collect power-ups • Build combos • Defeat bosses!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {gameState === 'paused' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-cyan-400">Paused</h2>
                <button
                  onClick={() => setGameState('playing')}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-lg text-xl font-bold transition-all"
                >
                  Resume
                </button>
              </div>
            </div>
          )}

          {gameState === 'levelComplete' && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-green-900/30 via-black/90 to-black/90 backdrop-blur-md z-10">
              <div className="text-center space-y-8 p-8">
                <div className="text-8xl mb-4 animate-bounce">🎉</div>
                <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 animate-pulse">
                  Level Complete!
                </h2>
                <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-green-500/30">
                  <p className="text-3xl text-cyan-400 font-bold mb-2">Score: {score}</p>
                  <p className="text-2xl text-green-400 font-semibold">Next: Level {level + 1}</p>
                </div>
                <button
                  onClick={nextLevel}
                  className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-12 py-5 rounded-xl text-2xl font-bold transition-all transform hover:scale-110 flex items-center gap-3 mx-auto shadow-2xl shadow-green-500/50 border-2 border-green-400/50"
                >
                  <Play className="w-8 h-8" />
                  Continue
                </button>
              </div>
            </div>
          )}

          {gameState === 'victory' && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-yellow-900/30 via-black/90 to-black/90 backdrop-blur-md z-10">
              <div className="text-center space-y-8 p-8">
                <div className="text-8xl mb-4 animate-bounce">🏆</div>
                <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse">
                  Victory!
                </h2>
                <p className="text-3xl text-green-400 font-bold">You defeated all 10 levels!</p>
                <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/30">
                  <p className="text-2xl text-cyan-400 font-bold mb-2">Final Score</p>
                  <p className="text-5xl text-yellow-400 font-bold">{score}</p>
                  {score > highScore && (
                    <p className="text-lg text-green-400 font-semibold mt-2">🎊 New High Score!</p>
                  )}
                </div>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-12 py-5 rounded-xl text-2xl font-bold transition-all transform hover:scale-110 flex items-center gap-3 mx-auto shadow-2xl shadow-yellow-500/50 border-2 border-yellow-400/50"
                >
                  <Trophy className="w-8 h-8" />
                  Play Again
                </button>
              </div>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-red-900/30 via-black/90 to-black/90 backdrop-blur-md z-10">
              <div className="text-center space-y-8 p-8">
                <div className="text-8xl mb-4 animate-bounce">💥</div>
                <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 animate-pulse">
                  Game Over
                </h2>
                <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-red-500/30">
                  <p className="text-3xl text-cyan-400 font-bold mb-2">Final Score</p>
                  <p className="text-5xl text-yellow-400 font-bold mb-4">{score}</p>
                  <p className="text-xl text-purple-400 font-semibold">Level Reached: {level}</p>
                  {score > highScore && (
                    <p className="text-lg text-green-400 font-semibold mt-2">🎊 New High Score!</p>
                  )}
                </div>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-12 py-5 rounded-xl text-2xl font-bold transition-all transform hover:scale-110 flex items-center gap-3 mx-auto shadow-2xl shadow-cyan-500/50 border-2 border-cyan-400/50"
                >
                  <RotateCcw className="w-8 h-8" />
                  Play Again
                </button>
              </div>
            </div>
          )}

          <div 
            className="w-full h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <ErrorBoundary>
              <Canvas
                camera={{ position: [0, -10, 25], fov: 75 }}
                gl={{ 
                  antialias: true, 
                  alpha: false,
                  powerPreference: 'high-performance',
                  stencil: false,
                  depth: true,
                  preserveDrawingBuffer: true,
                }}
                dpr={[1, 1.5]}
                performance={{ min: 0.5 }}
              >
                <GameScene
                  playerPos={playerPos}
                  enemies={enemies}
                  bullets={bullets}
                  powerUps={powerUps}
                  explosions={explosions}
                  playerHealth={playerHealth}
                  maxHealth={maxHealth}
                  shieldActive={shieldActive}
                  level={level}
                />
              </Canvas>
            </ErrorBoundary>
          </div>

          {gameState === 'playing' && (
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
              <div className="bg-black/80 backdrop-blur-sm px-4 py-3 rounded-lg space-y-1.5 border border-cyan-500/30">
                <div className="text-cyan-400 font-bold text-xl">Score: {score.toLocaleString()}</div>
                <div className="text-purple-400 font-semibold text-lg">Level: {level}/10</div>
                {combo > 1 && (
                  <div className="text-yellow-400 font-bold text-sm animate-pulse">
                    🔥 Combo x{combo}!
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-300">HP:</span>
                  <div className="w-36 h-3.5 bg-gray-800 rounded-full overflow-hidden border-2 border-gray-600">
                    <div 
                      className={`h-full transition-all shadow-lg ${
                        playerHealth > 50 ? 'bg-gradient-to-r from-green-500 to-green-400' : 
                        playerHealth > 25 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' : 
                        'bg-gradient-to-r from-red-500 to-red-400 animate-pulse'
                      }`}
                      style={{ width: `${(playerHealth / maxHealth) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-300">{Math.max(0, playerHealth)}</span>
                </div>
                {shieldActive && <div className="text-cyan-400 text-sm font-bold animate-pulse flex items-center gap-1">
                  <span>🛡️</span> Shield Active
                </div>}
                {rapidFire && <div className="text-orange-400 text-sm font-bold animate-pulse flex items-center gap-1">
                  <span>⚡</span> Rapid Fire
                </div>}
              </div>

              <div className="flex gap-2 pointer-events-auto">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="bg-black/80 backdrop-blur-sm p-3 rounded-lg hover:bg-black/90 transition-colors border border-cyan-500/30"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-6 h-6 text-cyan-400" />
                  ) : (
                    <VolumeX className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => setGameState('paused')}
                  className="bg-black/80 backdrop-blur-sm p-3 rounded-lg hover:bg-black/90 transition-colors border border-cyan-500/30"
                >
                  <Pause className="w-6 h-6 text-cyan-400" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>🎮 Tip: Maintain your combo streak for bonus points!</p>
          <p className="mt-2">Boss battles occur on levels 3, 6, 9, and 10</p>
        </div>
      </div>
    </div>
  );
}