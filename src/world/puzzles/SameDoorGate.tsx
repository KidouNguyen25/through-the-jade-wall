import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { Interactable } from '../../game/interaction/Interactable';

export function PortalMistPlane({ isActive }: { isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !isActive) return;
    const t = clock.getElapsedTime();
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.opacity = 0.65 + Math.sin(t * 4) * 0.15;
    }
  });

  if (!isActive) return null;

  return (
    <mesh ref={meshRef} position={[0, 1.5, 0]}>
      <planeGeometry args={[1.6, 2.8]} />
      <meshStandardMaterial
        color="#2dd4bf"
        emissive="#0f766e"
        emissiveIntensity={1.2}
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function RedDragonPickup() {
  const meshRef = useRef<THREE.Group>(null);
  const { hasRedDragon, collectRedDragon } = useGameStore();

  useFrame(({ clock }) => {
    if (!meshRef.current || hasRedDragon) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y = 1.1 + Math.sin(t * 2) * 0.05;
    meshRef.current.rotation.y = t * 0.8;
  });

  if (hasRedDragon) return null;

  return (
    <Interactable
      id="red_dragon_pickup"
      name="Red Dragon Plaque"
      position={[0, 0, -12.0]}
      radius={2.8}
      promptText="Pick up Red Dragon Plaque"
      onInteract={collectRedDragon}
    >
      {/* Altar Pedestal */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.85, 0.8, 16]} />
        <meshStandardMaterial color="#1f2923" roughness={0.7} />
      </mesh>

      {/* Floating Red Dragon Tile */}
      <group ref={meshRef} position={[0, 1.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.95, 0.25]} />
          <meshStandardMaterial
            color="#2a0808"
            roughness={0.2}
            emissive="#450a0a"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[0, 0, 0.13]}>
          <planeGeometry args={[0.55, 0.8]} />
          <meshStandardMaterial color="#fdf2f2" roughness={0.3} />
        </mesh>
        {/* Red Dragon "Chun" Glyph Geometry */}
        <mesh position={[0, 0, 0.14]}>
          <boxGeometry args={[0.3, 0.08, 0.01]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
        <mesh position={[0, 0, 0.14]}>
          <boxGeometry args={[0.08, 0.4, 0.01]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
        <mesh position={[0, 0.05, 0.14]}>
          <boxGeometry args={[0.26, 0.18, 0.01]} />
          <meshBasicMaterial color="#b91c1c" />
        </mesh>
      </group>
      <pointLight position={[0, 1.5, 0]} intensity={1.2} color="#f87171" distance={4} />
    </Interactable>
  );
}

export function SameDoorGate() {
  const { placedTiles, inventoryTiles, sameDoorPairActive, placeTileInSocket, traverseSameDoor } =
    useGameStore();

  const socketBetaTile = placedTiles['socket_door_beta'] ?? null;
  const hasRedDragon = inventoryTiles.includes('tile_dragon_red');

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
        radius={3.2}
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
        radius={3.2}
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
    </group>
  );
}

export default SameDoorGate;
