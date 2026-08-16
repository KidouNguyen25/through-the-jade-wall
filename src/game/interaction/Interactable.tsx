import { useRef, useEffect } from 'react';
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

  // Clear active interactable if this component unmounts while active
  useEffect(() => {
    return () => {
      const current = useGameStore.getState().activeInteractable;
      if (current?.id === id) {
        useGameStore.getState().setActiveInteractable(null);
      }
    };
  }, [id]);

  // Support direct click / programmatic interaction event dispatch
  useEffect(() => {
    const handleCustomInteract = (e: Event) => {
      const customEvent = e as CustomEvent<{ id?: string }>;
      if (customEvent.detail?.id === id) {
        if (onInteract) {
          onInteract();
          useGameStore.getState().setActiveInteractable(null);
        } else if (inspectTitle && inspectDescription) {
          useGameStore.getState().setActiveInspection({
            title: inspectTitle,
            description: inspectDescription,
          });
        }
      }
    };

    window.addEventListener('ttjw-interact', handleCustomInteract);
    return () => {
      window.removeEventListener('ttjw-interact', handleCustomInteract);
    };
  }, [id, onInteract, inspectTitle, inspectDescription]);

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
            setActiveInteractable(null);
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
