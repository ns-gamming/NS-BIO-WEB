
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

interface PlayerShipProps {
  position: [number, number, number];
  health: number;
  maxHealth: number;
  shieldActive: boolean;
  weaponLevel?: number;
  speedLevel?: number;
  armorLevel?: number;
}

export default function PlayerShip({ 
  position, 
  health, 
  maxHealth, 
  shieldActive,
  weaponLevel = 1,
  speedLevel = 1,
  armorLevel = 1
}: PlayerShipProps) {
  const shipGroupRef = useRef<Group>(null);
  const mainBodyRef = useRef<Mesh>(null);
  const cockpitRef = useRef<Mesh>(null);
  const shieldRef = useRef<Mesh>(null);
  const leftWingRef = useRef<Mesh>(null);
  const rightWingRef = useRef<Mesh>(null);
  const leftEngineRef = useRef<Mesh>(null);
  const rightEngineRef = useRef<Mesh>(null);
  const centerEngineRef = useRef<Mesh>(null);

  const healthPercent = health / maxHealth;
  
  // Dynamic colors based on health and upgrades
  const shipColor = useMemo(() => {
    if (healthPercent > 0.7) return '#00d4ff'; // Cyan
    if (healthPercent > 0.4) return '#ffaa00'; // Orange
    return '#ff3333'; // Red
  }, [healthPercent]);

  const weaponColor = useMemo(() => {
    const colors = ['#00ff00', '#00ffff', '#ff00ff', '#ffff00', '#ff6600'];
    return colors[Math.min(weaponLevel - 1, colors.length - 1)];
  }, [weaponLevel]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    // Main ship gentle bobbing
    if (shipGroupRef.current) {
      shipGroupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.05;
      shipGroupRef.current.rotation.z = Math.sin(time * 1.5) * 0.02;
    }

    // Main body pulse
    if (mainBodyRef.current) {
      const scale = 1 + Math.sin(time * 3) * 0.02;
      mainBodyRef.current.scale.set(1, scale, 1);
    }

    // Cockpit glow pulse
    if (cockpitRef.current) {
      cockpitRef.current.rotation.y = time * 0.5;
    }

    // Wings subtle flap
    if (leftWingRef.current && rightWingRef.current) {
      const wingAngle = Math.sin(time * 2) * 0.05;
      leftWingRef.current.rotation.z = Math.PI / 6 + wingAngle;
      rightWingRef.current.rotation.z = -Math.PI / 6 - wingAngle;
    }

    // Engine glow pulsing
    if (leftEngineRef.current && rightEngineRef.current && centerEngineRef.current) {
      const enginePulse = Math.sin(time * 8) * 0.2 + 0.8;
      leftEngineRef.current.scale.set(1, 1, enginePulse);
      rightEngineRef.current.scale.set(1, 1, enginePulse);
      centerEngineRef.current.scale.set(1, 1, enginePulse);
    }

    // Shield rotation and pulse
    if (shieldRef.current && shieldActive) {
      shieldRef.current.rotation.y = time * 2;
      shieldRef.current.rotation.x = time * 1.5;
      const shieldScale = 1 + Math.sin(time * 5) * 0.1;
      shieldRef.current.scale.setScalar(shieldScale);
    }
  });

  return (
    <group ref={shipGroupRef} position={position}>
      {/* Main Ship Body - Futuristic Fighter Design */}
      <mesh ref={mainBodyRef} castShadow receiveShadow>
        <coneGeometry args={[0.6, 1.8, 6]} />
        <meshStandardMaterial 
          color={shipColor}
          emissive={shipColor}
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Armor Plating (visible at higher armor levels) */}
      {armorLevel >= 2 && (
        <>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.7, 0.3, 0.4]} />
            <meshStandardMaterial 
              color="#555555"
              metalness={1}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.7, 0.3, 0.4]} />
            <meshStandardMaterial 
              color="#555555"
              metalness={1}
              roughness={0.2}
            />
          </mesh>
        </>
      )}

      {/* Advanced Wings */}
      <mesh ref={leftWingRef} position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <boxGeometry args={[1.2, 0.08, 0.5]} />
        <meshStandardMaterial 
          color={shipColor}
          emissive={shipColor}
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={rightWingRef} position={[0.7, 0, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <boxGeometry args={[1.2, 0.08, 0.5]} />
        <meshStandardMaterial 
          color={shipColor}
          emissive={shipColor}
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Wing Tips with lights */}
      <mesh position={[-1.3, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <pointLight position={[-1.3, 0, 0]} color="#ff0000" intensity={2} distance={5} />
      
      <mesh position={[1.3, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      <pointLight position={[1.3, 0, 0]} color="#00ff00" intensity={2} distance={5} />

      {/* Cockpit - Glowing */}
      <mesh ref={cockpitRef} position={[0, 0.5, 0.3]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#00ffff"
          emissiveIntensity={1.2}
          transparent
          opacity={0.9}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Weapon Mounts (upgrade based) */}
      {weaponLevel >= 2 && (
        <>
          <mesh position={[-0.4, 0.6, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
            <meshStandardMaterial 
              color={weaponColor}
              emissive={weaponColor}
              emissiveIntensity={0.8}
              metalness={0.9}
            />
          </mesh>
          <mesh position={[0.4, 0.6, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
            <meshStandardMaterial 
              color={weaponColor}
              emissive={weaponColor}
              emissiveIntensity={0.8}
              metalness={0.9}
            />
          </mesh>
        </>
      )}

      {/* Heavy Weapons (level 3+) */}
      {weaponLevel >= 3 && (
        <>
          <mesh position={[-0.6, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.8, 8]} />
            <meshStandardMaterial 
              color={weaponColor}
              emissive={weaponColor}
              emissiveIntensity={1}
              metalness={1}
            />
          </mesh>
          <mesh position={[0.6, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.8, 8]} />
            <meshStandardMaterial 
              color={weaponColor}
              emissive={weaponColor}
              emissiveIntensity={1}
              metalness={1}
            />
          </mesh>
        </>
      )}

      {/* Triple Engine System */}
      {/* Left Engine */}
      <group position={[-0.4, -0.7, -0.5]}>
        <mesh ref={leftEngineRef} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.6, 8]} />
          <meshStandardMaterial 
            color="#ff6600"
            emissive="#ff6600"
            emissiveIntensity={2}
            metalness={0.5}
          />
        </mesh>
        <pointLight color="#ff6600" intensity={4} distance={10} castShadow />
        
        {/* Engine Exhaust */}
        <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.25, 0.8, 8]} />
          <meshBasicMaterial 
            color="#ffaa00"
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {/* Right Engine */}
      <group position={[0.4, -0.7, -0.5]}>
        <mesh ref={rightEngineRef} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.6, 8]} />
          <meshStandardMaterial 
            color="#ff6600"
            emissive="#ff6600"
            emissiveIntensity={2}
            metalness={0.5}
          />
        </mesh>
        <pointLight color="#ff6600" intensity={4} distance={10} castShadow />
        
        <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.25, 0.8, 8]} />
          <meshBasicMaterial 
            color="#ffaa00"
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {/* Center Boost Engine (speed upgrade) */}
      {speedLevel >= 2 && (
        <group position={[0, -0.8, -0.3]}>
          <mesh ref={centerEngineRef} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 0.7, 8]} />
            <meshStandardMaterial 
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={2.5}
              metalness={0.5}
            />
          </mesh>
          <pointLight color="#00ffff" intensity={5} distance={12} castShadow />
          
          <mesh position={[0, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.3, 1, 8]} />
            <meshBasicMaterial 
              color="#00ffff"
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      )}

      {/* Shield Effect */}
      {shieldActive && (
        <>
          <mesh ref={shieldRef}>
            <icosahedronGeometry args={[1.4, 1]} />
            <meshBasicMaterial 
              color="#00ffff"
              transparent
              opacity={0.25}
              wireframe
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[1.3, 16, 16]} />
            <meshBasicMaterial 
              color="#00ffff"
              transparent
              opacity={0.15}
            />
          </mesh>
          <pointLight color="#00ffff" intensity={3} distance={15} />
        </>
      )}

      {/* Main Ship Glow */}
      <pointLight color={shipColor} intensity={2} distance={10} />
      
      {/* Ambient glow sphere */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial 
          color={shipColor}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Health Bar Above Ship */}
      <group position={[0, 1.5, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.2, 0.12]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
        <mesh position={[(-1.2 / 2) * (1 - healthPercent / 100), 0, 0.01]}>
          <planeGeometry args={[1.2 * healthPercent, 0.1]} />
          <meshBasicMaterial 
            color={healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffaa00' : '#ff0000'}
          />
        </mesh>
      </group>

      {/* Upgrade Level Indicators */}
      {weaponLevel >= 2 && (
        <mesh position={[-0.8, 0.8, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={weaponColor} />
        </mesh>
      )}
      {speedLevel >= 2 && (
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
      )}
      {armorLevel >= 2 && (
        <mesh position={[0.8, 0.8, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#ffaa00" />
        </mesh>
      )}
    </group>
  );
}
