import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../state/gameStore';
import { useInput } from '../input/useInput';
import { isWithinInteractionRange } from '../../domain/interaction/interactionModel';
import { getPlayerRuntimePosition } from '../runtime/playerRuntime';

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
  const isInRangeRef = useRef(false);
  const lastPublishedPromptRef = useRef<string | null>(null);

  const isPaused = useGameStore((state) => state.isPaused);
  const activeInteractableId = useGameStore((state) => state.activeInteractable?.id ?? null);
  const setActiveInteractable = useGameStore((state) => state.setActiveInteractable);
  const setActiveInspection = useGameStore((state) => state.setActiveInspection);

  // Clear active interactable if this component unmounts while active
  useEffect(() => {
    return () => {
      if (useGameStore.getState().activeInteractable?.id === id) {
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

    // Query engine-local runtime player position directly without React rerender
    const runtimePos = getPlayerRuntimePosition();
    const inRange = isWithinInteractionRange(runtimePos, position, radius);

    if (inRange) {
      const isAlreadyActiveForThis = activeInteractableId === id;
      const isAvailable = !activeInteractableId;

      if (isAlreadyActiveForThis) {
        // Only republish if prompt metadata semantically changed
        if (lastPublishedPromptRef.current !== promptText) {
          lastPublishedPromptRef.current = promptText;
          setActiveInteractable({
            id,
            name,
            position,
            radius,
            promptText,
            inspectTitle,
            inspectDescription,
          });
        }
      } else if (isAvailable) {
        // Claim active interactable
        isInRangeRef.current = true;
        lastPublishedPromptRef.current = promptText;
        setActiveInteractable({
          id,
          name,
          position,
          radius,
          promptText,
          inspectTitle,
          inspectDescription,
        });
      }

      // Trigger interaction on key down (edge trigger)
      const isInteracting = inputRef.current.interact;
      if (isInteracting && !wasInteracting.current && (isAlreadyActiveForThis || isAvailable)) {
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
    } else {
      if (isInRangeRef.current || activeInteractableId === id) {
        isInRangeRef.current = false;
        lastPublishedPromptRef.current = null;
        wasInteracting.current = false;
        if (activeInteractableId === id) {
          setActiveInteractable(null);
        }
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
