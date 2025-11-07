
import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useLocation } from 'wouter';
import { ArrowLeft, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import PlayerShip from '../../components/game/PlayerShip';
import Enemy, { EnemyType } from '../../components/game/Enemy';
import Bullet, { BulletType } from '../../components/game/Bullet';
import PowerUp, { PowerUpType } from '../../components/game/PowerUp';

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

const GAME_WIDTH = 20;
const GAME_HEIGHT = 30;

function GameScene({ 
  playerPos, 
  enemies, 
  bullets, 
  powerUps,
  playerHealth,
  maxHealth,
  shieldActive 
}: {
  playerPos: [number, number, number];
  enemies: EnemyEntity[];
  bullets: BulletEntity[];
  powerUps: PowerUpEntity[];
  playerHealth: number;
  maxHealth: number;
  shieldActive: boolean;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, -10, 25);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#00ffff" />
      
      <PlayerShip 
        position={playerPos} 
        health={playerHealth}
        maxHealth={maxHealth}
        shieldActive={shieldActive}
      />
      
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

      <gridHelper args={[50, 50, '#00ffff', '#003333']} position={[0, 0, -5]} />
    </>
  );
}

export default function SpaceShooter() {
  const [, navigate] = useLocation();
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, -10, 0]);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [maxHealth] = useState(100);
  const [shieldActive, setShieldActive] = useState(false);
  const [score, setScore] = useState(0);
  const [enemies, setEnemies] = useState<EnemyEntity[]>([]);
  const [bullets, setBullets] = useState<BulletEntity[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUpEntity[]>([]);
  const [level, setLevel] = useState(1);
  const [rapidFire, setRapidFire] = useState(false);
  
  const gameLoopRef = useRef<number>();
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const startGame = () => {
    setGameState('playing');
    setPlayerPos([0, -10, 0]);
    setPlayerHealth(100);
    setScore(0);
    setEnemies([]);
    setBullets([]);
    setPowerUps([]);
    setLevel(1);
    setShieldActive(false);
    setRapidFire(false);
  };

  const spawnEnemy = () => {
    const types: EnemyType[] = ['scout', 'fighter', 'boss'];
    const type = types[Math.floor(Math.random() * (level > 5 ? 3 : 2))];
    const maxHealthMap = { scout: 20, fighter: 50, boss: 200 };
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

  const shoot = () => {
    if (gameState !== 'playing') return;
    
    setBullets(prev => [...prev, {
      id: `bullet-${Date.now()}-${Math.random()}`,
      position: [playerPos[0], playerPos[1] + 1, playerPos[2]],
      type: 'laser',
      fromPlayer: true,
      velocity: [0, 2, 0]
    }]);
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
      const speed = 0.5;
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
  }, [gameState, playerPos]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      // Move bullets
      setBullets(prev => prev
        .map(b => ({
          ...b,
          position: [
            b.position[0] + b.velocity[0],
            b.position[1] + b.velocity[1],
            b.position[2] + b.velocity[2]
          ] as [number, number, number]
        }))
        .filter(b => Math.abs(b.position[1]) < GAME_HEIGHT)
      );

      // Move enemies
      setEnemies(prev => prev
        .map(e => ({
          ...e,
          position: [e.position[0], e.position[1] - 0.1, e.position[2]] as [number, number, number]
        }))
        .filter(e => e.position[1] > -GAME_HEIGHT / 2)
      );

      // Move power-ups
      setPowerUps(prev => prev
        .map(p => ({
          ...p,
          position: [p.position[0], p.position[1] - 0.1, p.position[2]] as [number, number, number]
        }))
        .filter(p => p.position[1] > -GAME_HEIGHT / 2)
      );

      // Collision detection
      setBullets(prevBullets => {
        const remainingBullets = [...prevBullets];
        
        setEnemies(prevEnemies => {
          const remainingEnemies = [...prevEnemies];
          
          prevBullets.forEach((bullet, bIndex) => {
            if (!bullet.fromPlayer) return;
            
            prevEnemies.forEach((enemy, eIndex) => {
              const dx = bullet.position[0] - enemy.position[0];
              const dy = bullet.position[1] - enemy.position[1];
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 1) {
                remainingBullets[bIndex] = null as any;
                remainingEnemies[eIndex] = {
                  ...enemy,
                  health: enemy.health - 10
                };
                
                if (remainingEnemies[eIndex].health <= 0) {
                  setScore(s => s + (enemy.type === 'boss' ? 100 : enemy.type === 'fighter' ? 50 : 20));
                  remainingEnemies[eIndex] = null as any;
                }
              }
            });
          });
          
          return remainingEnemies.filter(e => e !== null);
        });
        
        return remainingBullets.filter(b => b !== null);
      });

      // Power-up collision
      setPowerUps(prevPowerUps => {
        const remaining = [...prevPowerUps];
        
        prevPowerUps.forEach((powerUp, index) => {
          const dx = powerUp.position[0] - playerPos[0];
          const dy = powerUp.position[1] - playerPos[1];
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 1) {
            remaining[index] = null as any;
            
            switch (powerUp.type) {
              case 'health':
                setPlayerHealth(h => Math.min(maxHealth, h + 30));
                break;
              case 'shield':
                setShieldActive(true);
                setTimeout(() => setShieldActive(false), 5000);
                break;
              case 'rapidfire':
                setRapidFire(true);
                setTimeout(() => setRapidFire(false), 5000);
                break;
              case 'coins':
                setScore(s => s + 50);
                break;
            }
          }
        });
        
        return remaining.filter(p => p !== null);
      });

      // Spawn enemies
      if (Math.random() < 0.02 * level) {
        spawnEnemy();
      }

      // Spawn power-ups
      if (Math.random() < 0.005) {
        spawnPowerUp();
      }

      // Auto-shoot in rapid fire
      if (rapidFire && Math.random() < 0.3) {
        shoot();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [gameState, playerPos, level, rapidFire]);

  useEffect(() => {
    if (score > 0 && score % 500 === 0) {
      setLevel(l => l + 1);
    }
  }, [score]);

  useEffect(() => {
    if (playerHealth <= 0) {
      setGameState('gameOver');
    }
  }, [playerHealth]);

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
        <button
          onClick={() => navigate('/games')}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Games
        </button>

        <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400">
          3D Space Shooter
        </h1>

        <div className="relative w-full max-w-4xl mx-auto aspect-[3/4] md:aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          {gameState === 'menu' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <div className="text-center space-y-6">
                <h2 className="text-5xl font-bold text-cyan-400 mb-4">Space Shooter</h2>
                <p className="text-xl text-gray-300 mb-8">Defend the galaxy from alien invaders!</p>
                <button
                  onClick={startGame}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
                >
                  <Play className="w-6 h-6" />
                  Start Game
                </button>
                <div className="mt-8 text-left max-w-md mx-auto text-gray-400 text-sm space-y-2">
                  <p><strong>Desktop:</strong> Arrow keys or WASD to move, Space to shoot</p>
                  <p><strong>Mobile:</strong> Touch and drag to move, release to shoot</p>
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

          {gameState === 'gameOver' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-red-400">Game Over</h2>
                <p className="text-2xl text-gray-300">Final Score: {score}</p>
                <p className="text-xl text-gray-400">Level Reached: {level}</p>
                <button
                  onClick={startGame}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-lg text-xl font-bold transition-all flex items-center gap-3 mx-auto"
                >
                  <RotateCcw className="w-6 h-6" />
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
            <Canvas>
              <GameScene
                playerPos={playerPos}
                enemies={enemies}
                bullets={bullets}
                powerUps={powerUps}
                playerHealth={playerHealth}
                maxHealth={maxHealth}
                shieldActive={shieldActive}
              />
            </Canvas>
          </div>

          {gameState === 'playing' && (
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
              <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg space-y-1">
                <div className="text-cyan-400 font-bold">Score: {score}</div>
                <div className="text-purple-400">Level: {level}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">HP:</span>
                  <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
                      style={{ width: `${(playerHealth / maxHealth) * 100}%` }}
                    />
                  </div>
                </div>
                {shieldActive && <div className="text-cyan-400 text-sm">🛡️ Shield Active</div>}
                {rapidFire && <div className="text-orange-400 text-sm">⚡ Rapid Fire</div>}
              </div>
              
              <button
                onClick={() => setGameState('paused')}
                className="bg-black/70 backdrop-blur-sm p-2 rounded-lg hover:bg-black/80 transition-colors"
              >
                <Pause className="w-6 h-6 text-cyan-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
