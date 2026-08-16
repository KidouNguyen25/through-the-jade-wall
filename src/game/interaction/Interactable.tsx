import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { useInput } from '../input/useInput';
import { isWithinInteractionRange } from '../../domain/interaction/interactionModel';

interface InteractableProps {
  id: string;
  name: string;
  position: [number, number, number];
  radius?: number;
  promptText: string;
  inspectTitle?: string;
  inspectDescription?: string;
  onInteract?: () => void;
  children?: React.ReactNode;
}

export function Interactable({
  id,
  name,
  position,
  radius = 2.2,
  promptText,
  inspectTitle,
  inspectDescription,
  onInteract,
  children,
}: InteractableProps) {
  const groupRef = useRef<THREE.Group>(null);
  const inputRef = useInput();
  const wasInteracting = useRef(false);

  const {
    playerPosition,
    activeInteractable,
    setActiveInteractable,
    setActiveInspection,
    isPaused,
  } = useGameStore();

  useFrame(() => {
    if (isPaused) return;

    const inRange = isWithinInteractionRange(playerPosition, position, radius);

    if (inRange) {
      if (!activeInteractable || activeInteractable.id === id) {
        setActiveInteractable({
          id,
          name,
          position,
          radius,
          promptText,
          inspectTitle,
          inspectDescription,
        });

        // Trigger on key down (edge trigger)
        const isInteracting = inputRef.current.interact;
        if (isInteracting && !wasInteracting.current) {
          if (onInteract) {
            onInteract();
          } else if (inspectTitle && inspectDescription) {
            setActiveInspection({
              title: inspectTitle,
              description: inspectDescription,
            });
          }
        }
        wasInteracting.current = isInteracting;
      }
    } else {
      if (activeInteractable?.id === id) {
        setActiveInteractable(null);
        wasInteracting.current = false;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {children}
    </group>
  );
}

export default Interactable;
