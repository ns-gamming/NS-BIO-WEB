
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

export type PowerUpType = 'health' | 'shield' | 'rapidfire' | 'coins';

interface PowerUpProps {
  id: string;
  position: [number, number, number];
  type: PowerUpType;
}

export default function PowerUp({ id, position, type }: PowerUpProps) {
  const powerUpRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const ring1Ref = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);
  const particlesRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (powerUpRef.current) {
      powerUpRef.current.rotation.y = clock.elapsedTime * 2;
      powerUpRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 3) * 0.3;
    }

    if (coreRef.current) {
      const pulse = Math.sin(clock.elapsedTime * 5) * 0.2 + 1;
      coreRef.current.scale.setScalar(pulse);
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = clock.elapsedTime * 3;
      ring1Ref.current.rotation.z = clock.elapsedTime * 2;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = clock.elapsedTime * -2.5;
      ring2Ref.current.rotation.x = clock.elapsedTime * 1.5;
    }

    if (particlesRef.current) {
      const particlePulse = Math.sin(clock.elapsedTime * 6) * 0.3 + 1.2;
      particlesRef.current.scale.setScalar(particlePulse);
      particlesRef.current.rotation.y = clock.elapsedTime * 4;
    }
  });

  const getConfig = () => {
    switch (type) {
      case 'health':
        return {
          color: '#00ff00',
          emissive: '#00ff00',
          iconGeometry: 'plus',
          glowIntensity: 1.2
        };
      case 'shield':
        return {
          color: '#00ffff',
          emissive: '#00ffff',
          iconGeometry: 'hexagon',
          glowIntensity: 1.5
        };
      case 'rapidfire':
        return {
          color: '#ff6600',
          emissive: '#ff6600',
          iconGeometry: 'star',
          glowIntensity: 1.8
        };
      case 'coins':
        return {
          color: '#ffff00',
          emissive: '#ffff00',
          iconGeometry: 'coin',
          glowIntensity: 1.0
        };
      default:
        return {
          color: '#ffffff',
          emissive: '#ffffff',
          iconGeometry: 'sphere',
          glowIntensity: 1.0
        };
    }
  };

  const config = getConfig();

  return (
    <group ref={powerUpRef} position={position}>
      {/* Core Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={config.glowIntensity}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Icon Based on Type */}
      {type === 'health' && (
        <group>
          {/* Plus Sign */}
          <mesh>
            <boxGeometry args={[0.1, 0.4, 0.05]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh>
            <boxGeometry args={[0.4, 0.1, 0.05]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}

      {type === 'shield' && (
        <mesh>
          <octahedronGeometry args={[0.35, 0]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      )}

      {type === 'rapidfire' && (
        <group>
          {/* Lightning Bolt Symbol */}
          <mesh rotation={[0, 0, Math.PI / 6]}>
            <boxGeometry args={[0.08, 0.5, 0.05]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.08, -0.1, 0]} rotation={[0, 0, -Math.PI / 3]}>
            <boxGeometry args={[0.08, 0.3, 0.05]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}

      {type === 'coins' && (
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.08, 16]} />
          <meshStandardMaterial
            color="#ffaa00"
            metalness={1}
            roughness={0.1}
            emissive="#ffaa00"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}

      {/* Outer Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.5, 0.04, 12, 32]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Outer Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.6, 0.03, 12, 32]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Energy Particles */}
      <mesh ref={particlesRef}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      {/* Glow Sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Larger Glow */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Point Light */}
      <pointLight
        color={config.color}
        intensity={config.glowIntensity * 3}
        distance={8}
      />

      {/* Secondary Accent Light */}
      <pointLight
        position={[0, 0.3, 0]}
        color={config.color}
        intensity={config.glowIntensity * 2}
        distance={5}
      />
    </group>
  );
}
