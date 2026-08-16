import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { Interactable } from '../../game/interaction/Interactable';

// Rain Particle System
export function RainParticles({ count = 300 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8; // x in [-4, 4]
      pos[i * 3 + 1] = Math.random() * 10; // y in [0, 10]
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30; // z in [-15, 15]
      spd[i] = 12 + Math.random() * 8;
    }
    return [pos, spd];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const positionAttr = pointsRef.current.geometry.getAttribute(
      'position',
    ) as THREE.BufferAttribute | null;
    if (!positionAttr) return;

    const posArray = positionAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 1;
      const currentY = posArray[idx];
      const speed = speeds[i] ?? 14;
      if (currentY !== undefined) {
        const newY = currentY - speed * delta;
        posArray[idx] = newY < 0 ? 10 : newY;
      }
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a5f3fc"
        size={0.06}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Hovering White Tile Prop
export function WhiteTileProp() {
  const tileGroupRef = useRef<THREE.Group>(null);
  const { hasWhiteTile, collectWhiteTile } = useGameStore();

  useFrame(({ clock }) => {
    if (!tileGroupRef.current || hasWhiteTile) return;
    const t = clock.getElapsedTime();
    tileGroupRef.current.rotation.y = t * 0.8;
    tileGroupRef.current.position.y = 1.2 + Math.sin(t * 2) * 0.08;
  });

  if (hasWhiteTile) return null;

  return (
    <Interactable
      id="white_tile_pickup"
      name="The White Tile"
      position={[1.6, 0, -3.5]}
      radius={2.8}
      promptText="Pick up White Tile"
      onInteract={collectWhiteTile}
    >
      {/* Stone Pedestal */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.55, 0.8, 16]} />
        <meshStandardMaterial color="#16201b" roughness={0.8} />
      </mesh>

      {/* Hovering Tile Group */}
      <group ref={tileGroupRef} position={[0, 1.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 1.1, 0.28]} />
          <meshStandardMaterial
            color="#faf8f2"
            roughness={0.15}
            metalness={0.05}
            emissive="#e6fffa"
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Jade Halo Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.65, 0.72, 32]} />
          <meshBasicMaterial color="#5eead4" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Atmospheric Pillar Light */}
      <pointLight position={[0, 1.5, 0]} intensity={1.5} color="#5eead4" distance={5} />
    </Interactable>
  );
}

