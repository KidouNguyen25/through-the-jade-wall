import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { useGameStore } from './state/gameStore';
import './index.css';

// Expose reset for testing environments
if (typeof window !== 'undefined') {
  (window as unknown as { __RESET_GAME__: () => void }).__RESET_GAME__ = () => {
    useGameStore.getState().resetGame();
  };
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element to mount the application.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
