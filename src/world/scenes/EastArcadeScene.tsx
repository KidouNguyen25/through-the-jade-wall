import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { Interactable } from '../../game/interaction/Interactable';
import SequenceGate from '../puzzles/SequenceGate';

export function Bamboo4Pickup() {
  const meshRef = useRef<THREE.Group>(null);
  const { hasBamboo4, collectBamboo4 } = useGameStore();

  useFrame(({ clock }) => {
    if (!meshRef.current || hasBamboo4) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y = 1.0 + Math.sin(t * 2) * 0.05;
    meshRef.current.rotation.y = t * 0.7;
  });

  if (hasBamboo4) return null;

  return (
    <Interactable
      id="bamboo_4_pickup"
      name="4 Bamboo Tile"
      position={[3.0, 0, 4.0]}
      radius={2.8}
      promptText="Pick up 4 Bamboo"
      onInteract={collectBamboo4}
    >
      {/* Merchant Antique Table */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <meshStandardMaterial color="#2d1e16" roughness={0.6} />
      </mesh>

      {/* Floating 4 Bamboo Tile */}
      <group ref={meshRef} position={[0, 1.0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.95, 0.25]} />
          <meshStandardMaterial
            color="#0f2b20"
            roughness={0.2}
            emissive="#123d2f"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[0, 0, 0.13]}>
          <planeGeometry args={[0.55, 0.8]} />
          <meshStandardMaterial color="#f7f4ea" roughness={0.3} />
        </mesh>
        {/* 4 Green Bamboo Stalks Motif */}
        <mesh position={[-0.12, 0.15, 0.14]}>
          <boxGeometry args={[0.06, 0.22, 0.01]} />
          <meshBasicMaterial color="#16a34a" />
        </mesh>
        <mesh position={[0.12, 0.15, 0.14]}>
          <boxGeometry args={[0.06, 0.22, 0.01]} />
          <meshBasicMaterial color="#16a34a" />
        </mesh>
        <mesh position={[-0.12, -0.15, 0.14]}>
          <boxGeometry args={[0.06, 0.22, 0.01]} />
          <meshBasicMaterial color="#16a34a" />
        </mesh>
        <mesh position={[0.12, -0.15, 0.14]}>
          <boxGeometry args={[0.06, 0.22, 0.01]} />
          <meshBasicMaterial color="#16a34a" />
        </mesh>
      </group>

      <pointLight position={[0, 1.2, 0]} intensity={1.5} color="#48bb78" distance={4} />
    </Interactable>
  );
}

export function EastArcadeEnvironment() {
  return (
    <group>
      {/* Promenade Floor */}
      <mesh position={[0, -0.05, 5.0]} receiveShadow>
        <boxGeometry args={[12, 0.1, 10]} />
        <meshStandardMaterial color="#0e1714" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Chasm Void Floor (Deep under balconies) */}
      <mesh position={[0, -5.0, -4.0]} receiveShadow>
        <boxGeometry args={[20, 0.1, 10]} />
        <meshStandardMaterial color="#030605" roughness={0.9} />
      </mesh>

      {/* Far North Terrace Platform */}
      <mesh position={[0, -0.05, -11.0]} receiveShadow>
        <boxGeometry args={[12, 0.1, 6]} />
        <meshStandardMaterial color="#0e1714" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Arcade Boundary Walls */}
      <mesh position={[-6.2, 3.5, 0]} receiveShadow>
        <boxGeometry args={[0.6, 7.0, 24]} />
        <meshStandardMaterial color="#0c1714" roughness={0.85} />
      </mesh>
      <mesh position={[6.2, 3.5, 0]} receiveShadow>
        <boxGeometry args={[0.6, 7.0, 24]} />
        <meshStandardMaterial color="#0c1714" roughness={0.85} />
      </mesh>

      {/* Decorative Arcade Pillars */}
      {[-4, 4].map((x) =>
        [2, 6, -8].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 2.5, z]} castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.35, 5.0, 16]} />
            <meshStandardMaterial color="#1a2b22" roughness={0.7} />
          </mesh>
        )),
      )}

      {/* Ambient Jade Atmosphere Lights */}
      <pointLight position={[0, 4.0, 5.0]} intensity={1.5} color="#48bb78" distance={10} />
      <pointLight position={[0, -2.0, -4.0]} intensity={2.0} color="#22543d" distance={12} />
    </group>
  );
}

export function EastArcadeScene() {
  return (
    <group>
      <EastArcadeEnvironment />
      <Bamboo4Pickup />
      <SequenceGate />
    </group>
  );
}

export default EastArcadeScene;