// Tea House Building & Sliding Door
export function TeaHouseEntrance() {
  const leftDoorRef = useRef<THREE.Mesh>(null);
  const rightDoorRef = useRef<THREE.Mesh>(null);

  const { teaHouseUnlocked } = useGameStore();

  useFrame((_, delta) => {
    const targetLeftX = teaHouseUnlocked ? -1.8 : -0.65;
    const targetRightX = teaHouseUnlocked ? 1.8 : 0.65;

    if (leftDoorRef.current) {
      leftDoorRef.current.position.x = THREE.MathUtils.damp(
        leftDoorRef.current.position.x,
        targetLeftX,
        4,
        delta,
      );
    }
    if (rightDoorRef.current) {
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
      {/* Gate Frame Columns */}
      <mesh position={[-1.6, 2.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 4.0, 0.6]} />
        <meshStandardMaterial color="#2d1e16" roughness={0.7} />
      </mesh>
      <mesh position={[1.6, 2.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 4.0, 0.6]} />
        <meshStandardMaterial color="#2d1e16" roughness={0.7} />
      </mesh>

      {/* Lintel Beam */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <boxGeometry args={[3.8, 0.5, 0.8]} />
        <meshStandardMaterial color="#3b271d" roughness={0.7} />
      </mesh>

      {/* Traditional Tiled Roof Overhang */}
      <mesh position={[0, 4.2, 0.2]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[4.2, 0.25, 1.6]} />
        <meshStandardMaterial color="#0c1613" roughness={0.5} />
      </mesh>

      {/* Left Sliding Door */}
      <mesh ref={leftDoorRef} position={[-0.65, 1.6, 0]} castShadow>
        <boxGeometry args={[1.2, 3.2, 0.1]} />
        <meshStandardMaterial color="#4a3325" roughness={0.6} />
      </mesh>

      {/* Right Sliding Door */}
      <mesh ref={rightDoorRef} position={[0.65, 1.6, 0]} castShadow>
        <boxGeometry args={[1.2, 3.2, 0.1]} />
        <meshStandardMaterial color="#4a3325" roughness={0.6} />
      </mesh>

      {/* Tea House Interior (Behind Gate) */}
      <group position={[0, 0, -3.5]}>
        {/* Interior Floor */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <boxGeometry args={[6.0, 0.1, 6.0]} />
          <meshStandardMaterial color="#301f16" roughness={0.4} />
        </mesh>

        {/* Interior Walls */}
        <mesh position={[0, 2.0, -3.0]} receiveShadow>
          <boxGeometry args={[6.0, 4.0, 0.2]} />
          <meshStandardMaterial color="#1a2520" roughness={0.8} />
        </mesh>
        <mesh position={[-3.0, 2.0, 0]} receiveShadow>
          <boxGeometry args={[0.2, 4.0, 6.0]} />
          <meshStandardMaterial color="#1a2520" roughness={0.8} />
        </mesh>
        <mesh position={[3.0, 2.0, 0]} receiveShadow>
          <boxGeometry args={[0.2, 4.0, 6.0]} />
          <meshStandardMaterial color="#1a2520" roughness={0.8} />
        </mesh>

        {/* Central Tea Table */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.4, 24]} />
          <meshStandardMaterial color="#42291d" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Four Stools */}
        <mesh position={[0, 0.3, 1.6]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
          <meshStandardMaterial color="#2d1e16" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.3, -1.6]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
          <meshStandardMaterial color="#2d1e16" roughness={0.6} />
        </mesh>
        <mesh position={[1.6, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
          <meshStandardMaterial color="#2d1e16" roughness={0.6} />
        </mesh>
        <mesh position={[-1.6, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
          <meshStandardMaterial color="#2d1e16" roughness={0.6} />
        </mesh>

        {/* Warm Tea House Lantern Light */}
        <pointLight position={[0, 2.6, 0]} intensity={2.5} color="#fbd38d" distance={8} />
      </group>
    </group>
  );
}

// Street Architecture & Lanterns
export function AlleyEnvironment() {
  return (
    <group>
      {/* Wet Cobblestone Ground */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.0, 32]} />
        <meshStandardMaterial
          color="#080e0c"
          roughness={0.25}
          metalness={0.3}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Left Alley Wall */}
      <mesh position={[-3.2, 3.5, 0]} receiveShadow>
        <boxGeometry args={[0.6, 7.0, 32]} />
        <meshStandardMaterial color="#0c1714" roughness={0.85} />
      </mesh>

      {/* Right Alley Wall */}
      <mesh position={[3.2, 3.5, 0]} receiveShadow>
        <boxGeometry args={[0.6, 7.0, 32]} />
        <meshStandardMaterial color="#0c1714" roughness={0.85} />
      </mesh>

      {/* Street Lanterns */}
      <group position={[-2.6, 3.0, 6.0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.6, 8]} />
          <meshStandardMaterial color="#b7791f" emissive="#d69e2e" emissiveIntensity={0.8} />
        </mesh>
        <pointLight intensity={1.2} color="#f6ad55" distance={6} />
      </group>

      <group position={[2.6, 3.0, 0.0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.6, 8]} />
          <meshStandardMaterial color="#b7791f" emissive="#d69e2e" emissiveIntensity={0.8} />
        </mesh>
        <pointLight intensity={1.2} color="#f6ad55" distance={6} />
      </group>

      <group position={[-2.6, 3.0, -6.0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.6, 8]} />
          <meshStandardMaterial color="#b7791f" emissive="#d69e2e" emissiveIntensity={0.8} />
        </mesh>
        <pointLight intensity={1.2} color="#f6ad55" distance={6} />
      </group>
    </group>
  );
}

export function RainAlleyScene() {
  const { teaHouseUnlocked, enterTeaHouse, playerInsideTeaHouse } = useGameStore();

  return (
    <group>
      <AlleyEnvironment />
      <RainParticles count={250} />
      <WhiteTileProp />
      <TeaHouseEntrance />

      {/* Direct Top-Level Doorway Trigger at [0, 0, -10.0] */}
      {teaHouseUnlocked && !playerInsideTeaHouse && (
        <Interactable
          id="enter_tea_house_trigger"
          name="Tea House Doorway"
          position={[0, 0, -10.0]}
          radius={3.0}
          promptText="Enter Tea House"
          onInteract={enterTeaHouse}
        />
      )}
    </group>
  );
}

export default RainAlleyScene;
