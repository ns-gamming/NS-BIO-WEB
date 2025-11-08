import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

interface PlayerShipProps {
  position: [number, number, number];
  health: number;
  maxHealth: number;
  shieldActive: boolean;
  weaponLevel: number;
  speedLevel: number;
  armorLevel: number;
}

export default function PlayerShip({
  position,
  health,
  maxHealth,
  shieldActive,
  weaponLevel,
  speedLevel,
  armorLevel
}: PlayerShipProps) {
  const shipRef = useRef<Group>(null);
  const engineRef = useRef<Mesh>(null);
  const shieldRef = useRef<Mesh>(null);
  const wingLeftRef = useRef<Mesh>(null);
  const wingRightRef = useRef<Mesh>(null);
  const cockpitRef = useRef<Mesh>(null);

  const healthPercent = health / maxHealth;

  useFrame(({ clock }) => {
    if (shipRef.current) {
      // Subtle hovering animation
      shipRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2) * 0.05;
      shipRef.current.rotation.z = Math.sin(clock.elapsedTime * 1.5) * 0.03;
    }

    if (engineRef.current) {
      // Pulsing engine glow
      const pulse = Math.sin(clock.elapsedTime * 8) * 0.3 + 0.7;
      engineRef.current.scale.set(1, pulse, 1);
    }

    if (shieldRef.current && shieldActive) {
      // Shield rotation and pulse
      shieldRef.current.rotation.y += 0.05;
      shieldRef.current.rotation.x += 0.02;
      const shieldPulse = Math.sin(clock.elapsedTime * 4) * 0.1 + 0.9;
      shieldRef.current.scale.setScalar(shieldPulse);
    }

    if (wingLeftRef.current && wingRightRef.current) {
      // Wing stabilizers subtle movement
      const wingTilt = Math.sin(clock.elapsedTime * 3) * 0.02;
      wingLeftRef.current.rotation.z = wingTilt;
      wingRightRef.current.rotation.z = -wingTilt;
    }

    if (cockpitRef.current) {
      // Cockpit glow pulse
      const glowPulse = Math.sin(clock.elapsedTime * 5) * 0.2 + 0.8;
      (cockpitRef.current.material as any).emissiveIntensity = glowPulse;
    }
  });

  const weaponColor = useMemo(() => {
    if (weaponLevel >= 5) return '#ff00ff';
    if (weaponLevel >= 3) return '#00ffff';
    return '#00ff00';
  }, [weaponLevel]);

  return (
    <group ref={shipRef} position={position}>
      {/* Main Hull - Fuselage */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.2}
          emissive="#0f3460"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Cockpit */}
      <mesh ref={cockpitRef} position={[0, 0.4, 0.15]} castShadow>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#00d4ff"
          metalness={0.5}
          roughness={0.1}
          emissive="#00d4ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Nose Cone */}
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.3, 0.5, 8]} />
        <meshStandardMaterial
          color="#e94560"
          metalness={0.8}
          roughness={0.3}
          emissive="#e94560"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Left Wing */}
      <mesh ref={wingLeftRef} position={[-0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.05]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.85}
          roughness={0.25}
          emissive="#0f3460"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Right Wing */}
      <mesh ref={wingRightRef} position={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.05]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.85}
          roughness={0.25}
          emissive="#0f3460"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Wing Tips - Left */}
      <mesh position={[-0.7, 0, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.08]} />
        <meshStandardMaterial
          color="#e94560"
          metalness={0.9}
          roughness={0.1}
          emissive="#e94560"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Wing Tips - Right */}
      <mesh position={[0.7, 0, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.08]} />
        <meshStandardMaterial
          color="#e94560"
          metalness={0.9}
          roughness={0.1}
          emissive="#e94560"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Weapon Hardpoints - Level indicators */}
      {weaponLevel >= 1 && (
        <>
          <mesh position={[-0.35, 0.5, 0.1]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.3]} />
            <meshStandardMaterial
              color={weaponColor}
              metalness={0.95}
              roughness={0.05}
              emissive={weaponColor}
              emissiveIntensity={1}
            />
          </mesh>
          <mesh position={[0.35, 0.5, 0.1]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.3]} />
            <meshStandardMaterial
              color={weaponColor}
              metalness={0.95}
              roughness={0.05}
              emissive={weaponColor}
              emissiveIntensity={1}
            />
          </mesh>
        </>
      )}

      {/* Advanced Weapon Pods - Level 3+ */}
      {weaponLevel >= 3 && (
        <>
          <mesh position={[-0.6, 0.3, 0.15]} castShadow>
            <boxGeometry args={[0.12, 0.25, 0.12]} />
            <meshStandardMaterial
              color={weaponColor}
              metalness={1}
              roughness={0}
              emissive={weaponColor}
              emissiveIntensity={1.2}
            />
          </mesh>
          <mesh position={[0.6, 0.3, 0.15]} castShadow>
            <boxGeometry args={[0.12, 0.25, 0.12]} />
            <meshStandardMaterial
              color={weaponColor}
              metalness={1}
              roughness={0}
              emissive={weaponColor}
              emissiveIntensity={1.2}
            />
          </mesh>
        </>
      )}

      {/* Engine Core */}
      <mesh ref={engineRef} position={[0, -0.7, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 0.4, 16]} />
        <meshStandardMaterial
          color="#00d4ff"
          metalness={0.5}
          roughness={0.3}
          emissive="#00d4ff"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Engine Exhaust Glow */}
      <mesh position={[0, -0.9, 0]}>
        <coneGeometry args={[0.3, 0.6, 16]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Engine Trails */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.05, 0.15, 0.8, 8]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Speed Boosters */}
      {speedLevel >= 2 && (
        <>
          <mesh position={[-0.4, -0.5, -0.1]}>
            <cylinderGeometry args={[0.08, 0.12, 0.3, 8]} />
            <meshStandardMaterial
              color="#ffaa00"
              emissive="#ffaa00"
              emissiveIntensity={1.2}
            />
          </mesh>
          <mesh position={[0.4, -0.5, -0.1]}>
            <cylinderGeometry args={[0.08, 0.12, 0.3, 8]} />
            <meshStandardMaterial
              color="#ffaa00"
              emissive="#ffaa00"
              emissiveIntensity={1.2}
            />
          </mesh>
        </>
      )}

      {/* Armor Plating - Level indicators */}
      {armorLevel >= 2 && (
        <>
          <mesh position={[0, 0, 0.22]}>
            <boxGeometry args={[0.5, 1, 0.05]} />
            <meshStandardMaterial
              color="#444444"
              metalness={1}
              roughness={0.4}
            />
          </mesh>
        </>
      )}

      {/* Shield Effect */}
      {shieldActive && (
        <mesh ref={shieldRef}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      )}

      {/* Shield Energy Sphere */}
      {shieldActive && (
        <mesh>
          <sphereGeometry args={[1.15, 16, 16]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.15}
          />
        </mesh>
      )}

      {/* Health Indicator Lights */}
      <mesh position={[0.25, 0.2, 0.25]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial
          color={healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffaa00' : '#ff0000'}
        />
      </mesh>
      <mesh position={[-0.25, 0.2, 0.25]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial
          color={healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffaa00' : '#ff0000'}
        />
      </mesh>

      {/* Weapon Lights */}
      <pointLight position={[-0.35, 0.5, 0.2]} color={weaponColor} intensity={2} distance={3} />
      <pointLight position={[0.35, 0.5, 0.2]} color={weaponColor} intensity={2} distance={3} />

      {/* Engine Light */}
      <pointLight position={[0, -0.9, 0]} color="#00d4ff" intensity={3} distance={5} />

      {/* Cockpit Light */}
      <pointLight position={[0, 0.4, 0.3]} color="#00d4ff" intensity={1.5} distance={2} />
    </group>
  );
}