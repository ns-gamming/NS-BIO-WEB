
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

export type BulletType = 'laser' | 'plasma';

interface BulletProps {
  id: string;
  position: [number, number, number];
  type: BulletType;
  fromPlayer: boolean;
}

export default function Bullet({ id, position, type, fromPlayer }: BulletProps) {
  const bulletRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const trailRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (bulletRef.current) {
      bulletRef.current.rotation.z += 0.3;
    }

    if (coreRef.current) {
      const pulse = Math.sin(clock.elapsedTime * 15) * 0.3 + 1;
      coreRef.current.scale.set(1, pulse, 1);
    }
  });

  const getColor = () => {
    if (!fromPlayer) return '#ff3333';
    return type === 'plasma' ? '#00ffff' : '#00ff00';
  };

  const color = getColor();

  if (type === 'laser') {
    return (
      <group ref={bulletRef} position={position}>
        {/* Core Laser Beam */}
        <mesh ref={coreRef} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 0.6, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>

        {/* Energy Cap - Front */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>

        {/* Energy Cap - Back */}
        <mesh position={[0, -0.3, 0]}>
          <coneGeometry args={[0.08, 0.15, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>

        {/* Trail */}
        <mesh ref={trailRef} position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.03, 0.01, 0.8, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Glow */}
        <mesh>
          <cylinderGeometry args={[0.12, 0.15, 0.7, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Point Light */}
        <pointLight color={color} intensity={1.5} distance={3} />
      </group>
    );
  }

  // Plasma Bullet
  return (
    <group ref={bulletRef} position={position}>
      {/* Core Plasma Ball */}
      <mesh ref={coreRef} castShadow>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.5}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Energy Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.03, 8, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>

      {/* Trail Particles */}
      <mesh ref={trailRef} position={[0, -0.4, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Outer Glow */}
      <mesh>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Extended Glow */}
      <mesh>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Point Light */}
      <pointLight color={color} intensity={2} distance={4} />
    </group>
  );
}
