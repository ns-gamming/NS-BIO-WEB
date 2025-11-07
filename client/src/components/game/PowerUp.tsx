import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export type PowerUpType = 'health' | 'shield' | 'rapidfire' | 'coins';

interface PowerUpProps {
  id: string;
  position: [number, number, number];
  type: PowerUpType;
}

export default function PowerUp({ id, position, type }: PowerUpProps) {
  const powerUpRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (powerUpRef.current) {
      powerUpRef.current.rotation.y = clock.elapsedTime * 2;
      powerUpRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 3) * 0.2;
    }

    if (glowRef.current) {
      const pulse = Math.sin(clock.elapsedTime * 5) * 0.3 + 1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const getColor = () => {
    switch (type) {
      case 'health':
        return '#00ff00';
      case 'shield':
        return '#00ffff';
      case 'rapidfire':
        return '#ff6600';
      case 'coins':
        return '#ffff00';
      default:
        return '#ffffff';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'health':
        return '+';
      case 'shield':
        return '⬡';
      case 'rapidfire':
        return '⚡';
      case 'coins':
        return '●';
      default:
        return '?';
    }
  };

  const color = getColor();

  return (
    <group position={position}>
      {/* Main power-up shape */}
      <mesh ref={powerUpRef} castShadow>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh ref={glowRef}>
        <torusGeometry args={[0.5, 0.05, 8, 32]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Inner core */}
      <mesh>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial 
          color="#ffffff"
        />
      </mesh>

      {/* Glow sphere */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Point light */}
      <pointLight color={color} intensity={2} distance={8} />
    </group>
  );
}
