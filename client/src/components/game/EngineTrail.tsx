import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EngineTrailProps {
  position: [number, number, number];
  color?: string;
  intensity?: number;
}

export default function EngineTrail({ 
  position, 
  color = '#ff6600',
  intensity = 1
}: EngineTrailProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  
  const { geometry, material } = useMemo(() => {
    const particleCount = 20;
    const positions = new Float32Array(particleCount * 3);
    const opacities = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = -i * 0.1;
      opacities[i] = 1 - (i / particleCount);
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.2 * intensity,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    return { geometry: geo, material: mat };
  }, [color, intensity]);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    
    timeRef.current += delta;
    
    const positions = geometry.attributes.position.array as Float32Array;
    const opacities = geometry.attributes.opacity.array as Float32Array;
    
    for (let i = positions.length / 3 - 1; i > 0; i--) {
      positions[i * 3] = positions[(i - 1) * 3] + (Math.random() - 0.5) * 0.05;
      positions[i * 3 + 1] = positions[(i - 1) * 3 + 1] + (Math.random() - 0.5) * 0.05;
      positions[i * 3 + 2] = positions[(i - 1) * 3 + 2] - 0.05;
      
      opacities[i] = opacities[i - 1] * 0.95;
    }
    
    positions[0] = 0;
    positions[1] = 0;
    positions[2] = 0;
    opacities[0] = 1;
    
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.opacity.needsUpdate = true;
  });

  return (
    <points 
      ref={particlesRef} 
      geometry={geometry} 
      material={material} 
      position={position}
    />
  );
}
