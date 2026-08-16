import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { Interactable } from '../../game/interaction/Interactable';
import { WIND_CONFIGS, WindDirection } from '../../domain/boss/dealerBossModel';

/**
 * Cardinal Wind Obelisk Pillar
 */
function WindObelisk({
  wind,
  position,
  isActiveHazard,
  isSafeHaven,
}: {
  wind: WindDirection;
  position: [number, number, number];
  isActiveHazard: boolean;
  isSafeHaven: boolean;
}) {
  const config = WIND_CONFIGS[wind];
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (crystalRef.current) {
      const t = clock.getElapsedTime();
      crystalRef.current.rotation.y = t * (isActiveHazard ? 2.5 : 0.8);
      crystalRef.current.position.y = 3.5 + Math.sin(t * 2 + position[0]) * 0.15;
    }
  });

  const auraColor = isActiveHazard ? config.hazardColor : isSafeHaven ? '#10b981' : config.color;

  return (
    <group position={position}>
      {/* Stone Pillar Base */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.9, 2.4, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Carved Rune Capital */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[1.2, 0.4, 1.2]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive={auraColor}
          emissiveIntensity={isActiveHazard ? 1.5 : isSafeHaven ? 1.0 : 0.4}
        />
      </mesh>

      {/* Floating Elemental Wind Crystal */}
      <mesh ref={crystalRef} position={[0, 3.5, 0]} castShadow>
        <octahedronGeometry args={[0.6]} />
        <meshStandardMaterial
          color={auraColor}
          emissive={auraColor}
          emissiveIntensity={isActiveHazard ? 2.5 : isSafeHaven ? 1.8 : 0.8}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Vertical Light Column when active */}
      {(isActiveHazard || isSafeHaven) && (
        <pointLight
          position={[0, 4.0, 0]}
          intensity={isActiveHazard ? 4.0 : 2.5}
          color={auraColor}
          distance={8}
        />
      )}
    </group>
  );
}

/**
 * The Dealer — Supreme Arbiter Automaton Figure
 */
function DealerArbiter() {
  const haloRef = useRef<THREE.Group>(null);
  const { dealerPhase } = useGameStore();

  useFrame(({ clock }) => {
    if (haloRef.current) {
      const t = clock.getElapsedTime();
      haloRef.current.rotation.z = t * 0.5;
    }
  });

  const isVictory = dealerPhase === 'interrupted_victory';

  return (
    <group position={[0, 0, -9.0]}>
      {/* Elevated Throne Dais */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 3.0, 2.0, 16]} />
        <meshStandardMaterial color="#090d16" roughness={0.7} />
      </mesh>

      {/* Arbiter Robes & Torso */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.9, 1.4, 2.8, 12]} />
        <meshStandardMaterial
          color={isVictory ? '#334155' : '#1e1b4b'}
          metalness={0.8}
          roughness={0.2}
          emissive={isVictory ? '#1e293b' : '#312e81'}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Arbiter Mask / Crown */}
      <mesh position={[0, 5.0, 0]} castShadow>
        <boxGeometry args={[0.8, 1.0, 0.7]} />
        <meshStandardMaterial
          color="#f8fafc"
          metalness={0.9}
          roughness={0.1}
          emissive={isVictory ? '#64748b' : '#fbbf24'}
          emissiveIntensity={isVictory ? 0.2 : 1.0}
        />
      </mesh>

      {/* Rotating Celestial Halo of Discarded Winds */}
      <group ref={haloRef} position={[0, 5.2, -0.4]}>
        <mesh>
          <torusGeometry args={[1.8, 0.08, 16, 48]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive={isVictory ? '#475569' : '#f59e0b'}
            emissiveIntensity={isVictory ? 0.1 : 1.5}
          />
        </mesh>
      </group>

      {/* Throne Illumination */}
      <spotLight
        position={[0, 8.0, 3.0]}
        target-position={[0, 3.0, 0]}
        intensity={isVictory ? 1.0 : 5.0}
        color={isVictory ? '#94a3b8' : '#fbbf24'}
        distance={15}
        angle={Math.PI / 4}
      />
    </group>
  );
}

/**
 * Central Tribunal Anchor Dais ([0, 0, 0])
 */
