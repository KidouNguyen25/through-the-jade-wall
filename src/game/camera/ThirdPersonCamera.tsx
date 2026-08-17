import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSettingsStore } from '../../state/settingsStore';
import { getPlayerRuntimePosition } from '../runtime/playerRuntime';

// Reusable static scratch objects to eliminate per-frame allocations
const idealCameraOffset = new THREE.Vector3(0, 3.2, 5.2);
const idealLookTarget = new THREE.Vector3(0, 1.2, 0);
const currentCameraPos = new THREE.Vector3();
const currentLookTarget = new THREE.Vector3();
const playerPosScratch = new THREE.Vector3();
const targetPosScratch = new THREE.Vector3();
const lookPosScratch = new THREE.Vector3();

export function ThirdPersonCamera() {
  const { camera } = useThree();
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);

  const isInitialized = useRef(false);

  useFrame((_, delta) => {
    // Read engine-local runtime position without React subscription churn
    const [px, py, pz] = getPlayerRuntimePosition();
    playerPosScratch.set(px, py, pz);

    // Compute target camera and look positions in-place (0 vector allocations)
    targetPosScratch.copy(idealCameraOffset).add(playerPosScratch);
    lookPosScratch.copy(idealLookTarget).add(playerPosScratch);

    if (!isInitialized.current) {
      currentCameraPos.copy(targetPosScratch);
      currentLookTarget.copy(lookPosScratch);
      camera.position.copy(currentCameraPos);
      camera.lookAt(currentLookTarget);
      isInitialized.current = true;
      return;
    }

    // Lerp rate: faster if reduced motion is enabled to minimize vestibular discomfort
    const lerpRate = reducedMotion ? 12 : 5.5;
    const factor = Math.min(1, delta * lerpRate);

    currentCameraPos.lerp(targetPosScratch, factor);
    currentLookTarget.lerp(lookPosScratch, factor);

    camera.position.copy(currentCameraPos);
    camera.lookAt(currentLookTarget);
  });

  return null;
}

export default ThirdPersonCamera;
