import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export type EnemyType = 'scout' | 'fighter' | 'boss';

interface EnemyProps {
  id: string;
  position: [number, number, number];
  type: EnemyType;
  health: number;
  maxHealth: number;
}

export default function Enemy({ id, position, type, health, maxHealth }: EnemyProps) {
  const enemyRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (enemyRef.current) {
      enemyRef.current.rotation.y += 0.02;
      enemyRef.current.rotation.z = Math.sin(clock.elapsedTime * 3) * 0.1;
    }

    if (glowRef.current) {
      const pulse = Math.sin(clock.elapsedTime * 4) * 0.3 + 0.7;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const healthPercent = health / maxHealth;
  const getColor = () => {
    switch (type) {
      case 'scout':
        return '#ff3333';
      case 'fighter':
        return '#ff6600';
      case 'boss':
        return '#aa00ff';
      default:
        return '#ff0000';
    }
  };

  const getSize = () => {
    switch (type) {
      case 'scout':
        return 0.4;
      case 'fighter':
        return 0.6;
      case 'boss':
        return 1.5;
      default:
        return 0.5;
    }
  };

  const color = getColor();
  const size = getSize();

  return (
    <group position={position}>
      {/* Main body */}
      <mesh ref={enemyRef} castShadow receiveShadow>
        {type === 'boss' ? (
          <dodecahedronGeometry args={[size, 2]} />
        ) : type === 'fighter' ? (
          <octahedronGeometry args={[size, 1]} />
        ) : (
          <tetrahedronGeometry args={[size, 1]} />
        )}
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.9}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef}>
        {type === 'boss' ? (
          <dodecahedronGeometry args={[size * 1.2, 1]} />
        ) : type === 'fighter' ? (
          <octahedronGeometry args={[size * 1.2, 0]} />
        ) : (
          <tetrahedronGeometry args={[size * 1.2, 0]} />
        )}
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Health indicator */}
      {healthPercent < 1 && (
        <mesh position={[0, size + 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 0.8, size, 32, 1, 0, Math.PI * 2 * healthPercent]} />
          <meshBasicMaterial color="#00ff00" side={2} />
        </mesh>
      )}

      {/* Point light - Enhanced */}
      <pointLight color={color} intensity={type === 'boss' ? 4 : 2} distance={type === 'boss' ? 20 : 10} castShadow />
      
      {/* Additional glow rings for boss */}
      {type === 'boss' && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[size * 1.5, 0.1, 16, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.4} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[size * 1.3, 0.08, 16, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </mesh>
        </>
      )}
    </group>
  );
}
