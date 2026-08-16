import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { Interactable } from '../../game/interaction/Interactable';

export function HologramProjectorDais() {
  const projectorRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { memoryReconstructed } = useGameStore();

  useFrame(({ clock }) => {
    if (!projectorRef.current) return;
    const t = clock.getElapsedTime();

    if (memoryReconstructed) {
      projectorRef.current.rotation.y = t * 0.4;
      if (ringRef.current) {
        ringRef.current.rotation.z = -t * 0.6;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Heavy Bronze & Jade Octagonal Base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.9, 0.5, 8]} />
        <meshStandardMaterial color="#0f261e" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Stepped Inner Dais Ring */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.15, 8]} />
        <meshStandardMaterial color="#1f4436" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Central Glass Lens Emitter */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.1, 16]} />
        <meshStandardMaterial
          color="#5eead4"
          emissive="#2dd4bf"
          emissiveIntensity={memoryReconstructed ? 1.0 : 0.2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Floating Holographic Projection Wireframe */}
      {memoryReconstructed && (
        <group ref={projectorRef} position={[0, 2.0, 0]}>
          {/* Wireframe City Wall Miniature */}
          <mesh>
            <octahedronGeometry args={[0.9, 1]} />
            <meshBasicMaterial color="#5eead4" wireframe transparent opacity={0.7} />
          </mesh>

          <mesh ref={ringRef}>
            <torusGeometry args={[1.2, 0.02, 16, 64]} />
            <meshBasicMaterial color="#a7f3d0" transparent opacity={0.6} />
          </mesh>

          {/* Upward Light Beam Cone */}
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.1, 1.2, 1.2, 16, 1, true]} />
            <meshBasicMaterial color="#2dd4bf" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>

          <pointLight position={[0, 0.5, 0]} intensity={2.5} color="#5eead4" distance={8} />
        </group>
      )}

      {/* Keeper Echo Silhouette Projection */}
      {memoryReconstructed && (
        <group position={[0, 0, -2.2]}>
          <mesh position={[0, 1.2, 0]}>
            <capsuleGeometry args={[0.3, 1.1, 8, 16]} />
            <meshStandardMaterial
              color="#0d3b32"
              emissive="#2dd4bf"
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
              roughness={0.1}
            />
          </mesh>
          <pointLight position={[0, 1.5, 0]} intensity={1.0} color="#2dd4bf" distance={4} />
        </group>
      )}
    </group>
  );
}

export function MemoryPedestal({
  id,
  name,
  position,
  fragmentId,
  crystalColor,
  emissiveColor,
}: {
  id: string;
  name: string;
  position: [number, number, number];
  fragmentId: 'eastGate' | 'midnightBell' | 'captainSeal';
  crystalColor: string;
  emissiveColor: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { memoryFragments, collectMemoryFragment } = useGameStore();
  const isCollected = memoryFragments[fragmentId];

  useFrame(({ clock }) => {
    if (!meshRef.current || isCollected) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y = 1.3 + Math.sin(t * 2 + position[0]) * 0.06;
    meshRef.current.rotation.y = t * 0.9;
  });

  if (isCollected) {
    return (
      <group position={position}>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.55, 1.1, 16]} />
          <meshStandardMaterial color="#16251e" roughness={0.6} />
        </mesh>
        <pointLight position={[0, 1.4, 0]} intensity={0.3} color={crystalColor} distance={4} />
      </group>
    );
  }

  return (
    <Interactable
      id={id}
      name={name}
      position={position}
      radius={2.8}
      promptText={`Inspect ${name}`}
      onInteract={() => collectMemoryFragment(fragmentId)}
    >
      {/* Stone Pedestal Pillar */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.55, 1.1, 16]} />
        <meshStandardMaterial color="#16251e" roughness={0.6} />
      </mesh>

      {/* Floating Memory Crystal Prism */}
      <mesh ref={meshRef} position={[0, 1.3, 0]} castShadow>
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color={crystalColor}
          emissive={emissiveColor}
          emissiveIntensity={0.85}
          roughness={0.2}
        />
      </mesh>

      <pointLight position={[0, 1.4, 0]} intensity={1.2} color={crystalColor} distance={4} />
    </Interactable>
  );
}

