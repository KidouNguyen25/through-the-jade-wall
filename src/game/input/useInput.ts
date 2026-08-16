import { useEffect, useRef } from 'react';

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  interact: boolean;
  pause: boolean;
}

export function useInput() {
  const inputRef = useRef<InputState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    interact: false,
    pause: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore inputs if typing in an input element
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          inputRef.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          inputRef.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          inputRef.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          inputRef.current.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          inputRef.current.sprint = true;
          break;
        case 'KeyE':
        case 'Space':
          inputRef.current.interact = true;
          break;
        case 'Escape':
          inputRef.current.pause = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          inputRef.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          inputRef.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          inputRef.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          inputRef.current.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          inputRef.current.sprint = false;
          break;
        case 'KeyE':
        case 'Space':
          inputRef.current.interact = false;
          break;
        case 'Escape':
          inputRef.current.pause = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return inputRef;
}
