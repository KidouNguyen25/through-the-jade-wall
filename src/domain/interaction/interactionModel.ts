export interface InteractableObject {
  id: string;
  name: string;
  position: [number, number, number];
  radius: number;
  promptText: string;
  inspectTitle?: string;
  inspectDescription?: string;
}

export function isWithinInteractionRange(
  playerPos: [number, number, number],
  targetPos: [number, number, number],
  radius: number,
): boolean {
  const dx = playerPos[0] - targetPos[0];
  const dy = playerPos[1] - targetPos[1];
  const dz = playerPos[2] - targetPos[2];
  const distSq = dx * dx + dy * dy + dz * dz;
  return distSq <= radius * radius;
}

export function getNearestInteractable(
  playerPos: [number, number, number],
  interactables: InteractableObject[],
): InteractableObject | null {
  let nearest: InteractableObject | null = null;
  let minDistanceSq = Infinity;

  for (const obj of interactables) {
    const dx = playerPos[0] - obj.position[0];
    const dy = playerPos[1] - obj.position[1];
    const dz = playerPos[2] - obj.position[2];
    const distSq = dx * dx + dy * dy + dz * dz;

    if (distSq <= obj.radius * obj.radius && distSq < minDistanceSq) {
      minDistanceSq = distSq;
      nearest = obj;
    }
  }

  return nearest;
}
