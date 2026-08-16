export type SpeakerId =
  | 'Alice'
  | 'Keeper Echo'
  | 'Observation Log'
  | 'The Dealer'
  | 'Inscription of the Bifurcation'
  | 'Archivist Stone Furnace'
  | 'Archivist Echo'
  | 'Regent Brazen Brazier'
  | 'Vermilion Regent Echo'
  | 'Altar of Discard';

export interface DialogueChoice {
  label: string;
  nextNodeId: string;
  setFlag?: string;
}

export interface DialogueNode {
  id: string;
  speaker: SpeakerId;
  speakerRole?: string;
  text: string;
  choices?: DialogueChoice[];
  nextNodeId?: string;
}

export interface DialogueTree {
  id: string;
  initialNodeId: string;
  nodes: Record<string, DialogueNode>;
}
