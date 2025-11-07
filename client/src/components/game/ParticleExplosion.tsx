import { useRef, useMemo } from 'react';
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
  count = 30, 
  color = '#ff6600',
  size = 0.1,
  duration = 1000,
  onComplete 
}: ParticleExplosionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());
  
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      ),
      position: new THREE.Vector3(...position),
      life: 1.0
    }));
  }, [count, position]);

  useFrame(() => {
    if (!groupRef.current) return;
    
    const elapsed = Date.now() - startTime.current;
    const progress = elapsed / duration;
    
    if (progress >= 1) {
      if (onComplete) onComplete();
      return;
    }
    
    groupRef.current.children.forEach((child, i) => {
      const particle = particles[i];
      particle.position.add(particle.velocity.clone().multiplyScalar(0.05));
      particle.velocity.multiplyScalar(0.95);
      particle.life = 1 - progress;
      
      child.position.copy(particle.position);
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = particle.life;
      
      const scale = size * (0.5 + particle.life * 0.5);
      child.scale.set(scale, scale, scale);
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((_, i) => (
        <mesh key={i} position={position}>
          <sphereGeometry args={[size, 8, 8]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={1}
          />
        </mesh>
      ))}
      <pointLight 
        position={position} 
        color={color} 
        intensity={5} 
        distance={10}
        decay={2}
      />
    </group>
  );
}
