import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface BulletTracerProps {
  position: [number, number, number];
  color?: string;
  length?: number;
}

export default function BulletTracer({ 
  position, 
  color = '#00ffff', 
  length = 0.5 
}: BulletTracerProps) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z += 0.2;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, length, 6]} />
        <meshBasicMaterial 
          color={color} 
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.8}
        />
      </mesh>
      <pointLight 
        color={color} 
        intensity={3} 
        distance={4}
      />
    </group>
  );
}
