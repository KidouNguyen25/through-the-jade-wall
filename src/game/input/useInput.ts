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

const globalInput: InputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  sprint: false,
  interact: false,
  pause: false,
};

let listenersAttached = false;

function handleKeyDown(e: KeyboardEvent) {
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
      globalInput.forward = true;
      break;
    case 'KeyS':
    case 'ArrowDown':
      globalInput.backward = true;
      break;
    case 'KeyA':
    case 'ArrowLeft':
      globalInput.left = true;
      break;
    case 'KeyD':
    case 'ArrowRight':
      globalInput.right = true;
      break;
    case 'ShiftLeft':
    case 'ShiftRight':
      globalInput.sprint = true;
      break;
    case 'KeyE':
    case 'Space':
      globalInput.interact = true;
      break;
    case 'Escape':
      globalInput.pause = true;
      break;
  }
}

function handleKeyUp(e: KeyboardEvent) {
  switch (e.code) {
    case 'KeyW':
    case 'ArrowUp':
      globalInput.forward = false;
      break;
    case 'KeyS':
    case 'ArrowDown':
      globalInput.backward = false;
      break;
    case 'KeyA':
    case 'ArrowLeft':
      globalInput.left = false;
      break;
    case 'KeyD':
    case 'ArrowRight':
      globalInput.right = false;
      break;
    case 'ShiftLeft':
    case 'ShiftRight':
      globalInput.sprint = false;
      break;
    case 'KeyE':
    case 'Space':
      globalInput.interact = false;
      break;
    case 'Escape':
      globalInput.pause = false;
      break;
  }
}

export function useInput() {
  const inputRef = useRef(globalInput);

  useEffect(() => {
    if (!listenersAttached && typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      listenersAttached = true;
    }
  }, []);

  return inputRef;
}
