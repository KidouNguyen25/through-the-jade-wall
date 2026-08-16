import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { Interactable } from '../../game/interaction/Interactable';

export function RainParticles({ count = 200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Scatter within alley width and length
      pos[i * 3] = (Math.random() - 0.5) * 6; // X: -3 to 3
      pos[i * 3 + 1] = Math.random() * 8; // Y: 0 to 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 24; // Z: -12 to 12
      vel[i] = 9 + Math.random() * 6; // Fall speed
    }

    return [pos, vel];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    if (!posAttr) return;

    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const vel = velocities[i] ?? 10;
      const currentY = array[i * 3 + 1] ?? 0;
      const nextY = currentY - vel * delta;
      array[i * 3 + 1] = nextY;

      // Reset when particle hits ground
      if (nextY < 0) {
        array[i * 3 + 1] = 8;
        array[i * 3] = (Math.random() - 0.5) * 6;
        array[i * 3 + 2] = (Math.random() - 0.5) * 24;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#a7f3d0"
        size={0.06}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function WhiteTileProp() {
  const meshRef = useRef<THREE.Group>(null);
  const { hasWhiteTile, collectWhiteTile } = useGameStore();

  useFrame(({ clock }) => {
    if (!meshRef.current || hasWhiteTile) return;
    const t = clock.getElapsedTime();
    // Hovering sinusoidal animation
    meshRef.current.position.y = 1.0 + Math.sin(t * 2) * 0.06;
    meshRef.current.rotation.y = t * 0.8;
  });

  if (hasWhiteTile) return null;

  return (
    <Interactable
      id="white_tile_pedestal"
      name="White Tile Pedestal"
      position={[1.6, 0, -3.5]}
      radius={3.5}
      promptText="Pick up White Tile"
      onInteract={collectWhiteTile}
    >
      {/* Stone Pedestal */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.45, 0.9, 16]} />
        <meshStandardMaterial color="#1a2520" roughness={0.7} />
      </mesh>

      {/* Floating White Tile (Haku) */}
      <group ref={meshRef} position={[0, 1.0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.7, 0.18]} />
          <meshStandardMaterial
            color="#f7f4ea"
            roughness={0.2}
            metalness={0.1}
            emissive="#5eead4"
            emissiveIntensity={0.25}
          />
        </mesh>
        {/* Subtle jade bevel inlay */}
        <mesh position={[0, 0, 0.095]}>
          <planeGeometry args={[0.4, 0.6]} />
          <meshBasicMaterial color="#ecfdf5" wireframe />
        </mesh>
      </group>

      {/* Local spotlight glowing on the tile */}
      <pointLight position={[0, 1.2, 0]} intensity={1.5} color="#5eead4" distance={3.5} />
    </Interactable>
  );
}

export function TeaHouseEntrance() {
  const leftDoorRef = useRef<THREE.Mesh>(null);
  const rightDoorRef = useRef<THREE.Mesh>(null);
  const { teaHouseUnlocked } = useGameStore();

  useFrame((_, delta) => {
    // Animate doors opening sideways when unlocked
    if (leftDoorRef.current && rightDoorRef.current) {
      const targetLeftX = teaHouseUnlocked ? -1.8 : -0.7;
      const targetRightX = teaHouseUnlocked ? 1.8 : 0.7;

      leftDoorRef.current.position.x = THREE.MathUtils.damp(
        leftDoorRef.current.position.x,
        targetLeftX,
        4,
        delta,
      );
      rightDoorRef.current.position.x = THREE.MathUtils.damp(
        rightDoorRef.current.position.x,
        targetRightX,
        4,
        delta,
      );
    }
  });

  return (
    <group position={[0, 0, -10.0]}>
      {/* Archway Frame */}
      <mesh position={[-1.5, 2.0, 0]} castShadow>
        <boxGeometry args={[0.5, 4.0, 0.6]} />
        <meshStandardMaterial color="#1a201c" roughness={0.7} />
      </mesh>
      <mesh position={[1.5, 2.0, 0]} castShadow>
        <boxGeometry args={[0.5, 4.0, 0.6]} />
        <meshStandardMaterial color="#1a201c" roughness={0.7} />
      </mesh>
      <mesh position={[0, 4.0, 0]} castShadow>
        <boxGeometry args={[3.5, 0.5, 0.7]} />
        <meshStandardMaterial color="#1a201c" roughness={0.7} />
      </mesh>

      {/* Left Sliding Door */}
      <mesh ref={leftDoorRef} position={[-0.7, 1.8, 0]} castShadow>
        <boxGeometry args={[1.35, 3.5, 0.1]} />
        <meshStandardMaterial
          color="#2a1e16"
          roughness={0.4}
          emissive={teaHouseUnlocked ? '#064e3b' : '#000000'}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Right Sliding Door */}
      <mesh ref={rightDoorRef} position={[0.7, 1.8, 0]} castShadow>
        <boxGeometry args={[1.35, 3.5, 0.1]} />
        <meshStandardMaterial
          color="#2a1e16"
          roughness={0.4}
          emissive={teaHouseUnlocked ? '#064e3b' : '#000000'}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Warm Interior Lantern Glow revealed when opening */}
      <pointLight
        position={[0, 2.0, -2.0]}
        intensity={teaHouseUnlocked ? 2.5 : 0.4}
        color="#fbbf24"
        distance={8}
      />

      {/* Tea House Signboard */}
      <mesh position={[0, 3.4, 0.4]}>
        <boxGeometry args={[1.8, 0.6, 0.1]} />
        <meshStandardMaterial color="#0f2b20" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function AlleyEnvironment() {
  return (
    <group>
      {/* Wet Cobblestone Floor */}
      <mesh position={[0, -0.05, -3.0]} receiveShadow>
        <boxGeometry args={[5.6, 0.1, 24]} />
        <meshStandardMaterial color="#0d1411" roughness={0.3} metalness={0.3} />
      </mesh>

      {/* Left Alley Wall */}
      <mesh position={[-2.8, 3.0, -3.0]} receiveShadow>
        <boxGeometry args={[0.5, 6.0, 24]} />
        <meshStandardMaterial color="#09100d" roughness={0.8} />
      </mesh>

      {/* Right Alley Wall */}
      <mesh position={[2.8, 3.0, -3.0]} receiveShadow>
        <boxGeometry args={[0.5, 6.0, 24]} />
        <meshStandardMaterial color="#09100d" roughness={0.8} />
      </mesh>

      {/* South Back Wall (Starting Boundary) */}
      <mesh position={[0, 3.0, 9.0]} receiveShadow>
        <boxGeometry args={[5.6, 6.0, 0.5]} />
        <meshStandardMaterial color="#09100d" roughness={0.8} />
      </mesh>

      {/* Distant Tea House Back Wall */}
      <mesh position={[0, 3.0, -14.5]} receiveShadow>
        <boxGeometry args={[5.6, 6.0, 0.5]} />
        <meshStandardMaterial color="#09100d" roughness={0.8} />
      </mesh>

      {/* Street Lanterns along Alley */}
      <group position={[-2.4, 2.5, 4.0]}>
        <mesh>
          <boxGeometry args={[0.3, 0.45, 0.3]} />
          <meshStandardMaterial color="#b7791f" emissive="#d69e2e" emissiveIntensity={0.8} />
        </mesh>
        <pointLight intensity={1.2} color="#f6ad55" distance={6} />
      </group>
      <group position={[2.4, 2.5, 0.0]}>
        <mesh>
          <boxGeometry args={[0.3, 0.45, 0.3]} />
          <meshStandardMaterial color="#b7791f" emissive="#d69e2e" emissiveIntensity={0.8} />
        </mesh>
        <pointLight intensity={1.2} color="#f6ad55" distance={6} />
      </group>
      <group position={[-2.4, 2.5, -4.0]}>
        <mesh>
          <boxGeometry args={[0.3, 0.45, 0.3]} />
          <meshStandardMaterial color="#b7791f" emissive="#d69e2e" emissiveIntensity={0.8} />
        </mesh>
        <pointLight intensity={1.2} color="#f6ad55" distance={6} />
      </group>
    </group>
  );
}

export function RainAlleyScene() {
  const { teaHouseUnlocked, enterTeaHouse } = useGameStore();

  return (
    <group>
      <AlleyEnvironment />
      <RainParticles count={250} />
      <WhiteTileProp />
      <TeaHouseEntrance />

      {/* Direct Top-Level Doorway Trigger at [0, 0, -10.0] */}
      {teaHouseUnlocked && (
        <Interactable
          id="enter_tea_house_trigger"
          name="Tea House Doorway"
          position={[0, 0, -10.0]}
          radius={3.5}
          promptText="Enter Tea House"
          onInteract={enterTeaHouse}
        />
      )}
    </group>
  );
}

export default RainAlleyScene;
