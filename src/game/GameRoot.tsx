import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import PlayerController from './player/PlayerController';
import ThirdPersonCamera from './camera/ThirdPersonCamera';
import RainAlleyScene from '../world/scenes/RainAlleyScene';

export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} color="#2d4a3e" />
      <directionalLight
        position={[4, 10, 5]}
        intensity={0.8}
        color="#c6f6d5"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
    </>
  );
}

export function GameRoot() {
  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative' }}
      data-testid="game-canvas-container"
    >
      <Canvas shadows>
        <color attach="background" args={['#050807']} />
        <fog attach="fog" args={['#050807', 6, 26]} />
        <PerspectiveCamera makeDefault position={[0, 3.2, 14]} fov={55} />
        <ThirdPersonCamera />
        <SceneLighting />
        <RainAlleyScene />
        <PlayerController />
      </Canvas>
    </div>
  );
}

export default GameRoot;
