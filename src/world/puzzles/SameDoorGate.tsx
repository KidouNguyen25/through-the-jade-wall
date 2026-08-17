import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { Interactable } from '../../game/interaction/Interactable';

export function RedDragonPickup() {
  const meshRef = useRef<THREE.Group>(null);
  const hasRedDragon = useGameStore((state) => state.hasRedDragon);
  const collectRedDragon = useGameStore((state) => state.collectRedDragon);
  const balconiesAligned = useGameStore((state) => state.balconiesAligned);

  useFrame(({ clock }) => {
    if (!meshRef.current || hasRedDragon) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y = 1.2 + Math.sin(t * 2) * 0.08;
    meshRef.current.rotation.y = t * 1.2;
  });

  if (hasRedDragon || !balconiesAligned) return null;

  return (
    <Interactable
      id="pickup_dragon_red"
      name="Red Dragon Plaque"
      position={[0, 0, -12.0]}
      radius={3.5}
      promptText="Pick up Red Dragon Plaque"
      onInteract={collectRedDragon}
    >
      {/* Stone Altar */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 1.0, 16]} />
        <meshStandardMaterial color="#1a2520" roughness={0.6} />
      </mesh>

      {/* Floating Red Dragon Plaque */}
      <group ref={meshRef} position={[0, 1.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.7, 0.16]} />
          <meshStandardMaterial
            color="#7f1d1d"
            roughness={0.2}
            metalness={0.2}
            emissive="#ef4444"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Vermilion Kanji Glow Symbol */}
        <mesh position={[0, 0, 0.085]}>
          <planeGeometry args={[0.35, 0.5]} />
          <meshBasicMaterial color="#fca5a5" wireframe />
        </mesh>
      </group>

      <pointLight position={[0, 1.4, 0]} intensity={1.8} color="#ef4444" distance={4} />
    </Interactable>
  );
}

