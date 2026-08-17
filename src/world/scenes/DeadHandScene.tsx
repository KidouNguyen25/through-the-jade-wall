import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { Interactable } from '../../game/interaction/Interactable';
import { isPlayerInSafeZone, isPlayerDetectedByWatcher } from '../../domain/deadhand/deadHandModel';
import { getPlayerRuntimePosition } from '../../game/runtime/playerRuntime';

/**
 * Watcher Automaton Sentinel Component
 */
function WatcherSentinel({
  id,
  position,
  baseAngle,
  sweepRange,
  sweepSpeed,
}: {
  id: 'watcher_alpha' | 'watcher_beta';
  position: [number, number, number];
  baseAngle: number;
  sweepRange: number;
  sweepSpeed: number;
}) {
  const headRef = useRef<THREE.Group>(null);
  const watchersFrozen = useGameStore((state) => state.watchersFrozen);
  const triggerWatcherDetection = useGameStore((state) => state.triggerWatcherDetection);

  useFrame(({ clock }) => {
    if (watchersFrozen || !headRef.current) return;

    const t = clock.getElapsedTime() * sweepSpeed;
    const currentAngle = baseAngle + Math.sin(t) * sweepRange;
    headRef.current.rotation.y = currentAngle;

    // Detection check in world space using engine-local player position
    const runtimePos = getPlayerRuntimePosition();
    const inSafeZone = isPlayerInSafeZone(runtimePos);
    const detected = isPlayerDetectedByWatcher(
      runtimePos,
      position,
      currentAngle,
      6.5,
      Math.PI / 3,
      inSafeZone,
      watchersFrozen,
    );

    if (detected) {
      triggerWatcherDetection();
    }
  });

  const eyeColor = watchersFrozen ? '#4b5563' : id === 'watcher_alpha' ? '#10b981' : '#38bdf8';
  const lightColor = watchersFrozen ? '#1f2937' : id === 'watcher_alpha' ? '#34d399' : '#60a5fa';

  return (
    <group position={position}>
      {/* Stone Pedestal Base */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.3, 0.8, 16]} />
        <meshStandardMaterial color="#111827" roughness={0.7} />
      </mesh>

      {/* Automaton Torso & Armor Plates */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[0.9, 1.6, 0.7]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Rotating Head Pivot */}
      <group ref={headRef} position={[0, 3.1, 0]}>
        {/* Head Shell */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.7, 0.8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Ocular Lantern Lens */}
        <mesh position={[0, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.15, 16]} />
          <meshStandardMaterial
            color={eyeColor}
            emissive={eyeColor}
            emissiveIntensity={watchersFrozen ? 0 : 2.0}
          />
        </mesh>

        {/* Forward Scanning Spotlight & Vision Cone */}
        {!watchersFrozen && (
          <>
            <spotLight
              position={[0, 0, 0.5]}
              target-position={[0, -2.5, 6.0]}
              angle={Math.PI / 6}
              penumbra={0.4}
              intensity={4.5}
              color={lightColor}
              distance={12}
              castShadow
            />
            {/* Visual Translucent Vision Cone Mesh */}
            <mesh position={[0, -1.2, 3.2]} rotation={[-Math.PI / 6, 0, 0]}>
              <coneGeometry args={[2.5, 7.0, 16, 1, true]} />
              <meshBasicMaterial
                color={eyeColor}
                transparent
                opacity={0.08}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
}

/**
 * Floor Sanctuary Runes (Furiten / Safe Discard Zones)
 */
function SanctuaryZone({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number];
  color: string;
}) {
  return (
    <group position={position}>
      {/* Outer Border Glowing Inset */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size[0], size[1]]} />
        <meshStandardMaterial
          color="#064e3b"
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Inner Safe Tile Pad */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size[0] - 0.4, size[1] - 0.4]} />
        <meshStandardMaterial color="#022c22" roughness={0.6} />
      </mesh>

      {/* Sanctuary Ambient Pillar Light */}
      <pointLight position={[0, 1.0, 0]} intensity={1.2} color={color} distance={4} />

      {/* Hovering Sanctuary Glyph Marker */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.5, 0.7, 0.1]} />
        <meshStandardMaterial color="#f8fafc" emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

/**
 * Central Invalidation Gong Component ([0, 0, -8.0])
 */
