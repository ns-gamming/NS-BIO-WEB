
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

export type EnemyType = 'scout' | 'fighter' | 'boss';

interface EnemyProps {
  id: string;
  position: [number, number, number];
  type: EnemyType;
  health: number;
  maxHealth: number;
}

export default function Enemy({ id, position, type, health, maxHealth }: EnemyProps) {
  const enemyRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);
  const weaponLeftRef = useRef<Mesh>(null);
  const weaponRightRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (enemyRef.current) {
      enemyRef.current.rotation.y += type === 'boss' ? 0.01 : 0.03;
      enemyRef.current.rotation.z = Math.sin(clock.elapsedTime * 2) * 0.1;
    }

    if (glowRef.current) {
      const pulse = Math.sin(clock.elapsedTime * 4) * 0.3 + 0.7;
      glowRef.current.scale.setScalar(pulse);
    }

    if (weaponLeftRef.current && weaponRightRef.current && type !== 'scout') {
      const weaponPulse = Math.sin(clock.elapsedTime * 6) * 0.2 + 1;
      weaponLeftRef.current.scale.set(1, weaponPulse, 1);
      weaponRightRef.current.scale.set(1, weaponPulse, 1);
    }
  });

  const healthPercent = health / maxHealth;

  // Scout Ship - Fast, lightweight
  if (type === 'scout') {
    return (
      <group ref={enemyRef} position={position}>
        {/* Main Body */}
        <mesh castShadow>
          <coneGeometry args={[0.3, 0.6, 6]} />
          <meshStandardMaterial
            color="#ff3333"
            metalness={0.8}
            roughness={0.3}
            emissive="#ff3333"
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Wings */}
        <mesh position={[-0.25, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.15, 0.4, 0.05]} />
          <meshStandardMaterial color="#cc0000" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.25, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.15, 0.4, 0.05]} />
          <meshStandardMaterial color="#cc0000" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Weapon */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2]} />
          <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={1} />
        </mesh>

        {/* Glow */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#ff3333" transparent opacity={0.2} />
        </mesh>

        {/* Health Bar */}
        {healthPercent < 1 && (
          <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.25, 0.3, 32, 1, 0, Math.PI * 2 * healthPercent]} />
            <meshBasicMaterial color={healthPercent > 0.5 ? "#00ff00" : "#ff0000"} side={2} />
          </mesh>
        )}

        <pointLight color="#ff3333" intensity={1.5} distance={5} />
      </group>
    );
  }

  // Fighter Ship - Balanced
  if (type === 'fighter') {
    return (
      <group ref={enemyRef} position={position}>
        {/* Main Hull */}
        <mesh castShadow>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#ff6600"
            metalness={0.9}
            roughness={0.2}
            emissive="#ff6600"
            emissiveIntensity={0.7}
          />
        </mesh>

        {/* Armor Plating */}
        <mesh position={[0, 0, 0.3]}>
          <boxGeometry args={[0.6, 0.6, 0.1]} />
          <meshStandardMaterial color="#cc3300" metalness={1} roughness={0.3} />
        </mesh>

        {/* Left Wing */}
        <mesh position={[-0.5, 0, 0]}>
          <boxGeometry args={[0.3, 0.5, 0.08]} />
          <meshStandardMaterial color="#aa2200" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Right Wing */}
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[0.3, 0.5, 0.08]} />
          <meshStandardMaterial color="#aa2200" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Left Weapon */}
        <mesh ref={weaponLeftRef} position={[-0.4, 0.2, 0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.35]} />
          <meshStandardMaterial
            color="#ffaa00"
            emissive="#ffaa00"
            emissiveIntensity={1.2}
            metalness={1}
            roughness={0}
          />
        </mesh>

        {/* Right Weapon */}
        <mesh ref={weaponRightRef} position={[0.4, 0.2, 0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.35]} />
          <meshStandardMaterial
            color="#ffaa00"
            emissive="#ffaa00"
            emissiveIntensity={1.2}
            metalness={1}
            roughness={0}
          />
        </mesh>

        {/* Engine Glow */}
        <mesh position={[0, -0.4, 0]}>
          <coneGeometry args={[0.15, 0.3, 8]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={0.6} />
        </mesh>

        {/* Glow */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.75, 16, 16]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={0.15} />
        </mesh>

        {/* Health Bar */}
        {healthPercent < 1 && (
          <mesh position={[0, 0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.4, 0.5, 32, 1, 0, Math.PI * 2 * healthPercent]} />
            <meshBasicMaterial color={healthPercent > 0.5 ? "#00ff00" : "#ff0000"} side={2} />
          </mesh>
        )}

        <pointLight color="#ff6600" intensity={2.5} distance={8} />
      </group>
    );
  }

  // Boss Ship - Large, heavily armed
  return (
    <group ref={enemyRef} position={position}>
      {/* Core */}
      <mesh castShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#aa00ff"
          metalness={1}
          roughness={0.1}
          emissive="#aa00ff"
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* Outer Shell */}
      <mesh>
        <icosahedronGeometry args={[1.3, 0]} />
        <meshStandardMaterial
          color="#6600aa"
          metalness={0.95}
          roughness={0.15}
          wireframe
        />
      </mesh>

      {/* Armor Segments */}
      <mesh position={[0, 0, 0.8]}>
        <boxGeometry args={[1.5, 1.5, 0.2]} />
        <meshStandardMaterial color="#550088" metalness={1} roughness={0.2} />
      </mesh>

      {/* Top Turret */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.6, 8]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={1.5}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {/* Bottom Turret */}
      <mesh position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.6, 8]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={1.5}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {/* Weapon Arrays - Left */}
      <mesh ref={weaponLeftRef} position={[-1, 0.5, 0.3]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial
          color="#ff0088"
          emissive="#ff0088"
          emissiveIntensity={1.3}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {/* Weapon Arrays - Right */}
      <mesh ref={weaponRightRef} position={[1, 0.5, 0.3]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial
          color="#ff0088"
          emissive="#ff0088"
          emissiveIntensity={1.3}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {/* Energy Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.1, 16, 32]} />
        <meshBasicMaterial color="#aa00ff" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.3, 0.08, 16, 32]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.4} />
      </mesh>

      {/* Glow Effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#aa00ff" transparent opacity={0.1} />
      </mesh>

      {/* Health Bar */}
      {healthPercent < 1 && (
        <mesh position={[0, 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.5, 64, 1, 0, Math.PI * 2 * healthPercent]} />
          <meshBasicMaterial color={healthPercent > 0.5 ? "#00ff00" : healthPercent > 0.25 ? "#ffaa00" : "#ff0000"} side={2} />
        </mesh>
      )}

      {/* Multiple Lights */}
      <pointLight position={[0, 1.5, 0]} color="#ff00ff" intensity={5} distance={15} />
      <pointLight position={[-1, 0, 0]} color="#aa00ff" intensity={4} distance={12} />
      <pointLight position={[1, 0, 0]} color="#aa00ff" intensity={4} distance={12} />
      <pointLight position={[0, -1.5, 0]} color="#ff00ff" intensity={5} distance={15} />
    </group>
  );
}
