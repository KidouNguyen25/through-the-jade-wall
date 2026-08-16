import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface JadeTileProps {
  position?: [number, number, number];
}

export function JadeTile({ position = [0, 1.2, 0] }: JadeTileProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const elapsedTime = clock.getElapsedTime();
    meshRef.current.rotation.y = elapsedTime * 0.4;
    meshRef.current.position.y = position[1] + Math.sin(elapsedTime * 1.5) * 0.08;
  });

  return (
    <group ref={meshRef} position={position} castShadow>
      {/* Front Face (White Ivory / Jade Base) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.6, 0.4]} />
        <meshStandardMaterial
          color="#123d2f"
          roughness={0.25}
          metalness={0.1}
          emissive="#0a231b"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Decorative Mahjong Inset Face */}
      <mesh position={[0, 0, 0.21]}>
        <planeGeometry args={[1.0, 1.4]} />
        <meshStandardMaterial color="#f4f1e8" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Stylized Bamboo / Dragon Symbol Emblem */}
      <mesh position={[0, 0, 0.22]}>
        <ringGeometry args={[0.2, 0.32, 32]} />
        <meshBasicMaterial color="#1e7350" />
      </mesh>

      <mesh position={[0, 0, 0.22]}>
        <boxGeometry args={[0.1, 0.5, 0.01]} />
        <meshBasicMaterial color="#b8860b" />
      </mesh>
    </group>
  );
}

export function Pedestal() {
  return (
    <group position={[0, 0, 0]}>
      {/* Upper platform */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[1.8, 2.0, 0.4, 32]} />
        <meshStandardMaterial color="#0e1714" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Base platform */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.6, 0.2, 32]} />
        <meshStandardMaterial color="#080e0c" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Ground Floor */}
      <mesh position={[0, -0.21, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#050807" roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#5a7a6f" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        color="#fff5e6"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, 2, -2]} intensity={1.5} color="#48bb78" distance={8} />
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#f6e05e" distance={5} />
    </>
  );
}

export function GameRoot() {
  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative' }}
      data-testid="game-canvas-container"
    >
      <Canvas shadows>
        <color attach="background" args={['#070b0a']} />
        <fog attach="fog" args={['#070b0a', 8, 22]} />
        <PerspectiveCamera makeDefault position={[0, 2.5, 6]} fov={50} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={3}
          maxDistance={12}
        />
        <SceneLighting />
        <JadeTile position={[0, 1.3, 0]} />
        <Pedestal />
      </Canvas>
    </div>
  );
}

export default GameRoot;
