/**
 * Engine-Local Player Runtime State
 *
 * Maintains frame-local transform (position, rotation, locomotion state)
 * without triggering React rerenders or Zustand store publications every frame.
 */

interface PlayerRuntimeState {
  x: number;
  y: number;
  z: number;
  rotation: number;
  isMoving: boolean;
}

const runtimeState: PlayerRuntimeState = {
  x: 0,
  y: 0,
  z: 0,
  rotation: 0,
  isMoving: false,
};

// Reusable scratch snapshot tuple to avoid allocations when querying position
const cachedPositionTuple: [number, number, number] = [0, 0, 0];

type RuntimeSyncListener = (x: number, y: number, z: number, rotation: number) => void;
const syncListeners = new Set<RuntimeSyncListener>();

/**
 * Subscribes to runtime synchronization events (e.g. scene spawn, teleport, checkpoint load).
 */
export function onPlayerRuntimeSync(listener: RuntimeSyncListener): () => void {
  syncListeners.add(listener);
  return () => {
    syncListeners.delete(listener);
  };
}

/**
 * Returns a tuple representing the current runtime player position [x, y, z].
 * Note: the returned tuple is reused for high-frequency reads.
 */
export function getPlayerRuntimePosition(): [number, number, number] {
  cachedPositionTuple[0] = runtimeState.x;
  cachedPositionTuple[1] = runtimeState.y;
  cachedPositionTuple[2] = runtimeState.z;
  return cachedPositionTuple;
}

/**
 * Copies the current runtime position into a target vector-like object (e.g. THREE.Vector3).
 */
export function copyPlayerRuntimePositionTo(target: {
  set: (x: number, y: number, z: number) => void;
}): void {
  target.set(runtimeState.x, runtimeState.y, runtimeState.z);
}

/**
 * Returns current player facing rotation in radians.
 */
export function getPlayerRuntimeRotation(): number {
  return runtimeState.rotation;
}

/**
 * Returns whether player is currently moving.
 */
export function isPlayerRuntimeMoving(): boolean {
  return runtimeState.isMoving;
}

/**
 * Sets the runtime player position. Called from PlayerController in useFrame.
 */
export function setPlayerRuntimePosition(x: number, y: number, z: number): void {
  runtimeState.x = x;
  runtimeState.y = y;
  runtimeState.z = z;
}

/**
 * Sets the runtime player rotation.
 */
export function setPlayerRuntimeRotation(rot: number): void {
  runtimeState.rotation = rot;
}

/**
 * Sets the locomotion moving flag.
 */
export function setPlayerRuntimeMoving(isMoving: boolean): void {
  runtimeState.isMoving = isMoving;
}

/**
 * Synchronizes runtime state from durable game/save state (e.g. on scene load, portal warp, save load).
 */
export function syncPlayerRuntimeFromDurable(
  position: [number, number, number],
  rotation = 0,
): void {
  runtimeState.x = position[0];
  runtimeState.y = position[1];
  runtimeState.z = position[2];
  runtimeState.rotation = rotation;
  runtimeState.isMoving = false;

  for (const listener of syncListeners) {
    listener(position[0], position[1], position[2], rotation);
  }
}

/**
 * Takes a fresh snapshot tuple of current player position for durable storage (e.g. saveGame / checkpoint).
 */
export function takePlayerPositionSnapshot(): [number, number, number] {
  return [runtimeState.x, runtimeState.y, runtimeState.z];
}

/**
 * Resets player runtime state to origin.
 */
export function resetPlayerRuntime(): void {
  syncPlayerRuntimeFromDurable([0, 0, 0], 0);
}
