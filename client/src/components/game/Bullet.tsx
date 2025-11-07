import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export type BulletType = 'laser' | 'missile' | 'spread';

interface BulletProps {
  id: string;
  position: [number, number, number];
  type: BulletType;
  fromPlayer: boolean;
}

export default function Bullet({ id, position, type, fromPlayer }: BulletProps) {
  const bulletRef = useRef<Mesh>(null);
  const trailRef = useRef<Mesh>(null);

  useFrame(() => {
    if (bulletRef.current) {
      bulletRef.current.rotation.x += 0.2;
      bulletRef.current.rotation.y += 0.1;
    }
  });

  const getColor = () => {
    if (!fromPlayer) return '#ff3333';
    switch (type) {
      case 'laser':
        return '#00ffff';
      case 'missile':
        return '#ff6600';
      case 'spread':
        return '#ffff00';
      default:
        return '#00ff00';
    }
  };

  const getSize = () => {
    switch (type) {
      case 'laser':
        return [0.1, 0.6, 0.1] as [number, number, number];
      case 'missile':
        return [0.15, 0.8, 0.15] as [number, number, number];
      case 'spread':
        return [0.08, 0.4, 0.08] as [number, number, number];
      default:
        return [0.1, 0.5, 0.1] as [number, number, number];
    }
  };

  const color = getColor();
  const size = getSize();

  return (
    <group position={position}>
      {/* Trail effect */}
      <mesh ref={trailRef} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[size[0] * 0.5, size[0] * 0.1, 1, 8]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Main bullet */}
      <mesh ref={bulletRef} castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={1}
        />
      </mesh>

      {/* Glow */}
      <mesh>
        <sphereGeometry args={[size[0] * 2, 8, 8]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Point light */}
      <pointLight color={color} intensity={1} distance={5} />
    </group>
  );
}