export function MemoryRoomEnvironment() {
  const { memoryReconstructed } = useGameStore();

  return (
    <group>
      {/* Octagonal Sanctuary Polished Floor */}
      <mesh position={[0, -0.05, -2.0]} receiveShadow>
        <cylinderGeometry args={[9.5, 9.8, 0.2, 8]} />
        <meshStandardMaterial color="#0a1411" roughness={0.25} metalness={0.4} />
      </mesh>

      {/* Outer Chamber Walls */}
      <mesh position={[0, 4.0, -12.0]} receiveShadow>
        <boxGeometry args={[14.0, 8.0, 0.8]} />
        <meshStandardMaterial color="#08100d" roughness={0.85} />
      </mesh>
      <mesh position={[-6.8, 4.0, -2.0]} receiveShadow>
        <boxGeometry args={[0.8, 8.0, 20.0]} />
        <meshStandardMaterial color="#08100d" roughness={0.85} />
      </mesh>
      <mesh position={[6.8, 4.0, -2.0]} receiveShadow>
        <boxGeometry args={[0.8, 8.0, 20.0]} />
        <meshStandardMaterial color="#08100d" roughness={0.85} />
      </mesh>
      <mesh position={[0, 4.0, 6.0]} receiveShadow>
        <boxGeometry args={[14.0, 8.0, 0.8]} />
        <meshStandardMaterial color="#08100d" roughness={0.85} />
      </mesh>

      {/* Surrounding Archive Sconces */}
      {[-5, 5].map((x) =>
        [-8, -3, 2].map((z) => (
          <group key={`${x}-${z}`} position={[x, 3.2, z]}>
            <mesh>
              <boxGeometry args={[0.3, 0.5, 0.3]} />
              <meshStandardMaterial color="#2d4a3e" emissive="#5eead4" emissiveIntensity={0.6} />
            </mesh>
            <pointLight intensity={0.9} color="#5eead4" distance={5} />
          </group>
        )),
      )}

      {/* Atmospheric Ceiling Ambient Glow */}
      <pointLight
        position={[0, 6.5, -2.0]}
        intensity={memoryReconstructed ? 2.2 : 0.8}
        color={memoryReconstructed ? '#5eead4' : '#14b8a6'}
        distance={18}
      />
    </group>
  );
}

export function MemoryRoomScene() {
  return (
    <group>
      <MemoryRoomEnvironment />

      {/* Central Holographic Dais */}
      <HologramProjectorDais />

      {/* Memory Pedestal I: East Gate ([3.5, 0, -3.0]) */}
      <MemoryPedestal
        id="pedestal_east_gate"
        name="East Gate Fragment"
        position={[3.5, 0, -3.0]}
        fragmentId="eastGate"
        crystalColor="#5eead4"
        emissiveColor="#14b8a6"
      />

      {/* Memory Pedestal II: Midnight Bell ([-3.5, 0, -3.0]) */}
      <MemoryPedestal
        id="pedestal_midnight_bell"
        name="Midnight Bell Fragment"
        position={[-3.5, 0, -3.0]}
        fragmentId="midnightBell"
        crystalColor="#facc15"
        emissiveColor="#ca8a04"
      />

      {/* Memory Pedestal III: Captain's Seal ([0, 0, -6.5]) */}
      <MemoryPedestal
        id="pedestal_captain_seal"
        name="Captain's Seal Fragment"
        position={[0, 0, -6.5]}
        fragmentId="captainSeal"
        crystalColor="#f87171"
        emissiveColor="#dc2626"
      />

      {/* Exit Gateway to Discard Passage (unlocked after reconstruction) */}
      <ExitGatewayToDiscardPassage />
    </group>
  );
}

function ExitGatewayToDiscardPassage() {
  const { memoryReconstructed, enterDiscardPassage } = useGameStore();

  if (!memoryReconstructed) return null;

  return (
    <group position={[0, 0, -8.5]}>
      <mesh position={[0, 2.5, 0]}>
        <planeGeometry args={[3.2, 5.0]} />
        <meshStandardMaterial
          color="#064e3b"
          emissive="#10b981"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>
      <pointLight position={[0, 2.5, 0.5]} intensity={2.0} color="#34d399" distance={6} />
      <Interactable
        id="door_discard_passage"
        name="Discard Passage Gateway"
        position={[0, 0, -7.0]}
        radius={4.5}
        promptText="Enter Discard Passage"
        onInteract={enterDiscardPassage}
      />
    </group>
  );
}

export default MemoryRoomScene;
