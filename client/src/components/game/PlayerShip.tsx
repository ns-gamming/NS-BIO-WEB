import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface PlayerShipProps {
  position: [number, number, number];
  health: number;
  maxHealth: number;
  shieldActive: boolean;
}

export default function PlayerShip({ position, health, maxHealth, shieldActive }: PlayerShipProps) {
  const shipRef = useRef<Mesh>(null);
  const shieldRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (shipRef.current) {
      shipRef.current.rotation.y = Math.sin(clock.elapsedTime * 2) * 0.1;
    }
    
    if (shieldRef.current && shieldActive) {
      shieldRef.current.rotation.y = clock.elapsedTime;
      shieldRef.current.rotation.x = clock.elapsedTime * 0.5;
    }
  });

  const healthPercent = health / maxHealth;
  const shipColor = healthPercent > 0.5 ? '#00bfff' : healthPercent > 0.25 ? '#ffaa00' : '#ff3333';

  return (
    <group position={position}>
      {/* Main ship body */}
      <mesh ref={shipRef} castShadow>
        <coneGeometry args={[0.5, 1.5, 6]} />
        <meshStandardMaterial 
          color={shipColor}
          emissive={shipColor}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Wings */}
      <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.8, 0.1, 0.4]} />
        <meshStandardMaterial 
          color={shipColor}
          emissive={shipColor}
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <boxGeometry args={[0.8, 0.1, 0.4]} />
        <meshStandardMaterial 
          color={shipColor}
          emissive={shipColor}
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0.3, 0.5]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#00bfff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Engine glow - Enhanced */}
      <pointLight position={[0, 0, -1]} color="#ff6600" intensity={3} distance={8} castShadow />
      <mesh position={[0, 0, -0.8]}>
        <cylinderGeometry args={[0.2, 0.3, 0.5, 8]} />
        <meshStandardMaterial 
          color="#ff6600"
          emissive="#ff6600"
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Thruster particles */}
      <mesh position={[0, 0, -1.2]}>
        <coneGeometry args={[0.3, 0.6, 8]} />
        <meshBasicMaterial 
          color="#ffaa00"
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Shield */}
      {shieldActive && (
        <mesh ref={shieldRef}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial 
            color="#00ffff"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      )}

      {/* Point light for ship glow */}
      <pointLight color={shipColor} intensity={1.5} distance={8} />
    </group>
  );
}
