
import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useLocation } from 'wouter';
import { ArrowLeft, Play, Pause, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import PlayerShip from '../../components/game/PlayerShip';
import Enemy, { EnemyType } from '../../components/game/Enemy';
import Bullet, { BulletType } from '../../components/game/Bullet';
import PowerUp, { PowerUpType } from '../../components/game/PowerUp';
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
      <pointLight position={[-10, -10, 10]} intensity={0.8} color="#00ffff" />
      <spotLight 
        position={[0, 20, 0]} 
        angle={0.5} 
        penumbra={1} 
        intensity={2}
        castShadow
        color="#ffffff"
      />
      <fog attach="fog" args={['#000033', 15, 50]} />
      
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
      
      {/* Star field background */}
      <mesh position={[0, 0, -10]}>
        <sphereGeometry args={[40, 32, 32]} />
        <meshBasicMaterial color="#000011" side={1} />
      </mesh>
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
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const { playSound } = useSoundEffects();
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
    
    if (soundEnabled) playSound('swoosh');
    
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
                  if (soundEnabled) playSound('pop');
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
            
            if (soundEnabled) playSound('success');
            
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

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-cyan-400 animate-pulse">
          🚀 3D Space Shooter
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
                <p className="text-2xl text-gray-300 mb-8 font-semibold">Defend the galaxy from alien invaders!</p>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-5 rounded-xl text-2xl font-bold transition-all transform hover:scale-110 flex items-center gap-3 mx-auto shadow-2xl shadow-cyan-500/50 border-2 border-cyan-400/50"
                >
                  <Play className="w-8 h-8" />
                  Start Game
                </button>
                <div className="mt-10 bg-black/50 backdrop-blur-sm p-6 rounded-xl max-w-md mx-auto border border-cyan-500/30">
                  <h3 className="text-cyan-400 font-bold mb-3 text-lg">Controls:</h3>
                  <div className="text-left text-gray-300 text-sm space-y-2">
                    <p><strong className="text-cyan-400">Desktop:</strong> Arrow keys or WASD to move, Space to shoot</p>
                    <p><strong className="text-cyan-400">Mobile:</strong> Touch and drag to move, release to shoot</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-cyan-500/30">
                    <p className="text-yellow-400 text-xs font-semibold">🎮 Collect power-ups for special abilities!</p>
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
            <Canvas
              shadows
              gl={{ 
                antialias: true, 
                alpha: true,
                powerPreference: 'high-performance'
              }}
              dpr={[1, 2]}
            >
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
                <div className="text-cyan-400 font-bold text-lg">Score: {score}</div>
                <div className="text-purple-400 font-semibold">Level: {level}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">HP:</span>
                  <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all shadow-lg"
                      style={{ width: `${(playerHealth / maxHealth) * 100}%` }}
                    />
                  </div>
                </div>
                {shieldActive && <div className="text-cyan-400 text-sm font-bold animate-pulse">🛡️ Shield Active</div>}
                {rapidFire && <div className="text-orange-400 text-sm font-bold animate-pulse">⚡ Rapid Fire</div>}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="bg-black/70 backdrop-blur-sm p-2 rounded-lg hover:bg-black/80 transition-colors"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-6 h-6 text-cyan-400" />
                  ) : (
                    <VolumeX className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => setGameState('paused')}
                  className="bg-black/70 backdrop-blur-sm p-2 rounded-lg hover:bg-black/80 transition-colors"
                >
                  <Pause className="w-6 h-6 text-cyan-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
