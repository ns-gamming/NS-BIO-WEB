
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleExplosionProps {
  position: [number, number, number];
  count?: number;
  color?: string;
  size?: number;
  duration?: number;
  onComplete?: () => void;
}

export default function ParticleExplosion({
  position,
  count = 40,
  color = '#ff6600',
  size = 0.15,
  duration = 1200,
  onComplete
}: ParticleExplosionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());
  const particlesDataRef = useRef<Array<{
    velocity: THREE.Vector3;
    position: THREE.Vector3;
    rotationSpeed: THREE.Vector3;
    life: number;
    initialSize: number;
  }>>([]);

  const particles = useMemo(() => {
    const particleArray = Array.from({ length: count }, () => {
      // Random velocity in all directions
      const speed = 2 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      return {
        velocity: new THREE.Vector3(
          speed * Math.sin(phi) * Math.cos(theta),
          speed * Math.sin(phi) * Math.sin(theta),
          speed * Math.cos(phi)
        ),
        position: new THREE.Vector3(...position),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3
        ),
        life: 1.0,
        initialSize: size * (0.5 + Math.random() * 1)
      };
    });

    particlesDataRef.current = particleArray;
    return particleArray;
  }, [count, position, size]);

  useFrame(() => {
    if (!groupRef.current) return;

    const elapsed = Date.now() - startTime.current;
    const progress = elapsed / duration;

    if (progress >= 1) {
      if (onComplete) onComplete();
      return;
    }

    groupRef.current.children.forEach((child, i) => {
      const particle = particlesDataRef.current[i];
      if (!particle) return;

      // Update position with gravity and velocity decay
      particle.position.add(particle.velocity.clone().multiplyScalar(0.05));
      particle.velocity.multiplyScalar(0.92); // Air resistance
      particle.velocity.y -= 0.05; // Gravity

      // Update life
      particle.life = 1 - progress;

      // Update mesh
      child.position.copy(particle.position);
      child.rotation.x += particle.rotationSpeed.x;
      child.rotation.y += particle.rotationSpeed.y;
      child.rotation.z += particle.rotationSpeed.z;

      // Update material
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = particle.life * particle.life; // Quadratic fade

      // Update scale with life
      const scale = particle.initialSize * (0.3 + particle.life * 0.7);
      child.scale.set(scale, scale, scale);
    });
  });

  // Different particle shapes for variety
  const getRandomGeometry = (index: number) => {
    const type = index % 4;
    switch (type) {
      case 0:
        return <boxGeometry args={[size, size, size]} />;
      case 1:
        return <sphereGeometry args={[size * 0.8, 6, 6]} />;
      case 2:
        return <tetrahedronGeometry args={[size, 0]} />;
      default:
        return <octahedronGeometry args={[size * 0.7, 0]} />;
    }
  };

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={position.slice() as [number, number, number]}>
          {getRandomGeometry(i)}
          <meshBasicMaterial
            color={color}
            transparent
            opacity={1}
          />
        </mesh>
      ))}

      {/* Central flash */}
      <mesh position={position}>
        <sphereGeometry args={[size * 3, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Shockwave ring */}
      <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[size * 2, size * 0.3, 8, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Point Light */}
      <pointLight
        position={position}
        color={color}
        intensity={8}
        distance={15}
        decay={2}
      />
    </group>
  );
}
