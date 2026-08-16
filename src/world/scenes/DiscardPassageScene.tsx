import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Interactable } from '../../game/interaction/Interactable';
import { useGameStore } from '../../state/gameStore';

/**
 * Archivist Stone Furnace Altar ([ -3.0, 0, -5.0 ])
 */
function ArchivistFurnace() {
  const flameRef = useRef<THREE.Mesh>(null);
  const { performSacrifice, discardPassageResolved, westPathOpen } = useGameStore();

  useFrame(({ clock }) => {
    if (flameRef.current) {
      const t = clock.getElapsedTime();
      flameRef.current.scale.set(
        1 + Math.sin(t * 5) * 0.1,
        1 + Math.cos(t * 6) * 0.15,
        1 + Math.sin(t * 4) * 0.1,
      );
    }
  });

  return (
    <group position={[-3.0, 0, -5.0]}>
      {/* Stone Altar Base */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="#0f1d17" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Emerald Rune Inlays */}
      <mesh position={[0, 0.6, 0.61]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={westPathOpen ? 1.5 : 0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Glowing Emerald Sacrificial Flame */}
      <mesh ref={flameRef} position={[0, 1.45, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#10b981"
          emissiveIntensity={westPathOpen ? 2.0 : 1.0}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      <pointLight
        position={[0, 1.6, 0]}
        intensity={westPathOpen ? 2.5 : 1.2}
        color="#10b981"
        distance={6}
      />

      {/* Sacrificial Basin Interaction (active until choice made) */}
      {!discardPassageResolved && (
        <Interactable
          id="altar_archivist_furnace"
          name="Archivist Stone Furnace"
          position={[-3.0, 0, -5.0]}
          radius={2.8}
          promptText="Sacrifice Selected Tile to Archivist Furnace"
          onInteract={() => performSacrifice('archivist_furnace')}
        />
      )}
    </group>
  );
}

/**
 * Regent Brazen Brazier Altar ([ 3.0, 0, -5.0 ])
 */
function RegentBrazier() {
  const flameRef = useRef<THREE.Mesh>(null);
  const { performSacrifice, discardPassageResolved, eastPathOpen } = useGameStore();

  useFrame(({ clock }) => {
    if (flameRef.current) {
      const t = clock.getElapsedTime();
      flameRef.current.scale.set(
        1 + Math.cos(t * 5.5) * 0.12,
        1 + Math.sin(t * 6.5) * 0.18,
        1 + Math.cos(t * 4.5) * 0.12,
      );
    }
  });

  return (
    <group position={[3.0, 0, -5.0]}>
      {/* Bronze Brazier Pedestal */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 1.2, 16]} />
        <meshStandardMaterial color="#2d1515" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Crimson Rune Inlay */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.1, 16]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#dc2626"
          emissiveIntensity={eastPathOpen ? 1.5 : 0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Roaring Crimson Flame */}
      <mesh ref={flameRef} position={[0, 1.5, 0]}>
        <dodecahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color="#f87171"
          emissive="#ef4444"
          emissiveIntensity={eastPathOpen ? 2.2 : 1.1}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      <pointLight
        position={[0, 1.6, 0]}
        intensity={eastPathOpen ? 2.5 : 1.2}
        color="#ef4444"
        distance={6}
      />

      {/* Sacrificial Basin Interaction */}
      {!discardPassageResolved && (
        <Interactable
          id="altar_regent_brazier"
          name="Regent Brazen Brazier"
          position={[3.0, 0, -5.0]}
          radius={2.8}
          promptText="Sacrifice Selected Tile to Regent Brazier"
          onInteract={() => performSacrifice('regent_brazier')}
        />
      )}
    </group>
  );
}

/**
 * Massive Physical Portcullis Gates & Spatial Collapse
 */
function SpatialGates() {
  const { westPathOpen, eastPathOpen, discardPassageResolved } = useGameStore();

  return (
    <group>
      {/* West Portcullis ([ -4.0, 0, -9.0 ]) */}
      <group position={[-4.0, 0, -9.0]}>
        {/* Gate Pillars */}
        <mesh position={[-2.2, 2.5, 0]} castShadow>
          <boxGeometry args={[0.8, 5.0, 0.8]} />
          <meshStandardMaterial color="#1a2e26" roughness={0.7} />
        </mesh>
        <mesh position={[2.2, 2.5, 0]} castShadow>
          <boxGeometry args={[0.8, 5.0, 0.8]} />
          <meshStandardMaterial color="#1a2e26" roughness={0.7} />
        </mesh>
        <mesh position={[0, 4.8, 0]} castShadow>
          <boxGeometry args={[4.8, 0.6, 1.0]} />
          <meshStandardMaterial color="#1a2e26" roughness={0.7} />
        </mesh>

        {/* Sliding Grate / Rubble */}
        {westPathOpen ? (
          // Gate fully lifted
          <mesh position={[0, 4.2, 0]}>
            <boxGeometry args={[3.6, 1.0, 0.2]} />
            <meshStandardMaterial color="#059669" metalness={0.8} roughness={0.3} />
          </mesh>
        ) : discardPassageResolved ? (
          // Permanently collapsed into rubble barrier
          <group position={[0, 1.0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[3.6, 2.0, 1.2]} />
              <meshStandardMaterial color="#1f1616" roughness={0.9} />
            </mesh>
            <mesh position={[0.4, 0.6, 0.2]} rotation={[0.2, 0.4, 0.1]} castShadow>
              <dodecahedronGeometry args={[0.8, 0]} />
              <meshStandardMaterial color="#2d2020" roughness={0.8} />
            </mesh>
          </group>
        ) : (
          // Sealed iron portcullis
          <mesh position={[0, 2.0, 0]} castShadow>
            <boxGeometry args={[3.6, 4.0, 0.2]} />
            <meshStandardMaterial color="#0f1f1a" metalness={0.7} roughness={0.4} />
          </mesh>
        )}
      </group>

      {/* East Iron Gate ([ 4.0, 0, -9.0 ]) */}
      <group position={[4.0, 0, -9.0]}>
        {/* Gate Pillars */}
        <mesh position={[-2.2, 2.5, 0]} castShadow>
          <boxGeometry args={[0.8, 5.0, 0.8]} />
          <meshStandardMaterial color="#2e1a1a" roughness={0.7} />
        </mesh>
        <mesh position={[2.2, 2.5, 0]} castShadow>
          <boxGeometry args={[0.8, 5.0, 0.8]} />
          <meshStandardMaterial color="#2e1a1a" roughness={0.7} />
        </mesh>
        <mesh position={[0, 4.8, 0]} castShadow>
          <boxGeometry args={[4.8, 0.6, 1.0]} />
          <meshStandardMaterial color="#2e1a1a" roughness={0.7} />
        </mesh>

        {/* Sliding Grate / Rubble */}
        {eastPathOpen ? (
          // Gate fully lifted
          <mesh position={[0, 4.2, 0]}>
            <boxGeometry args={[3.6, 1.0, 0.2]} />
            <meshStandardMaterial color="#dc2626" metalness={0.8} roughness={0.3} />
          </mesh>
        ) : discardPassageResolved ? (
          // Permanently collapsed into rubble barrier
          <group position={[0, 1.0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[3.6, 2.0, 1.2]} />
              <meshStandardMaterial color="#1f1616" roughness={0.9} />
            </mesh>
            <mesh position={[-0.4, 0.6, 0.2]} rotation={[-0.2, -0.4, 0.1]} castShadow>
              <dodecahedronGeometry args={[0.8, 0]} />
              <meshStandardMaterial color="#2d2020" roughness={0.8} />
            </mesh>
          </group>
        ) : (
          // Sealed bronze portcullis
          <mesh position={[0, 2.0, 0]} castShadow>
            <boxGeometry args={[3.6, 4.0, 0.2]} />
            <meshStandardMaterial color="#2b1414" metalness={0.7} roughness={0.4} />
          </mesh>
        )}
      </group>
    </group>
  );
}

/**
 * North Threshold Doorway & Bridge
 */
function NorthThreshold() {
  const { discardPassageResolved, enterDeadHandCourtyard } = useGameStore();

  return (
    <group position={[0, 0, -21.0]}>
      {/* North Archway Portal Frame */}
      <mesh position={[-2.0, 3.0, 0]} castShadow>
        <boxGeometry args={[1.0, 6.0, 1.0]} />
        <meshStandardMaterial color="#16251e" roughness={0.6} />
      </mesh>
      <mesh position={[2.0, 3.0, 0]} castShadow>
        <boxGeometry args={[1.0, 6.0, 1.0]} />
        <meshStandardMaterial color="#16251e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 5.8, 0]} castShadow>
        <boxGeometry args={[4.5, 0.8, 1.2]} />
        <meshStandardMaterial color="#16251e" roughness={0.6} />
      </mesh>

      {/* Threshold Altar / Doorway */}
      <mesh position={[0, 2.5, 0]}>
        <planeGeometry args={[3.0, 5.0]} />
        <meshStandardMaterial
          color="#064e3b"
          emissive="#047857"
          emissiveIntensity={discardPassageResolved ? 0.8 : 0.2}
          roughness={0.2}
        />
      </mesh>

      <pointLight position={[0, 3.0, 1.0]} intensity={1.5} color="#34d399" distance={8} />

      {discardPassageResolved && (
        <Interactable
          id="door_north_threshold"
          name="Courtyard of the Watchers"
          position={[0, 0, -20.5]}
          radius={3.0}
          promptText="Cross Threshold into Watcher's Courtyard"
          onInteract={enterDeadHandCourtyard}
        />
      )}
    </group>
  );
}

/**
 * Reliquary of Lost Discards ([ 0, 0, 3.0 ])
 * Allows the player to draw candidate tiles for the sacrificial dilemma.
 */
function ReliquaryTable() {
  const { addTileToInventory, inventoryTiles, setNarrativeMessage } = useGameStore();
  const hasCandidates =
    inventoryTiles.includes('tile_bamboo_4') || inventoryTiles.includes('tile_dragon_red');

  const handleDrawTiles = () => {
    addTileToInventory('tile_bamboo_4');
    addTileToInventory('tile_dragon_red');
    setNarrativeMessage(
      'Drew Bamboo 4 and Red Dragon from the Reliquary. Choose which one to discard into the altars.',
    );
  };

  return (
    <group position={[0, 0, 3.0]}>
      {/* Stone Table Pedestal */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.9, 0.8]} />
        <meshStandardMaterial color="#16201b" roughness={0.6} />
      </mesh>

      {/* Hovering Golden Plaque Rune */}
      <mesh position={[0, 1.1, 0]}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#d97706"
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>
      <pointLight position={[0, 1.2, 0]} intensity={0.9} color="#fbbf24" distance={4} />

      {!hasCandidates && (
        <Interactable
          id="reliquary_passage_tiles"
          name="Reliquary of Discards"
          position={[0, 0, 3.0]}
          radius={2.8}
          promptText="Draw Offering Tiles from Reliquary"
          onInteract={handleDrawTiles}
        />
      )}
    </group>
  );
}

export function DiscardPassageEnvironment() {
  return (
    <group>
      {/* Ambient Lighting & Fog */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 15, 5]} intensity={0.6} castShadow />

      {/* South Entry Platform ([0, 0, 4.0]) */}
      <mesh position={[0, -0.1, 4.0]} receiveShadow>
        <boxGeometry args={[10.0, 0.2, 8.0]} />
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </mesh>

      {/* Reliquary Offering Table */}
      <ReliquaryTable />

      {/* West Scholar's Walkway */}
      <mesh position={[-4.0, -0.1, -12.0]} receiveShadow>
        <boxGeometry args={[4.5, 0.2, 24.0]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* East Regent's Walkway */}
      <mesh position={[4.0, -0.1, -12.0]} receiveShadow>
        <boxGeometry args={[4.5, 0.2, 24.0]} />
        <meshStandardMaterial color="#18181b" roughness={0.8} />
      </mesh>

      {/* North Connector Terrace ([0, -0.1, -19.0]) */}
      <mesh position={[0, -0.1, -19.0]} receiveShadow>
        <boxGeometry args={[12.0, 0.2, 6.0]} />
        <meshStandardMaterial color="#0b1319" roughness={0.8} />
      </mesh>

      {/* Central Void Abyss Gap */}
      <mesh position={[0, -10.0, -10.0]}>
        <boxGeometry args={[2.0, 0.1, 20.0]} />
        <meshBasicMaterial color="#030712" />
      </mesh>

      {/* Canyon Boundary Walls */}
      <mesh position={[-7.5, 5.0, -8.0]} receiveShadow>
        <boxGeometry args={[1.0, 10.0, 32.0]} />
        <meshStandardMaterial color="#030712" roughness={0.9} />
      </mesh>
      <mesh position={[7.5, 5.0, -8.0]} receiveShadow>
        <boxGeometry args={[1.0, 10.0, 32.0]} />
        <meshStandardMaterial color="#030712" roughness={0.9} />
      </mesh>
      <mesh position={[0, 5.0, 7.5]} receiveShadow>
        <boxGeometry args={[16.0, 10.0, 1.0]} />
        <meshStandardMaterial color="#030712" roughness={0.9} />
      </mesh>
      <mesh position={[0, 5.0, -24.0]} receiveShadow>
        <boxGeometry args={[16.0, 10.0, 1.0]} />
        <meshStandardMaterial color="#030712" roughness={0.9} />
      </mesh>

      {/* Sacrificial Altars */}
      <ArchivistFurnace />
      <RegentBrazier />

      {/* Spatial Physical Gates */}
      <SpatialGates />

      {/* North Threshold Portal */}
      <NorthThreshold />
    </group>
  );
}

export function DiscardPassageScene() {
  return (
    <group>
      <DiscardPassageEnvironment />
    </group>
  );
}

export default DiscardPassageScene;