function InvalidationGongDais() {
  const deadHandInvalidated = useGameStore((state) => state.deadHandInvalidated);
  const activateDeadHandInvalidation = useGameStore((state) => state.activateDeadHandInvalidation);

  return (
    <group position={[0, 0, -8.0]}>
      {/* Octagonal Dais Platform */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.7, 0.5, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>

      {/* Twin Brass Support Pillars */}
      <mesh position={[-1.2, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 3.2, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.2, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 3.2, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 3.3, 0]} castShadow>
        <boxGeometry args={[2.7, 0.25, 0.3]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Suspended Brass Gong Disc */}
      <mesh position={[0, 2.0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.1, 32]} />
        <meshStandardMaterial
          color={deadHandInvalidated ? '#64748b' : '#f59e0b'}
          emissive={deadHandInvalidated ? '#334155' : '#b45309'}
          emissiveIntensity={deadHandInvalidated ? 0.1 : 0.8}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Floating White Tile Disc Inscription */}
      <mesh position={[0, 2.0, 0.08]}>
        <boxGeometry args={[0.4, 0.55, 0.05]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#e2e8f0"
          emissiveIntensity={deadHandInvalidated ? 0.1 : 0.6}
        />
      </mesh>

      <pointLight
        position={[0, 2.2, 0.6]}
        intensity={deadHandInvalidated ? 0.5 : 2.5}
        color={deadHandInvalidated ? '#64748b' : '#fbbf24'}
        distance={6}
      />

      <Interactable
        id="gong_chombo_invalidation"
        name="Gong of Invalidation"
        position={[0, 0, -8.0]}
        radius={3.0}
        promptText={
          deadHandInvalidated
            ? 'Dead Hand Declared (Watchers Frozen)'
            : 'Strike Gong to Declare Chombo (Dead Hand)'
        }
        onInteract={() => {
          activateDeadHandInvalidation();
        }}
      />
    </group>
  );
}

/**
 * North Monumental Gateway to Dealer's Boss Court ([0, 0, -21.0])
 */
function BossCourtGateway() {
  const bossCourtUnlocked = useGameStore((state) => state.bossCourtUnlocked);
  const enterBossCourt = useGameStore((state) => state.enterBossCourt);

  const handleEnterBossCourt = () => {
    enterBossCourt();
  };

  return (
    <group position={[0, 0, -20.5]}>
      {/* Monumental Archway Frame */}
      <mesh position={[-3.2, 4.0, 0]} castShadow>
        <boxGeometry args={[1.0, 8.0, 1.2]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.7} />
      </mesh>
      <mesh position={[3.2, 4.0, 0]} castShadow>
        <boxGeometry args={[1.0, 8.0, 1.2]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.7} />
      </mesh>
      <mesh position={[0, 7.8, 0]} castShadow>
        <boxGeometry args={[7.4, 1.0, 1.4]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.7} />
      </mesh>

      {/* Double Portal Gate Doors */}
      <group position={[0, 3.5, 0]}>
        {/* Left Gate Wing */}
        <mesh position={[bossCourtUnlocked ? -3.5 : -1.4, 0, 0]} castShadow>
          <boxGeometry args={[2.7, 7.0, 0.4]} />
          <meshStandardMaterial
            color="#312e81"
            metalness={0.7}
            roughness={0.3}
            emissive={bossCourtUnlocked ? '#4f46e5' : '#000000'}
            emissiveIntensity={bossCourtUnlocked ? 0.4 : 0}
          />
        </mesh>

        {/* Right Gate Wing */}
        <mesh position={[bossCourtUnlocked ? 3.5 : 1.4, 0, 0]} castShadow>
          <boxGeometry args={[2.7, 7.0, 0.4]} />
          <meshStandardMaterial
            color="#312e81"
            metalness={0.7}
            roughness={0.3}
            emissive={bossCourtUnlocked ? '#4f46e5' : '#000000'}
            emissiveIntensity={bossCourtUnlocked ? 0.4 : 0}
          />
        </mesh>
      </group>

      {/* Golden Radiance when unlocked */}
      {bossCourtUnlocked && (
        <>
          <pointLight position={[0, 3.5, 0.5]} intensity={3.5} color="#fbbf24" distance={10} />
          <mesh position={[0, 3.5, -0.2]}>
            <planeGeometry args={[5.2, 7.0]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </>
      )}

      {bossCourtUnlocked && (
        <Interactable
          id="door_boss_court"
          name="Dealer’s Court Gateway"
          position={[0, 0, -20.5]}
          radius={4.5}
          promptText="Cross Gateway into Dealer’s Court"
          onInteract={handleEnterBossCourt}
        />
      )}
    </group>
  );
}

export function DeadHandEnvironment() {
  return (
    <group>
      {/* Atmospheric Courtyard Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 18, 5]} intensity={0.7} castShadow />

      {/* Stone Flag Courtyard Floor */}
      <mesh position={[0, -0.1, -7.0]} receiveShadow>
        <boxGeometry args={[16.0, 0.2, 34.0]} />
        <meshStandardMaterial color="#090d16" roughness={0.85} />
      </mesh>

      {/* Perimeter Colonnade Walls */}
      <mesh position={[-8.2, 4.0, -7.0]} receiveShadow>
        <boxGeometry args={[0.6, 8.0, 34.0]} />
        <meshStandardMaterial color="#0b1120" roughness={0.9} />
      </mesh>
      <mesh position={[8.2, 4.0, -7.0]} receiveShadow>
        <boxGeometry args={[0.6, 8.0, 34.0]} />
        <meshStandardMaterial color="#0b1120" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.0, 9.8]} receiveShadow>
        <boxGeometry args={[16.0, 8.0, 0.6]} />
        <meshStandardMaterial color="#0b1120" roughness={0.9} />
      </mesh>

      {/* Safe Discard Sanctuaries (Furiten / Safe Zones) */}
      <SanctuaryZone position={[-4.25, 0, -2.25]} size={[4.5, 14.5]} color="#10b981" />
      <SanctuaryZone position={[4.25, 0, -2.25]} size={[4.5, 14.5]} color="#10b981" />
      <SanctuaryZone position={[0, 0, -8.0]} size={[6.0, 4.0]} color="#34d399" />

      {/* Central Invalidation Dais & Gong */}
      <InvalidationGongDais />

      {/* North Boss Gateway */}
      <BossCourtGateway />
    </group>
  );
}

export function DeadHandScene() {
  return (
    <group>
      <DeadHandEnvironment />
      {/* Watcher Sentinel Alpha (West, sweeping forward & center) */}
      <WatcherSentinel
        id="watcher_alpha"
        position={[-3.3, 0, -3.3]}
        baseAngle={0}
        sweepRange={Math.PI / 4}
        sweepSpeed={1.2}
      />
      {/* Watcher Sentinel Beta (East, sweeping forward & center) */}
      <WatcherSentinel
        id="watcher_beta"
        position={[3.3, 0, -3.3]}
        baseAngle={0}
        sweepRange={Math.PI / 4}
        sweepSpeed={1.0}
      />
    </group>
  );
}

export default DeadHandScene;
