export type SpeakerId = 'Alice' | 'Keeper Echo' | 'Observation Log' | 'The Dealer';

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
