import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { useSettingsStore } from '../../state/settingsStore';

const idealCameraOffset = new THREE.Vector3(0, 3.2, 5.2);
const idealLookTarget = new THREE.Vector3(0, 1.2, 0);
const currentCameraPos = new THREE.Vector3();
const currentLookTarget = new THREE.Vector3();

export function ThirdPersonCamera() {
  const { camera } = useThree();
  const { playerPosition } = useGameStore();
  const { reducedMotion } = useSettingsStore();

  const isInitialized = useRef(false);

  useFrame((_, delta) => {
    const playerX = playerPosition[0];
    const playerY = playerPosition[1];
    const playerZ = playerPosition[2];

    const targetPos = idealCameraOffset.clone().add(new THREE.Vector3(playerX, playerY, playerZ));
    const lookPos = idealLookTarget.clone().add(new THREE.Vector3(playerX, playerY, playerZ));

    if (!isInitialized.current) {
      currentCameraPos.copy(targetPos);
      currentLookTarget.copy(lookPos);
      camera.position.copy(currentCameraPos);
      camera.lookAt(currentLookTarget);
      isInitialized.current = true;
      return;
    }

    // Lerp rate: faster if reduced motion is enabled to minimize vestibular discomfort
    const lerpRate = reducedMotion ? 12 : 5.5;
    const factor = Math.min(1, delta * lerpRate);

    currentCameraPos.lerp(targetPos, factor);
    currentLookTarget.lerp(lookPos, factor);

    camera.position.copy(currentCameraPos);
    camera.lookAt(currentLookTarget);
  });

  return null;
}

export default ThirdPersonCamera;
