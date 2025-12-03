import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { WBSNodeData } from '../types';
import { NODE_CONFIG } from '../constants';
import { Settings2 } from 'lucide-react';

const CustomWBSNode = ({ data, selected }: NodeProps<WBSNodeData>) => {
  const config = NODE_CONFIG[data.type];
  const Icon = config.icon;

  return (
    <div
      className={`
        w-64 shadow-lg rounded-lg border-2 bg-white transition-all duration-200
        ${selected ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-slate-200 hover:border-slate-300'}
      `}
    >
      {/* Top Handle (Incoming) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-slate-400 !border-2 !border-white rounded-full hover:bg-primary transition-colors"
      />

      {/* Header */}
      <div className={`
        flex items-center justify-between px-3 py-2 rounded-t-md text-white
        ${config.color}
      `}>
        <div className="flex items-center gap-2">
          <Icon size={16} />
          <span className="text-xs font-bold uppercase tracking-wider opacity-90">
            {config.label}
          </span>
        </div>
        {data.wbsCode && (
           <span className="text-xs font-mono bg-white/20 px-1.5 py-0.5 rounded text-white">
             {data.wbsCode}
           </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="font-semibold text-slate-800 text-sm mb-1 truncate" title={data.label}>
          {data.label}
        </div>
        {data.description && (
          <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {data.description}
          </div>
        )}
      </div>

      {/* Footer / Meta */}
      <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-md">
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
            {/* Placeholder for progress bar or stats */}
            {data.progress !== undefined && (
                <div className="flex items-center gap-1">
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${data.progress}%` }}></div>
                    </div>
                    <span>{data.progress}%</span>
                </div>
            )}
        </div>
        <Settings2 size={12} className="text-slate-300" />
      </div>

      {/* Bottom Handle (Outgoing) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-slate-400 !border-2 !border-white rounded-full hover:bg-primary transition-colors"
      />
    </div>
  );
};

export default memo(CustomWBSNode);
