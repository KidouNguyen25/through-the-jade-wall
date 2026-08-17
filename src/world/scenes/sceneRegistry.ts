import React from 'react';
import { SceneId } from '../../domain/save/saveSchema';
import RainAlleyScene from './RainAlleyScene';
import EastArcadeScene from './EastArcadeScene';
import MemoryRoomScene from './MemoryRoomScene';
import DiscardPassageScene from './DiscardPassageScene';
import DeadHandScene from './DeadHandScene';
import BossCourtScene from './BossCourtScene';

export interface SceneDefinition {
  id: SceneId;
  component: React.ComponentType;
  title: string;
  actTitle: string;
}

export const SCENE_REGISTRY: Record<SceneId, SceneDefinition> = {
  rain_alley: {
    id: 'rain_alley',
    component: RainAlleyScene,
    title: 'Rain Alley',
    actTitle: 'Prologue // Rain Alley',
  },
  east_arcade: {
    id: 'east_arcade',
    component: EastArcadeScene,
    title: 'East Arcade',
    actTitle: 'Act I // East Arcade — Three Balconies',
  },
  memory_room: {
    id: 'memory_room',
    component: MemoryRoomScene,
    title: 'Memory Sanctuary',
    actTitle: 'Act I // Memory Sanctuary — Dais of Triads',
  },
  discard_passage: {
    id: 'discard_passage',
    component: DiscardPassageScene,
    title: 'Passage of Broken Tiles',
    actTitle: 'Act I // Passage of Broken Tiles',
  },
  dead_hand: {
    id: 'dead_hand',
    component: DeadHandScene,
    title: 'Courtyard of the Watchers',
    actTitle: 'Act I // Courtyard of the Watchers',
  },
  boss_court: {
    id: 'boss_court',
    component: BossCourtScene,
    title: 'Seat of the Dealer',
    actTitle: 'Act I // Seat of the Dealer',
  },
};

/**
 * Returns the scene definition for the given SceneId.
 * Fails clearly in development if an unknown scene ID is provided.
 */
export function getSceneDefinition(sceneId: SceneId): SceneDefinition {
  const definition = SCENE_REGISTRY[sceneId];
  if (!definition) {
    throw new Error(
      `[SceneRegistry] Unknown sceneId: "${sceneId}". Registered scenes are: ${Object.keys(
        SCENE_REGISTRY,
      ).join(', ')}`,
    );
  }
  return definition;
}
