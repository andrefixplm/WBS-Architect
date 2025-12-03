import { Node, Edge } from 'reactflow';

export enum WBSType {
  PROJECT = 'PROJECT',
  PHASE = 'PHASE',
  TASK = 'TASK',
  MILESTONE = 'MILESTONE',
}

export interface WBSNodeData {
  label: string;
  type: WBSType;
  description?: string;
  wbsCode?: string; // e.g., "1.2.1"
  duration?: number;
  progress?: number;
}

export type WBSNode = Node<WBSNodeData>;

// For PLMXML Export structure
export interface PLMXMLItem {
  id: string;
  name: string;
  wbsCode: string;
  type: string;
  children: PLMXMLItem[];
}
