import { WBSType, WBSNode } from './types';
import { Layout, Folder, CheckSquare, Flag } from 'lucide-react';

export const NODE_CONFIG = {
  [WBSType.PROJECT]: {
    color: 'bg-indigo-600',
    borderColor: 'border-indigo-600',
    icon: Layout,
    label: 'Project',
    defaultLabel: 'New Project',
  },
  [WBSType.PHASE]: {
    color: 'bg-blue-500',
    borderColor: 'border-blue-500',
    icon: Folder,
    label: 'Phase',
    defaultLabel: 'New Phase',
  },
  [WBSType.TASK]: {
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-500',
    icon: CheckSquare,
    label: 'Task',
    defaultLabel: 'New Task',
  },
  [WBSType.MILESTONE]: {
    color: 'bg-amber-500',
    borderColor: 'border-amber-500',
    icon: Flag,
    label: 'Milestone',
    defaultLabel: 'Milestone',
  },
};

export const INITIAL_NODES: WBSNode[] = [
  {
    id: '1',
    type: 'wbsNode',
    position: { x: 250, y: 50 },
    data: { label: 'Main Project', type: WBSType.PROJECT, wbsCode: '1' },
  },
];

export const INITIAL_EDGES = [];