function TribunalAnchorDais() {
  const tileGlowRef = useRef<THREE.Mesh>(null);
  const { dealerPhase, interruptWithWhiteTile, advanceBossWind } = useGameStore();

  useFrame(({ clock }) => {
    if (tileGlowRef.current) {
      const t = clock.getElapsedTime();
      tileGlowRef.current.position.y = 1.3 + Math.sin(t * 3) * 0.05;
      tileGlowRef.current.rotation.y = t * 0.8;
    }
  });

  const isForcedHand = dealerPhase === 'forced_hand';
  const isVictory = dealerPhase === 'interrupted_victory';

  const handleDaisInteraction = () => {
    if (dealerPhase === 'intro') {
      advanceBossWind('wind_east');
    } else if (dealerPhase === 'wind_east') {
      advanceBossWind('wind_south');
    } else if (dealerPhase === 'wind_south') {
      advanceBossWind('forced_hand');
    } else if (dealerPhase === 'forced_hand') {
      interruptWithWhiteTile();
    }
  };

  const getPromptText = () => {
    if (dealerPhase === 'intro') return 'Hear Dealer’s Decree (Summon East Wind)';
    if (dealerPhase === 'wind_east') return 'Endure East Wind (Rotate to South Wind)';
    if (dealerPhase === 'wind_south') return 'Endure South Wind (Trigger Final Hand)';
    if (dealerPhase === 'forced_hand') return 'Place White Tile to Refuse Premise';
    return 'The Jade Wall Stands Liberated';
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Octagonal Jade Pedestal */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.8, 0.8, 8]} />
        <meshStandardMaterial color="#064e3b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Central Carved Socket Plate */}
      <mesh position={[0, 0.82, 0]} receiveShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.1, 16]} />
        <meshStandardMaterial
          color="#090d16"
          emissive={isVictory ? '#10b981' : isForcedHand ? '#fbbf24' : '#047857'}
          emissiveIntensity={isVictory ? 1.5 : isForcedHand ? 1.0 : 0.4}
        />
      </mesh>

      {/* Floating White Tile Anchor Emblem */}
      <mesh ref={tileGlowRef} position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.15]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={isVictory ? '#34d399' : '#f8fafc'}
          emissiveIntensity={isVictory ? 2.0 : 0.8}
          metalness={0.2}
          roughness={0.1}
        />
      </mesh>

      {/* Interaction Trigger on Central Dais */}
      {!isVictory && (
        <Interactable
          id="altar_tribunal_anchor"
          name="Central Tribunal Anchor"
          position={[0, 0, 0]}
          radius={2.8}
          promptText={getPromptText()}
          onInteract={handleDaisInteraction}
        />
      )}
    </group>
  );
}

/**
 * Rotating Concentric Court Arena Floor & Boundaries
 */
function CircularCourtEnvironment() {
  const rotatingRingRef = useRef<THREE.Group>(null);
  const { arenaRotation, dealerPhase, activeHazardWind } = useGameStore();

  useFrame((_, delta) => {
    if (rotatingRingRef.current) {
      // Smoothly interpolate floor rotation towards target arenaRotation
      rotatingRingRef.current.rotation.y = THREE.MathUtils.damp(
        rotatingRingRef.current.rotation.y,
        arenaRotation,
        4,
        delta,
      );
    }
  });

  const isVictory = dealerPhase === 'interrupted_victory';

  return (
    <group>
      {/* Ambient & Directional Arena Lighting */}
      <ambientLight intensity={isVictory ? 0.8 : 0.35} color="#e0e7ff" />
      <directionalLight
        position={[10, 15, 10]}
        intensity={isVictory ? 1.8 : 0.9}
        color={isVictory ? '#fef08a' : '#93c5fd'}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Outer Perimeter Circular Stone Wall */}
      <mesh position={[0, 4.0, 0]} receiveShadow>
        <cylinderGeometry args={[12.0, 12.0, 8.0, 48, 1, true]} />
        <meshStandardMaterial color="#0b1120" roughness={0.9} side={THREE.BackSide} />
      </mesh>

      {/* Outer Basalt Floor Perimeter */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[12.0, 12.2, 0.2, 48]} />
        <meshStandardMaterial color="#020617" roughness={0.9} />
      </mesh>

      {/* Rotating Inner Jade Floor Disk */}
      <group ref={rotatingRingRef}>
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <cylinderGeometry args={[10.5, 10.5, 0.05, 32]} />
          <meshStandardMaterial color="#06281e" metalness={0.4} roughness={0.5} />
        </mesh>

        {/* Concentric Gold Inscription Ring */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.5, 5.8, 48]} />
          <meshStandardMaterial
            color="#d97706"
            emissive={isVictory ? '#10b981' : '#b45309'}
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Four Wind Direction Obelisks mounted on the rotating arena */}
        <WindObelisk
          wind="east"
          position={[8.5, 0, 0]}
          isActiveHazard={activeHazardWind === 'east'}
          isSafeHaven={activeHazardWind === 'south'}
        />
        <WindObelisk
          wind="south"
          position={[0, 0, 8.5]}
          isActiveHazard={activeHazardWind === 'south'}
          isSafeHaven={activeHazardWind === 'east'}
        />
        <WindObelisk
          wind="west"
          position={[-8.5, 0, 0]}
          isActiveHazard={false}
          isSafeHaven={activeHazardWind === 'east'}
        />
        <WindObelisk
          wind="north"
          position={[0, 0, -8.5]}
          isActiveHazard={false}
          isSafeHaven={activeHazardWind === 'south'}
        />
      </group>

      {/* Central Tribunal Dais */}
      <TribunalAnchorDais />

      {/* The Dealer Supreme Arbiter */}
      <DealerArbiter />

      {/* Victory Ascension Radiance Beams */}
      {isVictory && (
        <group position={[0, 0, 0]}>
          <pointLight position={[0, 6.0, 0]} intensity={6.0} color="#34d399" distance={20} />
          <mesh position={[0, 8.0, 0]}>
            <cylinderGeometry args={[2.5, 0.5, 16.0, 32, 1, true]} />
            <meshStandardMaterial
              color="#34d399"
              emissive="#10b981"
              emissiveIntensity={2.5}
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function BossCourtScene() {
  return (
    <group>
      <CircularCourtEnvironment />
    </group>
  );
}

export default BossCourtScene;
