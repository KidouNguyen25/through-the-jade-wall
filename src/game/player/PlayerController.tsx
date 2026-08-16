import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useInput } from '../input/useInput';
import { useGameStore } from '../../state/gameStore';
import {
  ALLEY_BOUNDS,
  ALLEY_OBSTACLES,
  EAST_ARCADE_BOUNDS,
  EAST_ARCADE_OBSTACLES,
  MEMORY_ROOM_BOUNDS,
  MEMORY_ROOM_OBSTACLES,
  CHASM_VOID_OBSTACLE,
  clampPositionToBounds,
  resolveBoxCollision,
} from '../../domain/collision/collisionModel';

// Reusable scratch objects to avoid per-frame allocations
const moveDirection = new THREE.Vector3();
const targetPosition = new THREE.Vector3();
const playerRadius = 0.45;

export function AliceMesh() {
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);

  return (
    <group ref={bodyRef}>
      {/* Head */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#f7f3e8" roughness={0.6} />
      </mesh>

      {/* Hair / Silhouette Accent */}
      <mesh position={[0, 1.52, -0.05]} castShadow>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#1a201d" roughness={0.8} />
      </mesh>

      {/* Ribbon / Headband */}
      <mesh position={[0, 1.54, 0.05]}>
        <boxGeometry args={[0.3, 0.05, 0.2]} />
        <meshStandardMaterial color="#5eead4" emissive="#134e4a" emissiveIntensity={0.5} />
      </mesh>

      {/* Torso / Emerald Coat */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 0.65, 12]} />
        <meshStandardMaterial color="#0f2b20" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Ivory Collar / Scarf */}
      <mesh position={[0, 1.25, 0.06]}>
        <boxGeometry args={[0.3, 0.12, 0.15]} />
        <meshStandardMaterial color="#faf5ee" roughness={0.5} />
      </mesh>

      {/* Lower Coat / Skirt */}
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.44, 0.45, 12]} />
        <meshStandardMaterial color="#0b2219" roughness={0.4} />
      </mesh>

      {/* Left Leg */}
      <mesh ref={leftLegRef} position={[-0.14, 0.22, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.32, 4, 8]} />
        <meshStandardMaterial color="#1f2923" roughness={0.7} />
      </mesh>

      {/* Right Leg */}
      <mesh ref={rightLegRef} position={[0.14, 0.22, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.32, 4, 8]} />
        <meshStandardMaterial color="#1f2923" roughness={0.7} />
      </mesh>

      {/* Soft Ground Shadow Contact Disc */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export function PlayerController() {
  const groupRef = useRef<THREE.Group>(null);
  const inputRef = useInput();

  const {
    playerPosition,
    setPlayerPosition,
    currentScene,
    isPaused,
    teaHouseUnlocked,
    balconiesAligned,
  } = useGameStore();

  const currentPos = useRef(new THREE.Vector3(...playerPosition));
  const currentRotation = useRef(0);
  const walkCycle = useRef(0);
  const lastKnownStorePos = useRef<[number, number, number]>(playerPosition);

  // Sync position if external code changed playerPosition (e.g. portal warp or scene entry)
  if (
    lastKnownStorePos.current[0] !== playerPosition[0] ||
    lastKnownStorePos.current[1] !== playerPosition[1] ||
    lastKnownStorePos.current[2] !== playerPosition[2]
  ) {
    lastKnownStorePos.current = playerPosition;
    currentPos.current.set(...playerPosition);
  }

  useFrame((_, delta) => {
    if (isPaused || !groupRef.current) return;

    const input = inputRef.current;
    const speed = input.sprint ? 5.5 : 3.6;

    moveDirection.set(0, 0, 0);

    if (input.forward) moveDirection.z -= 1;
    if (input.backward) moveDirection.z += 1;
    if (input.left) moveDirection.x -= 1;
    if (input.right) moveDirection.x += 1;

    const isMoving = moveDirection.lengthSq() > 0.001;

    if (isMoving) {
      moveDirection.normalize();

      // Calculate target angle based on input direction
      const targetAngle = Math.atan2(moveDirection.x, moveDirection.z);
      // Smooth rotation towards move direction
      let diff = targetAngle - currentRotation.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      currentRotation.current += diff * Math.min(1, delta * 12);

      // Move player position
      targetPosition.copy(currentPos.current);
      targetPosition.x += moveDirection.x * speed * delta;
      targetPosition.z += moveDirection.z * speed * delta;

      // Select scene-specific bounds and obstacles
      const activeBounds =
        currentScene === 'memory_room'
          ? MEMORY_ROOM_BOUNDS
          : currentScene === 'east_arcade'
            ? EAST_ARCADE_BOUNDS
            : ALLEY_BOUNDS;

      const activeObstacles = [
        ...(currentScene === 'memory_room'
          ? MEMORY_ROOM_OBSTACLES
          : currentScene === 'east_arcade'
            ? EAST_ARCADE_OBSTACLES
            : ALLEY_OBSTACLES),
        ...(currentScene === 'east_arcade' && !balconiesAligned ? [CHASM_VOID_OBSTACLE] : []),
      ];

      // Check bounds
      let [clampedX, clampedZ] = clampPositionToBounds(
        targetPosition.x,
        targetPosition.z,
        playerRadius,
        activeBounds,
      );

      // Check obstacle collisions
      for (const obstacle of activeObstacles) {
        // If Tea House door is unlocked in Rain Alley, allow passage through center
        if (
          currentScene === 'rain_alley' &&
          teaHouseUnlocked &&
          obstacle.minZ === -10.5 &&
          Math.abs(clampedX) < 1.3
        ) {
          continue;
        }
        [clampedX, clampedZ] = resolveBoxCollision(clampedX, clampedZ, playerRadius, obstacle);
      }

      currentPos.current.x = clampedX;
      currentPos.current.z = clampedZ;

      // Update walk cycle
      walkCycle.current += delta * speed * 3.5;
      groupRef.current.position.y = Math.sin(walkCycle.current * 2) * 0.04;

      // Sync to game store for camera and interaction logic
      const newPos: [number, number, number] = [
        currentPos.current.x,
        currentPos.current.y,
        currentPos.current.z,
      ];
      lastKnownStorePos.current = newPos;
      setPlayerPosition(newPos);
    } else {
      groupRef.current.position.y = 0;
    }

    // Apply transform to group
    groupRef.current.position.x = currentPos.current.x;
    groupRef.current.position.z = currentPos.current.z;
    groupRef.current.rotation.y = currentRotation.current;
  });

  return (
    <group ref={groupRef} position={playerPosition}>
      <AliceMesh />
    </group>
  );
}

export default PlayerController;