export function PortalMistPlane({ isActive }: { isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !isActive) return;
    const t = clock.getElapsedTime();
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.opacity = 0.55 + Math.sin(t * 3) * 0.15;
    }
  });

  if (!isActive) return null;

  return (
    <mesh ref={meshRef} position={[0, 1.5, 0]}>
      <planeGeometry args={[1.4, 2.6]} />
      <meshStandardMaterial
        color="#2dd4bf"
        emissive="#0d9488"
        emissiveIntensity={0.9}
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function SameDoorGate() {
  const placedTiles = useGameStore((state) => state.placedTiles);
  const placeTileInSocket = useGameStore((state) => state.placeTileInSocket);
  const traverseSameDoor = useGameStore((state) => state.traverseSameDoor);
  const sameDoorPairActive = useGameStore((state) => state.sameDoorPairActive);
  const hasRedDragon = useGameStore((state) => state.inventoryTiles.includes('tile_dragon_red'));
  const enterMemoryRoom = useGameStore((state) => state.enterMemoryRoom);

  const socketBetaTile = placedTiles['socket_door_beta'] ?? null;

  const handleDoorBetaSocketInteract = () => {
    if (!socketBetaTile && hasRedDragon) {
      placeTileInSocket('socket_door_beta', 'tile_dragon_red');
    }
  };

  return (
    <group>
      {/* 1. Red Dragon Shrine Pickup on Upper Terrace */}
      <RedDragonPickup />

      {/* 2. Doorway Alpha (East Pavilion at [3.5, 0, -10.0]) */}
      <Interactable
        id="door_alpha_portal"
        name="Doorway Alpha"
        position={[3.5, 0, -10.0]}
        radius={3.8}
        promptText={
          sameDoorPairActive
            ? 'Step Through Doorway Alpha'
            : 'Doorway Alpha (Marked with Red Dragon)'
        }
        onInteract={() => {
          if (sameDoorPairActive) {
            traverseSameDoor('alpha');
          }
        }}
      >
        {/* Stone Archway Pillars */}
        <mesh position={[-0.9, 1.5, 0]} castShadow>
          <boxGeometry args={[0.4, 3.0, 0.5]} />
          <meshStandardMaterial color="#1a2520" roughness={0.6} />
        </mesh>
        <mesh position={[0.9, 1.5, 0]} castShadow>
          <boxGeometry args={[0.4, 3.0, 0.5]} />
          <meshStandardMaterial color="#1a2520" roughness={0.6} />
        </mesh>
        <mesh position={[0, 3.0, 0]} castShadow>
          <boxGeometry args={[2.2, 0.4, 0.6]} />
          <meshStandardMaterial color="#1a2520" roughness={0.6} />
        </mesh>

        {/* Door Alpha Fixed Plaque (Red Dragon) */}
        <mesh position={[0, 2.5, 0.28]}>
          <boxGeometry args={[0.45, 0.6, 0.1]} />
          <meshStandardMaterial color="#7f1d1d" emissive="#991b1b" emissiveIntensity={0.5} />
        </mesh>

        {/* Shimmering Portal Plane */}
        <PortalMistPlane isActive={sameDoorPairActive} />

        {sameDoorPairActive && (
          <pointLight position={[0, 1.5, 0.5]} intensity={1.5} color="#2dd4bf" distance={5} />
        )}
      </Interactable>

      {/* 3. Doorway Beta (Tower Observatory at [-3.5, 0, -15.0]) */}
      <Interactable
        id="door_beta_socket"
        name="Doorway Beta"
        position={[-3.5, 0, -15.0]}
        radius={4.2}
        promptText={
          sameDoorPairActive
            ? 'Step Through Doorway Beta'
            : socketBetaTile
              ? 'Pair Gate Active'
              : hasRedDragon
                ? 'Place Red Dragon Plaque'
                : 'Empty Door Socket (Requires Red Dragon)'
        }
        onInteract={() => {
          if (sameDoorPairActive) {
            traverseSameDoor('beta');
          } else {
            handleDoorBetaSocketInteract();
          }
        }}
      >
        {/* Stone Archway Pillars */}
        <mesh position={[-0.9, 1.5, 0]} castShadow>
          <boxGeometry args={[0.4, 3.0, 0.5]} />
          <meshStandardMaterial color="#1a2520" roughness={0.6} />
        </mesh>
        <mesh position={[0.9, 1.5, 0]} castShadow>
          <boxGeometry args={[0.4, 3.0, 0.5]} />
          <meshStandardMaterial color="#1a2520" roughness={0.6} />
        </mesh>
        <mesh position={[0, 3.0, 0]} castShadow>
          <boxGeometry args={[2.2, 0.4, 0.6]} />
          <meshStandardMaterial color="#1a2520" roughness={0.6} />
        </mesh>

        {/* Shimmering Portal Plane */}
        <PortalMistPlane isActive={sameDoorPairActive} />

        {/* Socket Plaque Mesh */}
        <mesh position={[0, 2.5, 0.28]}>
          <boxGeometry args={[0.45, 0.6, 0.1]} />
          <meshStandardMaterial
            color={socketBetaTile ? '#7f1d1d' : '#27272a'}
            emissive={socketBetaTile ? '#991b1b' : '#000000'}
            emissiveIntensity={socketBetaTile ? 0.5 : 0}
          />
        </mesh>

        {sameDoorPairActive && (
          <pointLight position={[0, 1.5, 0.5]} intensity={1.5} color="#2dd4bf" distance={5} />
        )}
      </Interactable>

      {/* 4. Memory Sanctuary Gateway Door (High Observation Deck at [-3.5, 0, -18.5]) */}
      {sameDoorPairActive && (
        <Interactable
          id="memory_sanctuary_door"
          name="Memory Sanctuary Gateway"
          position={[-3.5, 0, -18.5]}
          radius={3.5}
          promptText="Enter Memory Sanctuary"
          onInteract={() => {
            enterMemoryRoom();
          }}
        >
          {/* Ornate Octagonal Sanctuary Gate Frame */}
          <mesh position={[0, 2.0, 0]} castShadow>
            <boxGeometry args={[2.4, 4.0, 0.4]} />
            <meshStandardMaterial color="#0b2219" roughness={0.5} />
          </mesh>
          {/* Glowing Jade Inlay Portal */}
          <mesh position={[0, 2.0, 0.05]}>
            <planeGeometry args={[1.8, 3.4]} />
            <meshStandardMaterial
              color="#5eead4"
              emissive="#14b8a6"
              emissiveIntensity={0.8}
              transparent
              opacity={0.85}
            />
          </mesh>
          <pointLight position={[0, 2.0, 0.5]} intensity={2.0} color="#5eead4" distance={6} />
        </Interactable>
      )}
    </group>
  );
}

export default SameDoorGate;
