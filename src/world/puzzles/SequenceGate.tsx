import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { Interactable } from '../../game/interaction/Interactable';
import { getTileById } from '../../domain/mahjong/tileTypes';

export function SocketTileMesh({
  tileId,
  position,
}: {
  tileId: string | null;
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Group>(null);
  const tile = tileId ? getTileById(tileId) : null;

  useFrame(({ clock }) => {
    if (!meshRef.current || !tile) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y = position[1] + 0.3 + Math.sin(t * 1.5) * 0.04;
    meshRef.current.rotation.y = t * 0.5;
  });

  if (!tile) return null;

  return (
    <group ref={meshRef} position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.95, 0.25]} />
        <meshStandardMaterial
          color="#0f2b20"
          roughness={0.2}
          emissive="#123d2f"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[0, 0, 0.13]}>
        <planeGeometry args={[0.55, 0.8]} />
        <meshStandardMaterial color="#f7f4ea" roughness={0.4} />
      </mesh>
      {/* Visual Rank Glyphs */}
      <mesh position={[0, 0, 0.14]}>
        <ringGeometry args={[0.1, 0.18, 16]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
    </group>
  );
}

export function BalconySegment({
  index,
  targetX,
  initialX,
  initialY,
}: {
  index: number;
  targetX: number;
  initialX: number;
  initialY: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const { balconiesAligned } = useGameStore();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const destX = balconiesAligned ? targetX : initialX;
    const destY = balconiesAligned ? 0 : initialY;

    meshRef.current.position.x = THREE.MathUtils.damp(
      meshRef.current.position.x,
      destX,
      3.5,
      delta,
    );
    meshRef.current.position.y = THREE.MathUtils.damp(
      meshRef.current.position.y,
      destY,
      3.5,
      delta,
    );
  });

  return (
    <group ref={meshRef} position={[initialX, initialY, -4.0 + index * 0.1]}>
      {/* Balcony Platform */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.2, 0.4, 4.0]} />
        <meshStandardMaterial color="#1a2d24" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Decorative Balcony Jade Railing */}
      <mesh position={[0, 0.7, -1.8]}>
        <boxGeometry args={[3.2, 0.6, 0.1]} />
        <meshStandardMaterial color="#2d5a45" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.7, 1.8]}>
        <boxGeometry args={[3.2, 0.6, 0.1]} />
        <meshStandardMaterial color="#2d5a45" roughness={0.4} />
      </mesh>
    </group>
  );
}

export function SequenceGate() {
  const { placedTiles, inventoryTiles, placeTileInSocket, balconiesAligned } = useGameStore();

  const socket3Tile = placedTiles['socket_balcony_3'] ?? null;
  const hasBamboo4 = inventoryTiles.includes('tile_bamboo_4');

  const handleSocket3Interact = () => {
    if (!socket3Tile && hasBamboo4) {
      placeTileInSocket('socket_balcony_3', 'tile_bamboo_4');
    }
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Sockets Stand / Sequence Pedestals */}
      {/* Socket 1 (Holds 2 Bamboo at [-2.2, 0, 2.0]) */}
      <group position={[-2.2, 0, 2.0]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.55, 0.8, 16]} />
          <meshStandardMaterial color="#1a2520" roughness={0.8} />
        </mesh>
        <SocketTileMesh tileId="tile_bamboo_2" position={[0, 0.8, 0]} />
        <pointLight position={[0, 1.2, 0]} intensity={0.6} color="#48bb78" distance={3} />
      </group>

      {/* Socket 2 (Holds 3 Bamboo at [0, 0, 2.0]) */}
      <group position={[0, 0, 2.0]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.55, 0.8, 16]} />
          <meshStandardMaterial color="#1a2520" roughness={0.8} />
        </mesh>
        <SocketTileMesh tileId="tile_bamboo_3" position={[0, 0.8, 0]} />
        <pointLight position={[0, 1.2, 0]} intensity={0.6} color="#48bb78" distance={3} />
      </group>

      {/* Socket 3 (Missing / Placeable at [2.2, 0, 2.0]) */}
      <Interactable
        id="socket_3_interaction"
        name="Sequence Socket 3"
        position={[2.2, 0, 2.0]}
        radius={2.8}
        promptText={
          socket3Tile ? 'Sequence Complete' : hasBamboo4 ? 'Place 4 Bamboo' : 'Requires 4 Bamboo'
        }
        onInteract={handleSocket3Interact}
      >
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.55, 0.8, 16]} />
          <meshStandardMaterial
            color={socket3Tile ? '#1a2520' : '#283b32'}
            roughness={0.7}
            emissive={hasBamboo4 && !socket3Tile ? '#38a169' : '#000000'}
            emissiveIntensity={hasBamboo4 && !socket3Tile ? 0.4 : 0}
          />
        </mesh>
        <SocketTileMesh tileId={socket3Tile} position={[0, 0.8, 0]} />
        <pointLight
          position={[0, 1.2, 0]}
          intensity={socket3Tile ? 1.0 : 0.4}
          color={socket3Tile ? '#48bb78' : '#e2e8f0'}
          distance={3}
        />
      </Interactable>

      {/* The Three Balconies */}
      <BalconySegment index={0} targetX={-3.2} initialX={-6.0} initialY={0.6} />
      <BalconySegment index={1} targetX={0} initialX={0} initialY={-1.2} />
      <BalconySegment index={2} targetX={3.2} initialX={6.0} initialY={0.8} />

      {/* Sequence Gate Visual Indicator / Glow Archway */}
      <group position={[0, 0, -7.0]}>
        <mesh position={[-4.0, 2.0, 0]}>
          <boxGeometry args={[0.6, 4.0, 0.6]} />
          <meshStandardMaterial color="#1a2e24" />
        </mesh>
        <mesh position={[4.0, 2.0, 0]}>
          <boxGeometry args={[0.6, 4.0, 0.6]} />
          <meshStandardMaterial color="#1a2e24" />
        </mesh>
        <mesh position={[0, 4.0, 0]}>
          <boxGeometry args={[8.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#1a2e24" />
        </mesh>
        {balconiesAligned && (
          <pointLight position={[0, 2.5, 0]} intensity={2.0} color="#5eead4" distance={10} />
        )}
      </group>
    </group>
  );
}

export default SequenceGate;
